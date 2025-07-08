import express from "express";
import { connectDB } from "./src/v1/config/db.js";
import cors from "cors";
import { env } from "./src/v1/config/env.config.js";
import v1Routes from "./src/v1/routes/index.js";
import { errorHandler } from "./src/v1/middlewares/errorHandler.js";

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

// Use the centralized error handler middleware
app.use(errorHandler);

export default app;
