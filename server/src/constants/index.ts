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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean) as string[];

export const CORS_OPTIONS = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin in production)
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}
