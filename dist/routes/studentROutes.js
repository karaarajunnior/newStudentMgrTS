"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const authorise_1 = require("../middleware/authorise");
const router = express_1.default.Router();
router.post("/signup", studentControllers_1.signupStudent);
router.post("/login", studentControllers_1.loginStudent);
router.use((0, authorise_1.authoriseStudent)("ADMIN"));
router.post("/changepassword/:token", studentControllers_1.changePassword);
router.post("/forgotPassword", studentControllers_1.forgotPassword);
// router.use(authoriseStudent("ADMIN"));
// router.post("/add", CourseController.createCourse);
exports.default = router;
