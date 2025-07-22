import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbService } from "@/services/DbService"
import type { JwtPayload } from "@/interfaces"
import { JWT_SECRET, JWT_EXPIRES_IN, TEAM_CONSTRAINTS } from "@/constants"
import { generateId } from "@/utils"
const { createTeamAsync } = require("@/workers/teamCreationWorker.js")

export const validateToken = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false,
        message: "No token provided" 
      })
      return
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    const user = await dbService.getUserById(decoded.userId)
    
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: "User not found" 
      })
      return
    }

    const team = await dbService.getTeamByUserId(user.id)
    
    res.json({
      success: true,
      user: { id: user.id, email: user.email },
      team,
    })
  } catch (error) {
    console.error('Error validating token:', error)
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    })
  }
}

export const loginOrRegister = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      })
      return
    }
    
    let user = await dbService.getUserByEmail(email)
    
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        res.status(401).json({ 
          success: false,
          message: "Invalid credentials" 
        })
        return
      }
      
      const team = await dbService.getTeamByUserId(user.id)
      const token = jwt.sign({ userId: user.id, email: user.email } as JwtPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      })
      
      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email },
        team,
      })
    } else {
      // Register
      const hashedPassword = await bcrypt.hash(password, 10)
      const username = email.split("@")[0] + Math.floor(Math.random() * 10000)
      
      const newUser = await dbService.createUser({
        email,
        password: hashedPassword,
      })
      
      // Create team with status 'pending'
      const teamData = {
        id: generateId(),
        user_id: newUser.id,
        name: username,
        budget: TEAM_CONSTRAINTS.INITIAL_BUDGET,
        player_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      const team = await dbService.createTeam(teamData)
      
      // Start async team creation in worker thread (don't wait for completion)
      createTeamAsync(team).catch((error: any) => {
        console.error('Team creation worker failed:', error)
      })
      
      console.log('Team creation started for:', team.id)
      
      const token = jwt.sign({ userId: newUser.id, email: newUser.email } as JwtPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      })
      
      res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, email: newUser.email },
        team: {
          ...team,
          players: [] // Return empty players array so frontend shows loading
        },
      })
    }
  } catch (error) {
    console.error('Error in auth:', error)
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication' 
    })
  }
} 