"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvite = exports.sendInvitation = void 0;
const HttpResponse_1 = __importDefault(require("../utils/HttpResponse"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const resend_1 = require("resend");
const emailService_1 = __importDefault(require("../services/emailService"));
const resend = new resend_1.Resend(process.env.STUDENT_MGR_API);
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const sendInvitation = async (req, res, next) => {
    const { firstname, lastname, tel, email, password, resetToken = null, resetTokenExpiry = null, } = req.body;
    try {
        if (!email)
            return res.status(400).json({ message: "Email required" });
        const token = jsonwebtoken_1.default.sign({
            firstname,
            lastname,
            tel,
            email,
            password,
            resetToken,
            resetTokenExpiry,
        }, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
        });
        const fetchToken = await prisma.invitation.create({
            data: {
                email,
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        const link = `${process.env.AcceptInvitationUrl}/${fetchToken.token}`;
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
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            HttpResponse_1.default.error(res, 400, "Invalid Token");
        }
        else if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            HttpResponse_1.default.error(res, 400, "Token expired");
        }
        else {
            next(err);
        }
    }
};
exports.sendInvitation = sendInvitation;
const acceptInvite = async (req, res, next) => {
    const token = req.params.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const invite = await prisma.invitation.findFirst({
            where: { token },
        });
        if (invite.expiresAt < new Date()) {
            return res
                .status(401)
                .json({ message: "Invalid or expired invitation link" });
        }
        const { firstname, lastname, tel, email, password, resetToken, resetTokenExpiry, } = decoded;
        const CheckStudentExistance = await prisma.students.findUnique({
            where: { email },
        });
        if (!CheckStudentExistance) {
            await prisma.students.create({
                data: {
                    firstname,
                    lastname,
                    tel,
                    email,
                    password,
                    resetToken,
                    resetTokenExpiry,
                },
                select: {
                    firstname,
                    email,
                    tel,
                },
            });
        }
        res.status(200).json({ message: "Valid invite", firstname });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token", error });
    }
};
exports.acceptInvite = acceptInvite;
const sendpasswordotpemail = async (req, res) => {
    const { email } = req.body;
    const otp = await emailService_1.default.sendPasswordResetOTPEmail(email);
    HttpResponse_1.default.success(res, 200, "otp sent", otp);
};
