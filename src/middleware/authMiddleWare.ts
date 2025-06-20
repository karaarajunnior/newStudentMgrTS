import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../types/authStudent";

dotenv.config();
const prisma = new PrismaClient();

export const authenticate = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const authHeader = req.headers.authorization;
	let token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		token = req.cookies?.token;
	}

	if (!token) {
		res.status(401).json({
			success: false,
			message: "Access denied. No token provided.",
		});
	}

	try {
		const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN!) as any;

		const user = await prisma.students.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				tel: true,
				firstname: true,
				lastname: true,
				email: true,
			},
		});

		if (!user) {
			res.status(401).json({
				success: false,
				message: "Invalid token. User not found.",
			});
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};
