import express from "express"
import { Login, logOut, signup } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",Login)
authRouter.get("/logout",logOut)

export default authRouter