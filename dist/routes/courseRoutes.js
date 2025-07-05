"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = __importDefault(require("../controllers/courseController"));
//import { authoriseStudent } from "../middleware/authorise";
const router = (0, express_1.Router)();
router.get("/", courseController_1.default.getAllCourses);
router.get("/enroll", courseController_1.default.enrollStudent);
router.get("/:id", courseController_1.default.getCourseById);
router.get("/enrollment", courseController_1.default.getEnrollmentsByStudent);
router.get("/query", courseController_1.default.searchCourses);
exports.default = router;
