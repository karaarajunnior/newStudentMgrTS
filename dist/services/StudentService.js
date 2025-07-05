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
        },
        skip: 0,
        take: 10,
        orderBy: {
            firstname: "desc",
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
    const hashedPassword = await bcrypt_1.default.hash(password, 2);
    await prisma.students.create({
        data: {
            firstname,
            lastname,
            tel,
            email,
            password: hashedPassword,
        },
    });
    try {
        await emailService_1.default.sendWelcomeEmail(email);
        console.log("an email has been sent");
    }
    catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};
const updateStudent = async (id, studentData) => {
    const updateData = {
        updated_at: new Date(),
    };
    console.log("setting new details");
    if (studentData.firstname)
        updateData.firstname = studentData.firstname;
    if (studentData.lastname)
        updateData.lastname = studentData.lastname;
    if (studentData.tel)
        updateData.tel = studentData.tel;
    if (studentData.email)
        updateData.email = studentData.email;
    if (studentData.password) {
        console.log("password hashing");
        updateData.password = await bcrypt_1.default.hash(studentData.password, 2);
        console.log("password hashed success");
    }
    await prisma.students.update({
        where: { id },
        data: updateData,
    });
};
const deleteStudent = async (id) => {
    const enrollments = await prisma.student_courses.findMany({
        where: { student_id: id },
    });
    if (enrollments.length > 0) {
        throw new Error("Cannot delete student with existing course enrollments");
    }
    else {
        await prisma.students.delete({ where: { id } });
    }
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
    if (!student)
        throw new Error("tel  is wrong");
    const isPasswordvalid = await bcrypt_1.default.compare(password, student.password);
    if (!isPasswordvalid)
        throw new Error("password is invalid");
    const token = jsonwebtoken_1.default.sign({
        id: student.id,
        tel: student.tel,
        firstname: student.firstname.concat(student.lastname),
    }, process.env.ACCESS_TOKEN, {
        expiresIn: "1m",
    });
    return {
        token,
        user: {
            firstname: student.firstname.concat(student.lastname),
        },
    };
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
    if (!email)
        return "email amust";
    const student = await prisma.students.findUnique({
        where: { email },
    });
    if (!student)
        return "No account with that email";
    const resetToken = crypto_1.default.randomBytes(64).toString("hex");
    const getToken = await prisma.students.update({
        where: { email },
        data: {
            resetToken: crypto_1.default.createHash("sha256").update(resetToken).digest("hex"),
            resetTokenExpiry: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
        select: {
            resetToken: true,
            resetTokenExpiry: true,
        },
    });
    console.log(resetToken, " ", " ", getToken.resetToken);
    return getToken.resetToken, getToken.resetToken;
};
const verifyToken = async (resetToken) => {
    const findToken = await prisma.students.findFirst({
        where: {
            resetToken,
            resetTokenExpiry: { gte: new Date() },
        },
    });
    return findToken?.resetToken;
};
exports.default = {
    validateStudentExists,
    getAllStudents,
    verifyToken,
    getSingleStudent,
    getStudentCount,
    loginStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    getCurrentStudent,
    generateResetToken,
};
