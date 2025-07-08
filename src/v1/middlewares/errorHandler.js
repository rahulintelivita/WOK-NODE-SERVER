import { ResponseHandler } from "../common/responseHendler.js";
import { logMessage } from "./logger.js";

export function errorHandler(error, req, res, next) {
    // Log the error
    logMessage(error, req);
    
    // Use the error's statusCode if present, otherwise default to 500
    const statusCode = error.statusCode || 500;
    // Use the error's message if present, otherwise a generic message
    const message = error.message || "Internal server error";

    // Handle validation errors from Joi
    if (statusCode === 400 && error.message) {
        return ResponseHandler.error(res, {
            message,
            statusCode,
            errors: error.errors || {}
        });
    }
    // Handle Prisma errors
    if (error.name === "PrismaClientValidationError") {
        return ResponseHandler.error(res, {
            message: "Invalid data provided",
            statusCode: 400,
            errors: { validation: error.message }
        });
    }
    if (error.name === "PrismaClientKnownRequestError") {
        return ResponseHandler.error(res, {
            message: "Database operation failed",
            statusCode: 400,
            errors: { database: error.message }
        });
    }
    // Handle all other errors
    return ResponseHandler.error(res, {
        message,
        statusCode,
        errors: error.errors || {}
    });
}
