"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authoriseLecturer = exports.authoriseStudent = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const authoriseStudent = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await prisma.students.findFirst({
                where: { tel: req.user?.tel },
            });
            if (!user) {
                console.log("user not found");
                return HttpResponse_1.default.error(res, 403, "User not found");
            }
            if (user.role === "ADMIN") {
                console.log("authorised");
                return HttpResponse_1.default.success(res, 200, "Authorised", {});
            }
            next();
        }
        catch (error) {
            throw error;
        }
    };
};
exports.authoriseStudent = authoriseStudent;
const authoriseLecturer = (roles = []) => {
    return async (req, res, next) => {
        if (!req.lecturer?.lecturer_id) {
            HttpResponse_1.default.error(res, 401, "Unauthenticated: ID not found in request");
        }
        const user = await prisma.lecturer.findUnique({
            where: { id: req.lecturer?.lecturer_id },
        });
        if (!user || !roles.includes(user.role)) {
            HttpResponse_1.default.error(res, 403, "User not allowed to access these routes");
        }
        next();
    };
};
exports.authoriseLecturer = authoriseLecturer;
