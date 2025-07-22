export const TEAM_CONSTRAINTS = {
  MAX_PLAYERS: 25,
  MIN_PLAYERS: 15,
  MAX_GOALKEEPERS: 3,
  MAX_DEFENDERS: 8,
  MAX_MIDFIELDERS: 8,
  MAX_FORWARDS: 6,
  INITIAL_BUDGET: 5000000, // 5M
} as const

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
export const JWT_EXPIRES_IN = "1d"

export const CORS_OPTIONS = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}
