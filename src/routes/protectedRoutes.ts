import express from "express";
import {
	forgotPassword,
	resetPassword,
	editStudent,
	removeStudent,
	getStudent,
	queryStudents,
	getStudents,
	getStudentCount,
} from "../controllers/studentControllers";
import { validateStudent } from "../validators/studentValidator";
import { authenticate } from "../middleware/authMiddleWare";

const router = express.Router();

router.use(authenticate);

router.post("/resetPassword/:token", resetPassword);
router.get("/", getStudents);
router.get("/query", queryStudents);
router.get("/count", getStudentCount);
router.get("/student/:id", getStudent);
router.put("/edit/:id", validateStudent, editStudent);
router.delete("/:id", removeStudent);

router.get("/forgotPassword", forgotPassword);
export default router;
