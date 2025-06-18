"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResponse {
    static success(res, statusCode = 200, message = "Success", data = null) {
        const response = {
            success: true,
            message,
        };
        if (data !== null) {
            response.data = data;
        }
        return res.status(statusCode).json(response);
    }
    static error(res, statusCode = 500, message = "Internal Server Error", errors = null) {
        const response = {
            success: false,
            message,
        };
        if (errors !== null) {
            response.errors = errors;
        }
        return res.status(statusCode).json(response);
    }
    static paginated(res, data, page, limit, total, message = "Data retrieved successfully") {
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
    static created(res, message = "Resource created successfully", data = null) {
        return this.success(res, 201, message, data);
    }
    static badRequest(res, message = "Bad Request", errors = null) {
        return this.error(res, 400, message, errors);
    }
    static unauthorized(res, message = "Unauthorized") {
        return this.error(res, 401, message);
    }
    static forbidden(res, message = "Forbidden") {
        return this.error(res, 403, message);
    }
    static notFound(res, message = "Resource not found") {
        return this.error(res, 404, message);
    }
    static conflict(res, message = "Conflict") {
        return this.error(res, 409, message);
    }
    static validationError(res, errors, message = "Validation failed") {
        return this.error(res, 422, message, errors);
    }
    static internalServerError(res, message = "Internal Server Error") {
        return this.error(res, 500, message);
    }
}
exports.default = HttpResponse;
