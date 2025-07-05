import express from "express";
import {
	editStudent,
	removeStudent,
	getStudent,
	queryStudents,
	getStudents,
	getStudentCount,
	getCurrentStudent,
	logoutStudent,
} from "../controllers/studentControllers";
import { validateStudent } from "../validators/studentValidator";
import { authenticate } from "../middleware/authMiddleWare";
import { ensureAutheticated } from "../middleware/ensureAutheticated";

const router = express.Router();
router.post("/logout", logoutStudent);

router.use(authenticate);

router.get("/", getStudents);
router.get("/current", ensureAutheticated, getCurrentStudent);
router.get("/query", queryStudents);
router.get("/count", getStudentCount);
router.get("/student/:id", getStudent);
router.put("/edit/:id", validateStudent, editStudent);
router.delete("/:id", removeStudent);

export default router;
