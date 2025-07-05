import { NextFunction, Request, Response } from "express";
import HttpResponse from "../utils/HttpResponse";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types/authStudent";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { Resend } from "resend";
import emailService from "../services/emailService";

const resend = new Resend(process.env.STUDENT_MGR_API);

dotenv.config();

const prisma = new PrismaClient();

export const sendInvitation = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const {
		firstname,
		lastname,
		tel,
		email,
		password,
		resetToken = null,
		resetTokenExpiry = null,
	} = req.body;

	try {
		if (!email) return res.status(400).json({ message: "Email required" });

		const token = jwt.sign(
			{
				firstname,
				lastname,
				tel,
				email,
				password,
				resetToken,
				resetTokenExpiry,
			},
			process.env.ACCESS_TOKEN!,
			{
				expiresIn: "1h",
			},
		);

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

		HttpResponse.success(res, 200, "Invitation sent successfully", {
			message: `Invitation has been sent to ${email}`,
		});
	} catch (err) {
		if (err instanceof JsonWebTokenError) {
			HttpResponse.error(res, 400, "Invalid Token");
		} else if (err instanceof TokenExpiredError) {
			HttpResponse.error(res, 400, "Token expired");
		} else {
			next(err);
		}
	}
};

export const acceptInvite = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const token = req.params.token;

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN!);

		const invite = await prisma.invitation.findFirst({
			where: { token },
		});

		if (invite!.expiresAt < new Date()) {
			return res
				.status(401)
				.json({ message: "Invalid or expired invitation link" });
		}

		const {
			firstname,
			lastname,
			tel,
			email,
			password,
			resetToken,
			resetTokenExpiry,
		} = decoded as any;
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
	} catch (error) {
		res.status(401).json({ message: "Invalid token", error });
	}
};

const sendpasswordotpemail = async (req: Request, res: Response) => {
	const { email } = req.body;
	const otp = await emailService.sendPasswordResetOTPEmail(email);
	HttpResponse.success(res, 200, "otp sent", otp);
};
