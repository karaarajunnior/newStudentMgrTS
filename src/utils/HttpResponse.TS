import { Response } from "express";

class HttpResponse {
	static success(
		res: Response,
		statusCode: number = 200,
		message: string = "Success",
		data: any = null,
	) {
		const response: any = {
			success: true,
			message,
		};

		if (data !== null) {
			response.data = data;
		}

		return res.status(statusCode).json(response);
	}

	static error(
		res: Response,
		statusCode: number = 500,
		message: string = "Internal Server Error",
		errors: any = null,
	) {
		const response: any = {
			success: false,
			message,
		};

		if (errors !== null) {
			response.errors = errors;
		}

		return res.status(statusCode).json(response);
	}

	static paginated(
		res: Response,
		data: any[],
		page: number,
		limit: number,
		total: number,
		message: string = "Data retrieved successfully",
	) {
		const totalPages = Math.ceil(total / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		return res.status(200).json({
			success: true,
			message,
			data,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems: total,
				itemsPerPage: limit,
				hasNextPage,
				hasPrevPage,
			},
		});
	}

	static created(
		res: Response,
		message: string = "Resource created successfully",
		data: any = null,
	) {
		return this.success(res, 201, message, data);
	}

	static badRequest(
		res: Response,
		message: string = "Bad Request",
		errors: any = null,
	) {
		return this.error(res, 400, message, errors);
	}

	static unauthorized(res: Response, message: string = "Unauthorized") {
		return this.error(res, 401, message);
	}

	static forbidden(res: Response, message: string = "Forbidden") {
		return this.error(res, 403, message);
	}

	static notFound(res: Response, message: string = "Resource not found") {
		return this.error(res, 404, message);
	}

	static conflict(res: Response, message: string = "Conflict") {
		return this.error(res, 409, message);
	}

	static validationError(
		res: Response,
		errors: any,
		message: string = "Validation failed",
	) {
		return this.error(res, 422, message, errors);
	}

	static internalServerError(
		res: Response,
		message: string = "Internal Server Error",
	) {
		return this.error(res, 500, message);
	}
}

export default HttpResponse;
