"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudent = void 0;
const joi_1 = __importDefault(require("joi"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.validateStudent = (0, express_async_handler_1.default)((req, res, next) => {
    const schema = joi_1.default.object({
        id: joi_1.default.number().required(),
        firstname: joi_1.default.string().min(2).max(50).required(),
        lastname: joi_1.default.string().min(2).max(50).required(),
        tel: joi_1.default.string().min(10).max(15).required(),
        password: joi_1.default.string().min(6).required(),
    });
});
