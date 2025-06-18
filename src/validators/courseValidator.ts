import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const validateCourse = asyncHandler(
	(req: Request, res: Response, next: NextFunction) => {
		const schema = Joi.object({
			id: Joi.number().required(),
			course_unit: Joi.string().min(2).max(50).required(),
			code: Joi.string().min(2).max(20).required(),
		});
	},
);

export const validateEnrollment = asyncHandler(
	(req: Request, res: Response, next: NextFunction) => {
		const schema = Joi.object({
			studentId: Joi.number().required(),
			courseId: Joi.number().required(),
			status: Joi.string().valid("active", "completed", "dropped").optional(),
		});
	},
);
