import { Router } from "express";
import CourseController from "../controllers/courseController";

const router = Router();

router.get("/", CourseController.getAllCourses);
router.post("/add", CourseController.createCourse);
router.get("/enroll", CourseController.enrollStudent);
router.get("/:id", CourseController.getCourseById);
router.get("/enrollment", CourseController.getEnrollmentsByStudent);
router.get("/query", CourseController.searchCourses);

export default router;
