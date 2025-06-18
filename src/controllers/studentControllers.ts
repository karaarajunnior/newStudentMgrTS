import StudentService from "../services/StudentService";
import { Request, Response } from "express";
import HttpResponse from "../utils/HttpResponse";
import { AuthenticatedRequest } from "../types/authReq";
import EmailService from "../services/emailService";

export const getStudents = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const students = await StudentService.getAllStudents();

	HttpResponse.success(res, 200, "Students retrieved successfully", {
		count: students.length,
		students,
	});
};

export const getStudent = async (req: Request, res: Response): Promise<any> => {
	const student = await StudentService.getSingleStudent(req.params.id);

	if (!student) {
		return HttpResponse.error(res, 404, "Student not found");
	}

	HttpResponse.success(res, 200, "Student retrieved successfully", student);
};

export const addStudent = async (req: Request, res: Response): Promise<any> => {
	const student = await StudentService.createStudent(req.body);

	HttpResponse.success(res, 201, "Student created successfully", student);
};

export const editStudent = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const student = await StudentService.updateStudent(req.params.id, req.body);

	HttpResponse.success(res, 200, "Student updated successfully", student);
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
		parseInt(limit as string) || 10,
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
		console.error("Failed to send welcome email:", error);
	}

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

	res.cookie("token", result.token, {
		httpOnly: true,
		//sameSite: "strict",
		maxAge: 24 * 60 * 60 * 1000,
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
	res.clearCookie("token");

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

export const resetPassword = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const { token } = req.params;
	const { password } = req.body;

	if (!password) {
		return HttpResponse.error(res, 400, "New password is required");
	}

	const result = await StudentService.resetPassword(token, password);

	HttpResponse.success(res, 200, "Password reset successful", result);
};

export const getCurrentStudent = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<any> => {
	const student = await StudentService.getCurrentStudent(req.user!.id);

	if (!student) {
		return HttpResponse.error(res, 404, "Student profile not found");
	}

	HttpResponse.success(res, 200, "Profile retrieved successfully", student);
};

//>>>>>>>>>>>>>
export const changePassword = async (
	req: AuthenticatedRequest,
	res: Response,
): Promise<any> => {
	if (!req.user) {
		return HttpResponse.error(res, 401, "Authentication required");
	}

	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return HttpResponse.error(
			res,
			400,
			"Current password and new password are required",
		);
	}

	if (newPassword.length < 6) {
		return HttpResponse.error(
			res,
			400,
			"New password must be at least 6 characters long",
		);
	}

	const student = await StudentService.getSingleStudent(req.user.id);
	if (!student) {
		return HttpResponse.error(res, 404, "Student not found");
	}

	const bcrypt = require("bcrypt");
	const isCurrentPasswordValid = await bcrypt.compare(
		currentPassword,
		student.password,
	);
	if (!isCurrentPasswordValid) {
		return HttpResponse.error(res, 400, "Current password is incorrect");
	}

	await StudentService.updateStudent(req.user.id, {
		...req.body,
		password: newPassword,
	});

	HttpResponse.success(res, 200, "Password changed successfully");
};
