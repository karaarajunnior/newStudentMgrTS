import { Request } from "express";

export interface autheticateReq extends Request {
	lecturer?: {
		lecturer_id: string;
	};
}
