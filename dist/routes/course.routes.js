"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const courseValidator_1 = require("../validators/courseValidator");
const router = express_1.default.Router();
// Protected routes
router.use(authMiddleWare_1.authenticate);
router.get("/student/:studentId", courseController_1.getStudentCourses);
// router.get("/:id", getStudentcourse);
router.post("/", courseValidator_1.validateCourse, courseController_1.addCourse);
router.post("/enroll", courseValidator_1.validateEnrollment, courseController_1.enrollInCourse);
router.put("/enroll/:studentId/:courseId", courseValidator_1.validateEnrollment, courseController_1.updateEnrollment);
exports.default = router;
