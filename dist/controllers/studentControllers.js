"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getCurrentStudent = exports.resetPassword = exports.forgotPassword = exports.logoutStudent = exports.loginStudent = exports.signupStudent = exports.getStudentCount = exports.queryStudents = exports.removeStudent = exports.editStudent = exports.addStudent = exports.getStudent = exports.getStudents = void 0;
const StudentService_1 = __importDefault(require("../services/StudentService"));
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const emailService_1 = __importDefault(require("../services/emailService"));
const getStudents = async (req, res) => {
    const students = await StudentService_1.default.getAllStudents();
    HttpResponse_1.default.success(res, 200, "Students retrieved successfully", {
        count: students.length,
        students,
    });
};
exports.getStudents = getStudents;
const getStudent = async (req, res) => {
    const student = await StudentService_1.default.getSingleStudent(req.params.id);
    if (!student) {
        return HttpResponse_1.default.error(res, 404, "Student not found");
    }
    HttpResponse_1.default.success(res, 200, "Student retrieved successfully", student);
};
exports.getStudent = getStudent;
const addStudent = async (req, res) => {
    const student = await StudentService_1.default.createStudent(req.body);
    HttpResponse_1.default.success(res, 201, "Student created successfully", student);
};
exports.addStudent = addStudent;
const editStudent = async (req, res) => {
    const student = await StudentService_1.default.updateStudent(req.params.id, req.body);
    HttpResponse_1.default.success(res, 200, "Student updated successfully", student);
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
    const students = await StudentService_1.default.searchStudents(search, parseInt(limit) || 10);
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
        console.error("Failed to send welcome email:", error);
    }
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
    res.cookie("token", result.token, {
        httpOnly: true,
        //sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    HttpResponse_1.default.success(res, 200, "Login successful", {
        token: result.token,
        user: result,
    });
};
exports.loginStudent = loginStudent;
const logoutStudent = async (req, res) => {
    res.clearCookie("token");
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
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
        return HttpResponse_1.default.error(res, 400, "New password is required");
    }
    const result = await StudentService_1.default.resetPassword(token, password);
    HttpResponse_1.default.success(res, 200, "Password reset successful", result);
};
exports.resetPassword = resetPassword;
const getCurrentStudent = async (req, res) => {
    const student = await StudentService_1.default.getCurrentStudent(req.user.id);
    if (!student) {
        return HttpResponse_1.default.error(res, 404, "Student profile not found");
    }
    HttpResponse_1.default.success(res, 200, "Profile retrieved successfully", student);
};
exports.getCurrentStudent = getCurrentStudent;
//>>>>>>>>>>>>>
const changePassword = async (req, res) => {
    if (!req.user) {
        return HttpResponse_1.default.error(res, 401, "Authentication required");
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return HttpResponse_1.default.error(res, 400, "Current password and new password are required");
    }
    if (newPassword.length < 6) {
        return HttpResponse_1.default.error(res, 400, "New password must be at least 6 characters long");
    }
    const student = await StudentService_1.default.getSingleStudent(req.user.id);
    if (!student) {
        return HttpResponse_1.default.error(res, 404, "Student not found");
    }
    const bcrypt = require("bcrypt");
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, student.password);
    if (!isCurrentPasswordValid) {
        return HttpResponse_1.default.error(res, 400, "Current password is incorrect");
    }
    await StudentService_1.default.updateStudent(req.user.id, {
        ...req.body,
        password: newPassword,
    });
    HttpResponse_1.default.success(res, 200, "Password changed successfully");
};
exports.changePassword = changePassword;
