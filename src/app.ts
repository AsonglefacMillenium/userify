import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import hpp from "hpp";
import compression from "compression"
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());
app.use(cors());
app.use(hpp())
app.use(compression())

app.use(morgan("combined"))


app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({extended: true, limit: "1mb"}))


//rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/users", userRoutes);

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(notFound)
app.use(errorHandler)

export default app;
