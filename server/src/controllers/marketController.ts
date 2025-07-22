import express from "express"
import { dbService } from "@/services/DbService"
import { TEAM_CONSTRAINTS } from "@/constants"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const getEffectiveTeamSize = async (userId: string): Promise<number> => {
  const team = await dbService.getTeamByUserId(userId)
  if (!team) return 0
  
  return team.players?.length || 0
}

export const getMarketPlayers = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, team, minPrice, maxPrice, my } = req.query
    const user = (req as any).user
    let listings = await dbService.getMarketListings()

    const enhancedListings = listings.map((l: any) => ({
      ...l,
      price: Math.floor((l.asking_price || 100000) * 0.95),
      position: l.players?.position || "-",
      sellerTeamName: l.teams?.name || "-",
      playerName: l.players?.name || "-",
      playerId: l.player_id,
      teamId: l.team_id,
      userId: l.teams?.user_id || "",
    }))
    
    let filtered = enhancedListings
    if (my && user) {
      filtered = filtered.filter((l) => l.userId === user.id)
    } else if (user) {
      filtered = filtered.filter((l) => l.userId !== user.id)
    }
    if (name) filtered = filtered.filter((l) => l.playerName.toLowerCase().includes((name as string).toLowerCase()))
    if (team) filtered = filtered.filter((l) => l.teamId === team)
    if (minPrice) filtered = filtered.filter((l) => l.price >= Number(minPrice))
    if (maxPrice) filtered = filtered.filter((l) => l.price <= Number(maxPrice))
    
    res.json({
      success: true,
      data: filtered
    })
  } catch (error) {
    console.error('Error fetching market listings:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching market listings' 
    })
  }
}

export const sellPlayer = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { playerId, price, listing_price } = req.body
    const user = (req as any).user

    // Accept both 'price' and 'listing_price' field names
    const playerPrice = price || listing_price

    if (!playerId || !playerPrice || playerPrice <= 0) {
      res.status(400).json({ 
        success: false,
        message: "Player ID and valid price are required" 
      })
      return
    }

    const team = await dbService.getTeamByUserId(user.id)
    
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    // Check if player is in user's team
    const playerInTeam = team.players.find((p: any) => p.id === playerId)
    if (!playerInTeam) {
      res.status(400).json({ 
        success: false,
        message: "Player not in your team" 
      })
      return
        }
    
    const effectiveTeamSize = await getEffectiveTeamSize(user.id)
    if (effectiveTeamSize <= TEAM_CONSTRAINTS.MIN_PLAYERS) {
      res.status(400).json({ 
        success: false,
        message: `Cannot list player. Your effective team size would be below minimum (${TEAM_CONSTRAINTS.MIN_PLAYERS} players)` 
      })
      return
    }

    // Create market listing
    await dbService.createMarketListing(team.id, playerId, parseInt(playerPrice))
    
    // Get updated team
    const updatedTeam = await dbService.getTeamByUserId(user.id)
    
    res.json({
      success: true,
      data: updatedTeam,
      message: "Player listed for sale successfully"
    })
  } catch (error) {
    console.error("Error creating market listing:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to list player for sale" 
    })
  }
}

export const buyPlayer = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { playerId } = req.body
    const user = (req as any).user

    if (!playerId) {
      res.status(400).json({ 
        success: false,
        message: "Player ID is required" 
      })
      return
    }

    const team = await dbService.getTeamByUserId(user.id)
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    // Find the listing
    const listings = await dbService.getMarketListings()
    const listing = listings.find((l: any) => l.player_id === playerId)
    if (!listing) {
      res.status(404).json({ 
        success: false,
        message: "Player listing not found" 
      })
      return
    }

    // Check if trying to buy own player
    if (listing.teams?.user_id === user.id) {
      res.status(400).json({ 
        success: false,
        message: "Cannot buy your own player" 
      })
      return
    }

    // Calculate purchase price (95% of asking price)
    const purchasePrice = Math.floor((listing.asking_price || 100000) * 0.95)

    // Check budget
    if (team.budget < purchasePrice) {
      res.status(400).json({ 
        success: false,
        message: "Insufficient budget" 
      })
      return
    }

    // Check team size
    if (team.players.length >= TEAM_CONSTRAINTS.MAX_PLAYERS) {
      res.status(400).json({ 
        success: false,
        message: `Team is full (${TEAM_CONSTRAINTS.MAX_PLAYERS} players maximum)` 
      })
      return
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Remove from market listing
      await tx.team_players.updateMany({
        where: { team_id: listing.team_id, player_id: playerId },
        data: { in_transfer_market: false, asking_price: null }
      })
      
      // Remove from seller's team
      await tx.team_players.deleteMany({ 
        where: { team_id: listing.team_id, player_id: playerId } 
      })
      
      // Add to buyer's team
      await tx.team_players.create({
        data: {
          team_id: team.id,
          player_id: playerId,
          in_transfer_market: false,
          asking_price: null,
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
      
      // Update seller budget
      await tx.teams.update({
        where: { user_id: listing.teams.user_id },
        data: { 
          budget: { increment: purchasePrice },
          updated_at: new Date()
        }
      })
      
      // Update buyer budget
      await tx.teams.update({
        where: { user_id: user.id },
        data: { 
          budget: { decrement: purchasePrice },
          updated_at: new Date()
        }
      })
        })

    const updatedTeam = await dbService.getTeamByUserId(user.id)
    
    res.json({
      success: true,
      data: updatedTeam,
      message: `Player purchased for $${purchasePrice.toLocaleString()}`
    })
  } catch (error) {
    console.error("Error buying player:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to purchase player" 
    })
  }
}

export const removeFromMarketPatch = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { playerId } = req.body
    const user = (req as any).user

    if (!playerId) {
      res.status(400).json({ 
        success: false,
        message: "Player ID is required" 
      })
      return
    }

    const team = await dbService.getTeamByUserId(user.id)
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    // Find the listing
    const listings = await dbService.getMarketListings()
    const listing = listings.find((l: any) => l.player_id === playerId && l.teams?.user_id === user.id)
    if (!listing) {
      res.status(404).json({ 
        success: false,
        message: "Player listing not found" 
      })
      return
    }

    // Remove from market
    await dbService.removeMarketListing(team.id, playerId)
    
    // Get updated team
    const updatedTeam = await dbService.getTeamByUserId(user.id)
    
    res.json({
      success: true,
      data: updatedTeam,
      message: "Player removed from market"
    })
  } catch (error) {
    console.error("Error removing player from market:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to remove player from market" 
    })
  }
}

export const removeFromMarketDelete = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const playerId = parseInt(req.params.playerId)
    const user = (req as any).user

    const team = await dbService.getTeamByUserId(user.id)
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    // Find the listing
    const listings = await dbService.getMarketListings()
    const listing = listings.find((l: any) => l.player_id === playerId && l.teams?.user_id === user.id)
    if (!listing) {
      res.status(404).json({ 
        success: false,
        message: "Player listing not found" 
      })
      return
    }

    // Remove from market
    await dbService.removeMarketListing(team.id, playerId)
    
    // Get updated team
    const updatedTeam = await dbService.getTeamByUserId(user.id)
    
    res.json({
      success: true,
      data: updatedTeam,
      message: "Player removed from market"
    })
  } catch (error) {
    console.error("Error removing player from market:", error)
    res.status(500).json({ 
      success: false,
      message: "Failed to remove player from market" 
    })
  }
} 