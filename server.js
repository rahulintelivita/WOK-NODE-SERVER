import app from "./app.js";
import { createServer } from "http";
import { env } from "./src/v1/config/env.config.js";

const server = createServer(app);

server.listen(env.PORT, () => {
     console.log(`Server is running on http://localhost:${env.PORT}`);
});
