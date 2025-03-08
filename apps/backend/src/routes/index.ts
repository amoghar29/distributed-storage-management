import express from "express"
import authRouter from "./auth"
import fileRouter from "./upload"
import authMiddleware from "../middlewares/auth.middleware"

const router = express.Router() 

router.use("/auth", authRouter)
router.use("/upload",authMiddleware, fileRouter)



export default router