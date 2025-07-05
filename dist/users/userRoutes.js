"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const router = (0, express_1.Router)();
exports.default = router.post("/register", userController_1.register);
router.post("/verifyotp", userController_1.verifyOTP);
router.post("/login", userController_1.login);
