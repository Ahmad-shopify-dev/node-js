import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";


// ROUTES FOR DIFFERENT USERS
import { AppError } from "./utils/utils.AppError.js";
import userRoutes from "./routes/user.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { httpLogger } from "./middlewares/morgan.middleware.js";
import env from "./config/env.config.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();


// ___________ GLOBAL SECURITY OF THE APP
app.use(helmet()); // SET SECURITY HEADERS
// HANDLING CORS ERROR
app.use(cors({
    origin: env.data.NODE_ENV === 'production' ? ['https://mydomain.com']: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
}));
// GLOBAL LIMITER FOR REQUESTING DATA
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests. Try after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false
});
app.use("/api", globalLimiter);

// AUTHENTICATION LIMITER
const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many requests. Try after 15 minutes.",
});
app.use("/api/v1/auth/login", authLimit);


// CREATING BODY JSON AND URL ENCODING
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

// 1. GLOBAL LOGGER FOR EVERYTHING
// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     console.log(`${req.requestTime} : ${req.method} -> ${req.originalUrl}`);
//     next();
// })
app.use(httpLogger);

// 2. APP ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// 3. GLOBAL ROUTE HANDLER FOR 404
app.all("*splat", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// 4. USE GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
