import {Router} from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import conversationRouter from "./conversation.routes.js";


const indexRouter = Router();
indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/conversations", conversationRouter);

export default indexRouter;
