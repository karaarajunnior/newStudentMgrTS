import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/authReq";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	let token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		token = req.cookies?.token;
	}

	// if (!token) {
	// 	res.status(401).json({
	// 		success: false,
	// 		message: "Access denied. No token provided.",
	// 	});
	// 	return;
	// }

	try {
		const decoded = jwt.verify(token!, process.env.ACCESS_TOKEN!) as any;

		const user = await prisma.students.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				tel: true,
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

		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};
