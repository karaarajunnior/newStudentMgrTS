"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lecturerController_1 = require("../controllers/lecturerController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/add", lecturerController_1.addlecturer);
exports.default = router;
