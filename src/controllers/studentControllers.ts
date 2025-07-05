import StudentService from "../services/StudentService";
import { Request, Response } from "express";
import HttpResponse from "../utils/HttpResponse";
import { AuthenticatedRequest } from "../types/authStudent";
import EmailService from "../services/emailService";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStudents = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const students = await StudentService.getAllStudents();

	if (students.length === 0)
		throw new Error("Null database, create more students");

	HttpResponse.success(res, 200, "Students retrieved successfully", {
		count: students.length,
		info: students,
	});
};

export const getStudent = async (req: Request, res: Response): Promise<any> => {
	const student = await StudentService.getSingleStudent(req.params.id);

	if (!student) {
		return HttpResponse.error(res, 404, "Student not found");
	}

	HttpResponse.success(res, 200, "Student retrieved successfully \n", student);
};
// <!-- to be added after adding roles since this can be done by admin -->
// export const addStudent = async (req: Request, res: Response): Promise<any> => {
// 	const student = await StudentService.createStudent(req.body);

// 	HttpResponse.success(res, 201, "Student created successfully", student);
// };

export const editStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	try {
		const { firstname, lastname, tel, email, password } = req.body;
		const values = {
			firstname,
			lastname,
			tel,
			email,
			password,
		};
		const student = await StudentService.updateStudent(req.params.id, values);

		return HttpResponse.success(
			res,
			200,
			"Student updated successfully",
			student,
		);
	} catch (error) {
		return HttpResponse.error(res, 400, "failed to update studate details");
		throw error;
	}
};

export const removeStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const result = await StudentService.deleteStudent(req.params.id);

	HttpResponse.success(res, 200, "Student deleted successfully", result);
};

export const queryStudents = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { search, limit } = req.query;

	if (!search) {
		return HttpResponse.error(res, 400, "Search term is required");
	}
	const students = await StudentService.searchStudents(
		search as string,
		parseInt(limit as string),
	);

	HttpResponse.success(res, 200, "Students found", {
		count: students.length,
		students,
	});
};

export const getStudentCount = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const count = await StudentService.getStudentCount();

	HttpResponse.success(res, 200, "Student count retrieved", { count });
	return;
};

export const signupStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { firstname, lastname, tel, email, password } = req.body;

	if (!firstname || !lastname || !tel || !email || !password) {
		return HttpResponse.error(res, 400, "All required fields must be provided");
	}

	const student = await StudentService.createStudent({
		firstname,
		lastname,
		tel,
		email,
		password,
	});

	try {
		await EmailService.sendWelcomeEmail(email);
		console.log("an email has been sent");
	} catch (error) {
		console.error("Failed to send welcome email:");
		throw error;
	}

	await StudentService.generateResetToken(email);

	HttpResponse.success(res, 201, "Account created successfully", {
		student,
		message: "Please login with your credentials",
	});
};

export const loginStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { tel, password } = req.body;

	if (!tel || !password) {
		return HttpResponse.error(
			res,
			400,
			"Phone number and password are required",
		);
	}

	const result = await StudentService.loginStudent(tel, password);

	res.cookie("JWT", result.token, {
		httpOnly: true,
		maxAge: 1 * 60 * 1000,
	});

	HttpResponse.success(res, 200, "Login successful", {
		token: result.token,
		user: result,
	});
};

export const logoutStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	res.cookie("JWT", " ", { maxAge: 1 });
	//res.clearCookie("JWT");
	HttpResponse.success(res, 200, "Logged out successfully");
};

export const forgotPassword = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { email } = req.body;

	if (!email) {
		return HttpResponse.error(res, 400, "Email address is required");
	}

	await StudentService.generateResetToken(email);

	HttpResponse.success(res, 200, "Password reset email sent", {
		message: "I have sent a password reset link",
	});
};

export const getCurrentStudent = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<any> => {
	const student = await StudentService.getCurrentStudent(req.user!.tel);

	if (!student) {
		return HttpResponse.error(res, 404, "Student profile not found");
	}

	HttpResponse.success(res, 200, "Profile retrieved successfully", student);
};

export const changePassword = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<any> => {
	if (!req.user) {
		return HttpResponse.error(res, 401, "Authentication required");
	}

	const { newPassword } = req.body;
	const { token } = req.params;

	const isTokenValid = await StudentService.verifyToken(token);
	if (!isTokenValid) throw new Error("token invalid or expired");
	res.status(200).json({ message: "Token is valid" });

	if (!newPassword) {
		return HttpResponse.error(res, 400, "New password required");
	}

	const student = await prisma.students.findFirst({
		where: {
			resetToken: token,
			resetTokenExpiry: { gte: new Date() },
		},
	});

	const isCurrentPasswordValid = await bcrypt.compare(
		newPassword,
		student!.password,
	);
	if (!isCurrentPasswordValid) {
		return HttpResponse.error(res, 400, "Current password is incorrect");
	}

	const newPasswordHash = bcrypt.hash(newPassword, 10);
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

	HttpResponse.success(res, 200, "Password changed successfully");
};
