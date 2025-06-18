"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = require("../controllers/studentControllers");
const authValidator_1 = require("../validators/authValidator");
const router = express_1.default.Router();
router.post("/login", authValidator_1.validateLogin, studentControllers_1.loginStudent);
router.post("/logout", studentControllers_1.logoutStudent);
exports.default = router;
