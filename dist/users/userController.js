"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
exports.verifyOTP = verifyOTP;
const client_1 = require("@prisma/client");
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const resend = new resend_1.Resend(process.env.STUDENT_MGR_API);
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        throw new Error("missing fields");
    const UserExists = await prisma.user.findFirst({ where: { email } });
    if (UserExists)
        throw new Error("user already registered");
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpexpiry = new Date(Date.now() + 10 * 60 * 1000);
    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password,
            otp,
            otpexpiry,
        },
    });
    sendPasswordResetOTPEmail(email, otp, name);
    res.json("user created");
};
exports.register = register;
async function sendPasswordResetOTPEmail(email, otp, name) {
    if (!email)
        throw new Error("provide your email");
    const account = await prisma.user.findFirst({ where: { email } });
    if (!account)
        throw new Error("Account not found, provide a valid Email");
    const subject = "Here is your One Time Password(OTP)";
    const html = `<p>Hello ${name}</p>
    <p>Please have your OTP: (${otp}) </p>
    <p>ignore this email if its not you</p>`;
    const from = `${process.env.MAIL_FROM} <hello@resend.dev>`;
    return await sendEmail({ from, to: email, subject, html });
}
async function sendEmail(options) {
    try {
        const { data, error } = await resend.emails.send(options);
        if (error) {
            console.error("Resend email sending error:", error);
            return error;
        }
        console.log("Email sent successfully:", data);
        return data;
    }
    catch (err) {
        console.error("Unexpected error during email sending:", err);
        return { data: null, error: err };
    }
}
async function verifyOTP(req, res) {
    const { email, otp } = req.body;
    try {
        const checkUser = await prisma.user.findFirst({ where: { email } });
        if (!checkUser) {
            res.json({ message: "User no longer exist" });
        }
        if (checkUser?.otp !== otp && checkUser?.otpexpiry < new Date()) {
            res.json({ message: "OTP invalid or expired" });
        }
        const updateUser = await prisma.user.update({
            where: { email },
            data: {
                otp: undefined,
                otpexpiry: undefined,
                Isverified: true,
            },
        });
        res.json({ message: "Email verified successfully, log in" });
    }
    catch (error) {
        throw error;
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            console.log("missing fields");
        }
        const user = await prisma.user.findFirst({ where: { email } });
        if (user?.password !== password)
            throw new Error("password incorrect");
        if (user)
            console.log("userExists");
        if (!user?.Isverified)
            throw new Error("user is not verified, plz do so");
        return res.status(200).json("log in successful");
    }
    catch (error) {
        throw error;
    }
};
exports.login = login;
