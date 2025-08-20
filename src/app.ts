import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/users", userRoutes);

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
