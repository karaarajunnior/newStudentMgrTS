"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const router = express_1.default.Router();
router.post("/signup", studentControllers_1.signupStudent);
router.post("/logout", studentControllers_1.logoutStudent);
router.get("/forgotPassword", studentControllers_1.forgotPassword);
router.post("/resetPassword/:token", studentControllers_1.resetPassword);
router.get("/login", studentControllers_1.loginStudent);
exports.default = router;
