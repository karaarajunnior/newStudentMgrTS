"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvite = exports.sendInvitation = void 0;
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.STUDENT_MGR_API);
const prisma = new client_1.PrismaClient();
const sendInvitation = async (req, res, next) => {
    const { email } = req.body;
    try {
        if (!email)
            return res.status(400).json({ message: "Email required" });
        const token = jsonwebtoken_1.default.sign({ email }, process.env.ACCESS_TOKEN, {
            expiresIn: "24h",
        });
        const fetchToken = await prisma.invitation.create({
            data: {
                email,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        const link = `http://localhost:5000/api/email/acceptinvite/${fetchToken.token}`;
        await resend.emails.send({
            from: `${process.env.APP_NAME} <hello@resend.dev>`,
            to: email,
            subject: "You're Invited!",
            html: `<p>Click <a href="${link}">here</a> to join the system without signing up.</p>`,
        });
        HttpResponse_1.default.success(res, 200, "Invitation sent successfully", {
            message: `Invitation has been sent to ${email}`,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.sendInvitation = sendInvitation;
const acceptInvite = async (req, res, next) => {
    const token = req.params.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const invite = await prisma.invitation.findUnique({
            where: { token },
        });
        if (!invite || invite.expiresAt < new Date()) {
            return res
                .status(401)
                .json({ message: "Invalid or expired invitation link" });
        }
        res.status(200).json({ message: "Valid invite", email: decoded.email });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token", error });
    }
};
exports.acceptInvite = acceptInvite;
