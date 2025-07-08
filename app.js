import express from "express";
import { connectDB } from "./src/v1/config/db.js";
import cors from "cors";
import { env } from "./src/v1/config/env.config.js";
import v1Routes from "./src/v1/routes/index.js";
import { ResponseHandler } from "./src/v1/common/responseHendler.js";
import { logMessage } from "./src/v1/middlewares/logger.js";

const app = express();
app.use(express.json());
// Allow CORS from any origin in development
const corsOptions = env.NODE_ENV === "development" ? { origin: true } : {}; // for production, you might want to specify allowed origins
app.use(cors(corsOptions));

connectDB();

app.get("/", (req, res) => {
     res.json({ status: "Server is live", project: "WOK-NODE-SERVER" });
});

app.use("/api/v1", v1Routes);

// Global error handling middleware
app.use((error, req, res, next) => {
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
});

export default app;
