import * as authController from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerUserValidator } from "../validator/auth.validator.js";


const authRouter = Router();


authRouter.post("/register", registerUserValidator, authController.registerUser);

export default authRouter;