"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const studentValidator_1 = require("../validators/studentValidator");
const router = express_1.default.Router();
router.get("/", studentControllers_1.getStudents);
router.get("/query", studentControllers_1.queryStudents);
router.get("/count", studentControllers_1.getStudentCount);
router.get("/student/:id", studentControllers_1.getStudent);
router.post("/add", studentValidator_1.validateStudent, studentControllers_1.addStudent);
router.put("/edit/:id", studentValidator_1.validateStudent, studentControllers_1.editStudent);
router.delete("/:id", studentControllers_1.removeStudent);
exports.default = router;
