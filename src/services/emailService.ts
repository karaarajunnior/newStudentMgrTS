import { CreateEmailOptions, CreateEmailRequestOptions, Resend } from "resend";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.STUDENT_MGR_API);

async function sendEmail(options: CreateEmailOptions) {
	try {
		const { data, error } = await resend.emails.send(options);

		if (error) {
			console.error("Resend email sending error:", error);
			return error;
		}

		console.log("Email sent successfully:", data);
		return data;
	} catch (err) {
		console.error("Unexpected error during email sending:", err);
		return { data: null, error: err };
	}
}

async function sendWelcomeEmail(to: string | string[]) {
	const subject = `Welcome to ${process.env.APP_NAME}`;
	const from = process.env.MAIL_FROM!;
	const text = " ";

	return sendEmail({ from, to, subject, text });
}

async function sendInvitationEmail(to: string | string[], inviterName: string) {
	const subject = `You're invited to join ${process.env.APP_NAME}`;
	const signupLink = `${process.env.FRONTEND_URL}/signup`;
	const html = `<p>Hello</p>
    <p>Please click <a href="${signupLink}">${signupLink}</a> to accept the invitation:</p>`;
	const from = process.env.MAIL_FROM!;

	await sendWelcomeEmail(to);
	return sendEmail({ from, to, subject, html });
}

async function sendPasswordResetEmail(
	to: string | string[],
	lastame: string = "",
) {
	const resetToken = crypto.randomBytes(64).toString("hex");
	const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

	await prisma.students.updateMany({
		where: { email: Array.isArray(to) ? to[0] : to },
		data: {
			resetToken,
			resetTokenExpiry,
		},
	});

	const subject = `Password Reset Request for ${process.env.APP_NAME}`;
	const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
	const html = `<p>Hello ${lastame || ""},</p>
    <p>Please click <a href="${resetLink}">${resetLink}</a> to reset your password:</p>
    <p>ignore this email if its not you</p>`;
	const from = process.env.MAIL_FROM!;

	await sendWelcomeEmail(to);
	return sendEmail({ from, to, subject, html });
}

export default {
	sendEmail,
	sendInvitationEmail,
	sendPasswordResetEmail,
	sendWelcomeEmail,
};
