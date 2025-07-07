import express from "express";
import { connectDB } from "./src/v1/config/db.js";
import cors from "cors";
import { env } from "./src/v1/config/env.config.js";

const app = express();

// Allow CORS from any origin in development
const corsOptions = env.NODE_ENV === "development" ? { origin: true } : {}; // for production, you might want to specify allowed origins
app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
     res.json({ status: "Server is live", project: "ENDO1000" });
});

export default app;
