import express from "express"
import { 
  getMarketPlayers, 
  sellPlayer, 
  buyPlayer, 
  removeFromMarketPatch, 
  removeFromMarketDelete 
} from "@/controllers/marketController"

const router = express.Router()

router.get("/players", getMarketPlayers)
router.post("/sell", sellPlayer)
router.post("/buy", buyPlayer)
router.patch("/remove", removeFromMarketPatch)
router.delete("/remove/:playerId", removeFromMarketDelete)

export default router 