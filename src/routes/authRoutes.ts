import express from "express";
import {
	loginStudent,
	logoutStudent,
	signupStudent,
	forgotPassword,
	resetPassword,
} from "../controllers/studentControllers";

const router = express.Router();

router.post("/signup", signupStudent);
router.post("/logout", logoutStudent);
router.get("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

router.get("/login", loginStudent);

export default router;
