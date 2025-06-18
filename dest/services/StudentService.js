"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = __importDefault(require("./emailService"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const validateStudentExists = async (id) => {
    const student = await prisma.students.findUnique({ where: { id } });
    return student !== null;
};
const getAllStudents = async () => {
    return await prisma.students.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
            created_at: true,
            updated_at: true,
        },
    });
};
const getSingleStudent = async (id, tel, email) => {
    return await prisma.students.findFirst({
        where: {
            OR: [
                {
                    tel,
                },
                {
                    id,
                },
                {
                    email,
                },
            ].filter(Boolean),
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
            password: true,
            resetToken: true,
            resetTokenExpiry: true,
            created_at: true,
            updated_at: true,
        },
    });
};
const getStudentCount = async () => {
    return await prisma.students.count();
};
const createStudent = async (studentData) => {
    const { firstname, lastname, tel, email, password } = studentData;
    if (!firstname || !lastname || !tel || !email || !password) {
        throw new Error("All required fields must be provided");
    }
    const existingStudent = await prisma.students.findFirst({
        where: {
            OR: [{ tel }, { email }].filter(Boolean),
        },
    });
    if (existingStudent)
        throw new Error("Student already exists");
    try {
        await emailService_1.default.sendWelcomeEmail(email);
        console.log("an email has been sent");
    }
    catch (error) {
        console.error("Failed to send welcome email:", error);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return await prisma.students.create({
        data: {
            firstname,
            lastname,
            tel,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
        },
    });
};
const updateStudent = async (id, studentData) => {
    const updateData = {
        updated_at: new Date(),
    };
    if (studentData.firstname)
        updateData.firstname = studentData.firstname;
    if (studentData.lastname)
        updateData.lastname = studentData.lastname;
    if (studentData.tel)
        updateData.tel = studentData.tel;
    if (studentData.email)
        updateData.email = studentData.email;
    if (studentData.password) {
        updateData.password = await bcrypt_1.default.hash(studentData.password, 10);
    }
    return await prisma.students.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
        },
    });
};
const deleteStudent = async (id) => {
    const enrollments = await prisma.student_courses.findMany({
        where: { student_id: id },
    });
    if (enrollments.length > 0) {
        throw new Error("Cannot delete student with existing course enrollments");
    }
    await prisma.students.delete({ where: { id } });
    return { message: "Student deleted successfully" };
};
const searchStudents = async (searchTerm, limit = 10) => {
    return await prisma.students.findMany({
        where: {
            OR: [
                { firstname: { contains: searchTerm.toLowerCase() } },
                { lastname: { contains: searchTerm.toLowerCase() } },
                { tel: { equals: searchTerm } },
                { email: { equals: searchTerm.toLowerCase() } },
            ],
        },
        take: limit,
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
        },
    });
};
const loginStudent = async (tel, password) => {
    const student = await prisma.students.findUnique({ where: { tel } });
    const isPasswordValid = await bcrypt_1.default.compare(password, student.password);
    if (!isPasswordValid || !student)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({
        id: student.id,
        tel: student.tel,
        firstname: student.firstname,
        lastname: student.lastname,
        email: student.email,
    }, process.env.ACCESS_TOKEN, {
        expiresIn: "24h",
    });
    return { token };
};
const getCurrentStudent = async (studentId) => {
    const student = await prisma.students.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            email: true,
            created_at: true,
            updated_at: true,
        },
    });
    if (!student) {
        throw new Error("Student not found");
    }
    return student;
};
const generateResetToken = async (email) => {
    const student = await prisma.students.findUnique({
        where: { email },
    });
    if (!student)
        return "No account";
    const resetToken = crypto_1.default.randomBytes(64).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    const getToken = await prisma.students.update({
        where: { email },
        data: {
            resetToken,
            resetTokenExpiry,
        },
    });
    await emailService_1.default.sendPasswordResetEmail(email, student.lastname || "");
    return getToken.resetToken;
};
const resetPassword = async (token, newPassword) => {
    const student = await prisma.students.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date(),
            },
        },
    });
    if (!student) {
        throw new Error("Password reset token is invalid or has expired");
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma.students.update({
        where: { id: student.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
    return "Password reset successfully";
};
exports.default = {
    validateStudentExists,
    getAllStudents,
    getSingleStudent,
    getStudentCount,
    loginStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    getCurrentStudent,
    generateResetToken,
    resetPassword,
};
