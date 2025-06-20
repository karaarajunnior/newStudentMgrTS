import express from "express";
import {
	signupStudent,
	loginStudent,
	logoutStudent,
} from "../controllers/studentControllers";

const router = express.Router();

router.post("/signup", signupStudent);
router.get("/login", loginStudent);
router.post("/logout", logoutStudent);

export default router;
