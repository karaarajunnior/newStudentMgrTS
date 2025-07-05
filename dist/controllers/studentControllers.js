"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getCurrentStudent = exports.forgotPassword = exports.logoutStudent = exports.loginStudent = exports.signupStudent = exports.getStudentCount = exports.queryStudents = exports.removeStudent = exports.editStudent = exports.getStudent = exports.getStudents = void 0;
const StudentService_1 = __importDefault(require("../services/StudentService"));
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const emailService_1 = __importDefault(require("../services/emailService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getStudents = async (req, res) => {
    const students = await StudentService_1.default.getAllStudents();
    if (students.length === 0)
        throw new Error("Null database, create more students");
    HttpResponse_1.default.success(res, 200, "Students retrieved successfully", {
        count: students.length,
        info: students,
    });
};
exports.getStudents = getStudents;
const getStudent = async (req, res) => {
    const student = await StudentService_1.default.getSingleStudent(req.params.id);
    if (!student) {
        return HttpResponse_1.default.error(res, 404, "Student not found");
    }
    HttpResponse_1.default.success(res, 200, "Student retrieved successfully \n", student);
};
exports.getStudent = getStudent;
// <!-- to be added after adding roles since this can be done by admin -->
// export const addStudent = async (req: Request, res: Response): Promise<any> => {
// 	const student = await StudentService.createStudent(req.body);
// 	HttpResponse.success(res, 201, "Student created successfully", student);
// };
const editStudent = async (req, res) => {
    try {
        const { firstname, lastname, tel, email, password } = req.body;
        const values = {
            firstname,
            lastname,
            tel,
            email,
            password,
        };
        const student = await StudentService_1.default.updateStudent(req.params.id, values);
        return HttpResponse_1.default.success(res, 200, "Student updated successfully", student);
    }
    catch (error) {
        return HttpResponse_1.default.error(res, 400, "failed to update studate details");
        throw error;
    }
};
exports.editStudent = editStudent;
const removeStudent = async (req, res) => {
    const result = await StudentService_1.default.deleteStudent(req.params.id);
    HttpResponse_1.default.success(res, 200, "Student deleted successfully", result);
};
exports.removeStudent = removeStudent;
const queryStudents = async (req, res) => {
    const { search, limit } = req.query;
    if (!search) {
        return HttpResponse_1.default.error(res, 400, "Search term is required");
    }
    const students = await StudentService_1.default.searchStudents(search, parseInt(limit));
    HttpResponse_1.default.success(res, 200, "Students found", {
        count: students.length,
        students,
    });
};
exports.queryStudents = queryStudents;
const getStudentCount = async (req, res) => {
    const count = await StudentService_1.default.getStudentCount();
    HttpResponse_1.default.success(res, 200, "Student count retrieved", { count });
    return;
};
exports.getStudentCount = getStudentCount;
const signupStudent = async (req, res) => {
    const { firstname, lastname, tel, email, password } = req.body;
    if (!firstname || !lastname || !tel || !email || !password) {
        return HttpResponse_1.default.error(res, 400, "All required fields must be provided");
    }
    const student = await StudentService_1.default.createStudent({
        firstname,
        lastname,
        tel,
        email,
        password,
    });
    try {
        await emailService_1.default.sendWelcomeEmail(email);
        console.log("an email has been sent");
    }
    catch (error) {
        console.error("Failed to send welcome email:");
        throw error;
    }
    await StudentService_1.default.generateResetToken(email);
    HttpResponse_1.default.success(res, 201, "Account created successfully", {
        student,
        message: "Please login with your credentials",
    });
};
exports.signupStudent = signupStudent;
const loginStudent = async (req, res) => {
    const { tel, password } = req.body;
    if (!tel || !password) {
        return HttpResponse_1.default.error(res, 400, "Phone number and password are required");
    }
    const result = await StudentService_1.default.loginStudent(tel, password);
    res.cookie("JWT", result.token, {
        httpOnly: true,
        maxAge: 1 * 60 * 1000,
    });
    HttpResponse_1.default.success(res, 200, "Login successful", {
        token: result.token,
        user: result,
    });
};
exports.loginStudent = loginStudent;
const logoutStudent = async (req, res) => {
    res.cookie("JWT", " ", { maxAge: 1 });
    //res.clearCookie("JWT");
    HttpResponse_1.default.success(res, 200, "Logged out successfully");
};
exports.logoutStudent = logoutStudent;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return HttpResponse_1.default.error(res, 400, "Email address is required");
    }
    await StudentService_1.default.generateResetToken(email);
    HttpResponse_1.default.success(res, 200, "Password reset email sent", {
        message: "I have sent a password reset link",
    });
};
exports.forgotPassword = forgotPassword;
const getCurrentStudent = async (req, res) => {
    const student = await StudentService_1.default.getCurrentStudent(req.user.tel);
    if (!student) {
        return HttpResponse_1.default.error(res, 404, "Student profile not found");
    }
    HttpResponse_1.default.success(res, 200, "Profile retrieved successfully", student);
};
exports.getCurrentStudent = getCurrentStudent;
const changePassword = async (req, res) => {
    if (!req.user) {
        return HttpResponse_1.default.error(res, 401, "Authentication required");
    }
    const { newPassword } = req.body;
    const { token } = req.params;
    const isTokenValid = await StudentService_1.default.verifyToken(token);
    if (!isTokenValid)
        throw new Error("token invalid or expired");
    res.status(200).json({ message: "Token is valid" });
    if (!newPassword) {
        return HttpResponse_1.default.error(res, 400, "New password required");
    }
    const student = await prisma.students.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gte: new Date() },
        },
    });
    const isCurrentPasswordValid = await bcrypt_1.default.compare(newPassword, student.password);
    if (!isCurrentPasswordValid) {
        return HttpResponse_1.default.error(res, 400, "Current password is incorrect");
    }
    const newPasswordHash = bcrypt_1.default.hash(newPassword, 10);
    await prisma.students.update({
        where: {
            id: req.user?.tel,
        },
        data: {
            ...req.body,
            password: newPasswordHash,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
    HttpResponse_1.default.success(res, 200, "Password changed successfully");
};
exports.changePassword = changePassword;
