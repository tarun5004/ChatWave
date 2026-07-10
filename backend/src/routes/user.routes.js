import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";
import { searchUsers } from "../dao/user.dao.js";

const userRouter = express.Router();

userRouter.get("/", authenticateUser, userController.searchUsers);

export default userRouter;