import type express from "express"
import jwt from "jsonwebtoken"
import { dbService } from "@/services/DbService"
import type { JwtPayload, ApiResponse } from "@/interfaces"
import { HttpStatus } from "@/enums"
import { JWT_SECRET } from "@/constants"

export const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Access token required",
    }
    return res.status(HttpStatus.UNAUTHORIZED).json(response)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    const user = await dbService.getUserById(decoded.userId)

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        message: "User not found",
      }
      return res.status(HttpStatus.UNAUTHORIZED).json(response)
    }
    ;(req as any).user = user
    next()
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Invalid token",
    }
    return res.status(HttpStatus.UNAUTHORIZED).json(response)
  }
}
