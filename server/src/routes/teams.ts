import express from "express"
import {
  createTeam,
  getAllTeams,
  getMyTeam,
  getTeamStatus,
  addPlayerToTeam,
  removePlayerFromTeam,
  getLeaderboard,
} from "@/controllers/teamsController"

const router = express.Router()

router.post("/", createTeam)
router.get("/", getAllTeams)
router.get("/my-team", getMyTeam)
router.get("/status", getTeamStatus)
router.get("/leaderboard", getLeaderboard)
router.post("/add-player", addPlayerToTeam)
router.delete("/remove-player/:playerId", removePlayerFromTeam)

export default router
