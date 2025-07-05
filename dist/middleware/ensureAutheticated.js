"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAutheticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const ensureAutheticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let accessToken = authHeader?.split(" ")[1];
    if (!accessToken) {
        res.status(401).json({ message: "token doesnot exist in header" });
        accessToken = req.cookies?.accessToken;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN);
        req.user = { id: decoded.id };
        next();
    }
    catch (error) {
        throw error;
    }
};
exports.ensureAutheticated = ensureAutheticated;
