import {Router} from "express";
import authRouter from "./auth.routes.js";


const indexRouter = Router();
indexRouter.use("/auth", authRouter);

export default indexRouter;