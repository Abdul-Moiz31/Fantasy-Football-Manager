import express from "express"
import cors from "cors"
import { CORS_OPTIONS } from "@/constants"
import { authenticateToken } from "@/middleware/auth"
import authRoutes from "@/routes/auth"
import teamRoutes from "@/routes/teams"
import playerRoutes from "@/routes/players"
import marketRoutes from "@/routes/market";

const app = express()

// Middleware
app.use(cors(CORS_OPTIONS))
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/players", playerRoutes)

// Protected routes
app.use("/api/teams", authenticateToken, teamRoutes)
app.use("/api/market", authenticateToken, marketRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", error)
  res.status(500).json({
    success: false,
    message: "Internal server error",
  })
})

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

export default app
