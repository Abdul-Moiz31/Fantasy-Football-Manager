import express from "express"
import { getAllPlayers, getPlayerById } from "@/controllers/playersController"

const router = express.Router()

router.get("/", getAllPlayers)
router.get("/:id", getPlayerById)

export default router
