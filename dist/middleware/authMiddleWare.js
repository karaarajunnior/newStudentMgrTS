"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        token = req.cookies?.token;
    }
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const user = await prisma.students.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                tel: true,
                firstname: true,
                lastname: true,
                email: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid token. User not found.",
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
