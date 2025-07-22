import express from "express"
import { dbService } from "@/services/DbService"
import { generateId, validateTeamComposition } from "@/utils"
const { createTeamAsync } = require("@/workers/teamCreationWorker.js")

export const createTeam = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name } = req.body
    const user = (req as any).user

    const existingTeam = await dbService.getTeamByUserId(user.id)
    if (existingTeam) {
      res.status(409).json({ 
        success: false,
        message: "User already has a team" 
      })
      return
    }

    const teamData = {
      name,
      userId: user.id,
      budget: user.budget,
      status: 'pending' as const,
    }

    const newTeam = await createTeamAsync(teamData)
    const createdTeam = await dbService.createTeam(newTeam)

    res.status(201).json({
      success: true,
      data: createdTeam
    })
  } catch (error) {
    console.error('Error creating team:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error creating team' 
    })
  }
}

export const getAllTeams = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const teams = await dbService.getAllTeams()
    res.json({
      success: true,
      data: teams
    })
  } catch (error) {
    console.error('Error fetching teams:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching teams' 
    })
  }
}

export const getMyTeam = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const user = (req as any).user
    const team = await dbService.getTeamByUserId(user.id)
    
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    res.json({
      success: true,
      data: team
    })
  } catch (error) {
    console.error('Error fetching team:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching team' 
    })
  }
}

export const getTeamStatus = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const user = (req as any).user
    const team = await dbService.getTeamByUserId(user.id)
    
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    const status = {
      status: team.players && team.players.length >= 20 ? 'ready' : 'building',
      playersCount: team.players?.length || 0,
    }

    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error fetching team status:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching team status' 
    })
  }
}

export const addPlayerToTeam = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { playerId } = req.body
    const user = (req as any).user

    const team = await dbService.getTeamByUserId(user.id)
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    const player = await dbService.getPlayerById(playerId)
    if (!player) {
      res.status(404).json({ 
        success: false,
        message: "Player not found" 
      })
      return
    }

    // Check if player is already in team
    if (team.players.some((p) => p.id === playerId)) {
      res.status(409).json({ 
        success: false,
        message: "Player already in team" 
      })
      return
        }
    
    if (team.budget < player.value) {
      res.status(400).json({ 
        success: false,
        message: "Insufficient budget" 
      })
      return
    }

    // Check team composition
    const newPlayers = [...team.players, player]
    const validation = validateTeamComposition(newPlayers)
    if (!validation.isValid) {
      res.status(400).json({ 
        success: false,
        message: validation.errors.join(", ") 
      })
      return
    }

    await dbService.addPlayerToTeam(team.id, playerId)
    const updatedTeam = await dbService.updateTeam(team.id, {
      budget: team.budget - player.value
    })

    res.json({
      success: true,
      data: updatedTeam
    })
  } catch (error) {
    console.error('Error adding player to team:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error adding player to team' 
    })
  }
}

export const removePlayerFromTeam = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const playerId = Number.parseInt(req.params.playerId)
    const user = (req as any).user

    const team = await dbService.getTeamByUserId(user.id)
    if (!team) {
      res.status(404).json({ 
        success: false,
        message: "Team not found" 
      })
      return
    }

    const playerToRemove = team.players.find((p) => p.id === playerId)
    if (!playerToRemove) {
      res.status(404).json({ 
        success: false,
        message: "Player not in team" 
      })
      return
    }

    await dbService.removePlayerFromTeam(team.id, playerId)
    const updatedTeam = await dbService.updateTeam(team.id, {
      budget: team.budget + playerToRemove.value
    })

    res.json({
      success: true,
      data: updatedTeam
    })
  } catch (error) {
    console.error('Error removing player from team:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error removing player from team' 
    })
  }
} 