import jwt from "jsonwebtoken";
import { Response, NextFunction, Request } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
	};
}

dotenv.config();
const prisma = new PrismaClient();

export const ensureAutheticated = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const authHeader = req.headers.authorization;
	let accessToken = authHeader?.split(" ")[1];

	if (!accessToken) {
		res.status(401).json({ message: "token doesnot exist in header" });
		accessToken = req.cookies?.accessToken;
	}
	try {
		const decoded = jwt.verify(accessToken!, process.env.ACCESS_TOKEN!) as any;
		req.user = { id: decoded.id };
		next();
	} catch (error) {
		throw error;
	}
};
