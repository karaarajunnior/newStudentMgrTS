import Joi from "joi";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

export const validateStudent = asyncHandler(
	(req: Request, res: Response, next: NextFunction) => {
		const schema = Joi.object({
			id: Joi.string().required(),
			firstname: Joi.string().min(2).max(50).required(),
			lastname: Joi.string().min(2).max(50).required(),
			tel: Joi.string().min(10).max(15).required(),
			password: Joi.string().min(6).required(),
		});
	},
);
