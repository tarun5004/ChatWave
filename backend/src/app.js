import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.routes.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";



const app = express();

// ------------middleware---------------
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// -----------use routes ------------
app.use("/api", indexRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
