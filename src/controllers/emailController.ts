import { NextFunction, Request, Response } from "express";
import HttpResponse from "../utils/HttpResponse";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types/authReq";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
const resend = new Resend(process.env.STUDENT_MGR_API);

const prisma = new PrismaClient();

export const sendInvitation = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const { email } = req.body;

	try {
		if (!email) return res.status(400).json({ message: "Email required" });

		const token = jwt.sign({ email }, process.env.ACCESS_TOKEN!, {
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

		HttpResponse.success(res, 200, "Invitation sent successfully", {
			message: `Invitation has been sent to ${email}`,
		});
	} catch (err) {
		next(err);
	}
};

export const acceptInvite = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const token = req.params.token;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			email: string;
		};

		const invite = await prisma.invitation.findUnique({
			where: { token },
		});

		if (!invite || invite.expiresAt < new Date()) {
			return res
				.status(401)
				.json({ message: "Invalid or expired invitation link" });
		}

		res.status(200).json({ message: "Valid invite", email: decoded.email });
	} catch (error) {
		res.status(401).json({ message: "Invalid token", error });
	}
};
