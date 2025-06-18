import express from "express";
import {
	getStudents,
	addStudent,
	editStudent,
	removeStudent,
	queryStudents,
	getStudentCount,
	getStudent,
} from "../controllers/studentControllers";

import { validateStudent } from "../validators/studentValidator";

const router = express.Router();

router.get("/", getStudents);
router.get("/query", queryStudents);
router.get("/count", getStudentCount);
router.get("/student/:id", getStudent);

router.post("/add", validateStudent, addStudent);
router.put("/edit/:id", validateStudent, editStudent);
router.delete("/:id", removeStudent);

export default router;
