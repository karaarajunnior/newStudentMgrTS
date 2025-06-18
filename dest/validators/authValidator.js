"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const joi_1 = __importDefault(require("joi"));
const enum_1 = require("../enum/enum");
const validateLogin = (req, res, next) => {
    const schema = joi_1.default.object({
        tel: joi_1.default.string().min(10).max(15).required(),
        password: joi_1.default.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(enum_1.Code.BAD_REQUEST).json({
            success: false,
            error: error.details[0].message,
        });
    }
    next();
};
exports.validateLogin = validateLogin;
