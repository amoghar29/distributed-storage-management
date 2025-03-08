import { Router } from "express";
import signinController from "../controllers/authController/signin";
import signupController from "../controllers/authController/signup";
const router = Router();

router.post("/signin", signinController);
router.post("/signup", signupController);

export default router;