"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnrollment = exports.validateCourse = void 0;
const joi_1 = __importDefault(require("joi"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.validateCourse = (0, express_async_handler_1.default)((req, res, next) => {
    const schema = joi_1.default.object({
        id: joi_1.default.number().required(),
        course_unit: joi_1.default.string().min(2).max(50).required(),
        code: joi_1.default.string().min(2).max(20).required(),
    });
});
exports.validateEnrollment = (0, express_async_handler_1.default)((req, res, next) => {
    const schema = joi_1.default.object({
        studentId: joi_1.default.number().required(),
        courseId: joi_1.default.number().required(),
        status: joi_1.default.string().valid("active", "completed", "dropped").optional(),
    });
});
