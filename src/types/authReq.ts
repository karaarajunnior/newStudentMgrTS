import { Request } from "express";

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		tel: string;
		firstname: string;
		lastname?: string;
		email?: string;
	};
}
