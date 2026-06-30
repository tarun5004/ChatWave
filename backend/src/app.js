import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.routes.js";



const app = express();

// ------------middleware---------------
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// -----------use routes ------------
app.use("/api", indexRouter);
app.use("/", indexRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
