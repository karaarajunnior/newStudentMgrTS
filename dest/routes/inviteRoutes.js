"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../controllers/emailController");
const router = express_1.default.Router();
router.post("/invite", emailController_1.sendInvitation);
router.get("/acceptinvite/:token", emailController_1.acceptInvite);
exports.default = router;
