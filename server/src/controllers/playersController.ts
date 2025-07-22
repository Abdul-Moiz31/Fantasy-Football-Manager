import express from "express"
import { dbService } from "@/services/DbService"

export const getAllPlayers = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const players = await dbService.getPlayers()
    res.json({
      success: true,
      data: players
    })
  } catch (error) {
    console.error('Error fetching players:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching players' 
    })
  }
}

export const getPlayerById = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const playerId = Number.parseInt(req.params.id)
    const player = await dbService.getPlayerById(playerId)

    if (!player) {
      res.status(404).json({ 
        success: false,
        message: 'Player not found' 
      })
      return
    }

    res.json({
      success: true,
      data: player
    })
  } catch (error) {
    console.error('Error fetching player:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching player' 
    })
  }
} 