import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/authStudent";
import HttpResponse from "../utils/HttpResponse";
import { autheticateReq } from "../types/authLecturer";
export const authoriseStudent = (roles: string[] = []) => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const user = await prisma.students.findUnique({
			where: { id: req.user?.id },
		});

		if (!user || !roles.includes(user.role)) {
			HttpResponse.error(res, 403, "User not allowed to access these routes");
		}

		next();
	};
};

export const authoriseLecturer = (roles: string[] = []) => {
	return async (
		req: autheticateReq,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = req.lecturer?.lecturer_id;
		if (!userId) {
			HttpResponse.error(res, 401, "Unauthenticated: ID not found in request");
		}
		const user = await prisma.lecturer.findUnique({
			where: { id: req.lecturer?.lecturer_id },
		});

		if (!user || !roles.includes(user.role)) {
			HttpResponse.error(res, 403, "User not allowed to access these routes");
		}

		next();
	};
};
