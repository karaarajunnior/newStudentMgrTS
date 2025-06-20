import { Router } from "express";
import CourseController from "../controllers/courseController";
//import { authoriseStudent } from "../middleware/authorise";

const router = Router();

router.get("/", CourseController.getAllCourses);

router.get("/enroll", CourseController.enrollStudent);
router.get("/:id", CourseController.getCourseById);
router.get("/enrollment", CourseController.getEnrollmentsByStudent);
router.get("/query", CourseController.searchCourses);

export default router;
