import express from "express";
import {
	signupStudent,
	loginStudent,
	forgotPassword,
	changePassword,
} from "../controllers/studentControllers";
import { authoriseStudent } from "../middleware/authorise";
import CourseController from "../controllers/courseController";

const router = express.Router();

router.post("/signup", signupStudent);
router.post("/login", loginStudent);

router.use(authoriseStudent("ADMIN"));

router.post("/changepassword/:token", changePassword);

router.post("/forgotPassword", forgotPassword);

// router.use(authoriseStudent("ADMIN"));
// router.post("/add", CourseController.createCourse);

export default router;
