import { Router } from "express";
import { register, verifyOTP, login } from "./userController";
const router = Router();

export default router.post("/register", register);
router.post("/verifyotp", verifyOTP);
router.post("/login", login);
