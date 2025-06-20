"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    let statusCode = res.statusCode;
    if (statusCode === 200)
        statusCode = 500; // fallback if not explicitly set
    res.status(statusCode);
    switch (statusCode) {
        case 400:
            res.json({
                title: "VALIDATION ERROR",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 401:
            res.json({
                title: "NOT AUTHORISED",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 403:
            res.json({
                title: "FORBIDDEN",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 404:
            res.json({
                title: "NOT FOUND",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 500:
        default:
            res.json({
                title: "INTERNAL SERVER ERROR",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
    }
};
exports.errorHandler = errorHandler;
