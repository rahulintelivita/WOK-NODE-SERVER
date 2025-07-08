import { ResponseHandler } from "../common/responseHendler.js";
import { logMessage } from "./logger.js";

export function errorHandler(error, req, res, next) {
     // Log the error
     logMessage(error, req);

     // Handle validation errors from Joi
     if (error.message && error.statusCode === 400) {
          return ResponseHandler.error(res, {
               message: error.message,
               statusCode: 400
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

     // Handle other errors
     return ResponseHandler.error(res, {
          message: "Internal server error",
          statusCode: 500,
          errors: { server: error.message }
     });
}
