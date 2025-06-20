import { Request, Response } from "express";
import HttpResponse from "../utils/HttpResponse";
import lecturerService from "../services/lecturerService";

export const addlecturer = async (
	req: Request,
	res: Response,
): Promise<any> => {
	const lecturer = await lecturerService.createlecturer(
		req.body.name,
		req.body.role,
	);

	HttpResponse.success(res, 201, "lecturer created successfully", lecturer);
};
