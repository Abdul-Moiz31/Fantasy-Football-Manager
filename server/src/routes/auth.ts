import express from "express"
import { validateToken, loginOrRegister } from "@/controllers/authController"

const router = express.Router()

router.get("/validate", validateToken)
router.post("/", loginOrRegister)

export default router
