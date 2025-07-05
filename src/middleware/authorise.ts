import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/authStudent";
import HttpResponse from "../utils/HttpResponse";
import { autheticateReq } from "../types/authLecturer";
export const authoriseStudent = (roles: string) => {
	return async (
		req: AuthenticatedRequest,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		try {
			const user = await prisma.students.findFirst({
				where: { tel: req.user?.tel },
			});

			if (!user) {
				console.log("user not found");
				return HttpResponse.error(res, 403, "User not found");
			}

			if (user.role === "ADMIN") {
				console.log("authorised");
				return HttpResponse.success(res, 200, "Authorised", {});
			}

			next();
		} catch (error) {
			throw error;
		}
	};
};

export const authoriseLecturer = (roles: string[] = []) => {
	return async (
		req: autheticateReq,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		if (!req.lecturer?.lecturer_id) {
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
