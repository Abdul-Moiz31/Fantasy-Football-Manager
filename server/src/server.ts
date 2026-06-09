import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
import { CORS_OPTIONS } from "@/constants"
import { authenticateToken } from "@/middleware/auth"
import authRoutes from "@/routes/auth"
import teamRoutes from "@/routes/teams"
import playerRoutes from "@/routes/players"
import marketRoutes from "@/routes/market"

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors(CORS_OPTIONS))
app.use(express.json())

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/players", playerRoutes)
app.use("/api/teams", authenticateToken, teamRoutes)
app.use("/api/market", authenticateToken, marketRoutes)

// Health check (useful for Render's health checks)
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// ── Serve React build in production ──────────────────────────────────────────
const clientDistCandidates = [
  path.join(__dirname, "../../client/dist"),       // from dist/ folder
  path.join(process.cwd(), "../client/dist"),      // from server/ cwd
  path.join(process.cwd(), "client/dist"),         // from repo root cwd
]

const clientDist = clientDistCandidates.find(
  (p) => fs.existsSync(path.join(p, "index.html"))
)

if (clientDist) {
  app.use(express.static(clientDist))

  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ success: false, message: "Route not found" })
    } else {
      res.sendFile(path.join(clientDist, "index.html"))
    }
  })
} else {
  // Development: just return 404 for unknown routes
  app.use("*", (req, res) => {
    res.status(404).json({ success: false, message: "Route not found" })
  })
}

// ── Error handler ────────────────────────────────────────────────────────────
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", error)
  res.status(500).json({ success: false, message: "Internal server error" })
})

export default app
