import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import path from "path";

// Internal files of the project
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import serviceRoutes from "./routes/serviceRoutes";

// APPLICATION
const app: Application = express();

// LOAD ENV
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

// SECURITY MIDDLEWARES
app.use(helmet());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "تعداد درخواست بیش از حد مجاز است! لطفاً بعداً تلاش کنید.",
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "تلاش‌های بیش از حد برای ورود. لطفاً چند دقیقه صبر کنید.",
});

// BODY PARSER
app.use(express.json());

// CROS
const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// CONNECT TO DB
connectDB();

// COOKIE PARSER
app.use(cookieParser());

// LOGGER
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// STATIC FILES
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ROUTES
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Appointment API");
});

// CENTRAL ERROR HANDLER
app.use(errorHandler);

export default app;
