import * as authController from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerUserValidator, loginUserValidator } from "../validator/auth.validator.js";


const authRouter = Router();

//-----------------------------Register User---------------------------------
authRouter.post("/register", registerUserValidator, authController.registerUser);

//-----------------------------Login User---------------------------------
authRouter.post("/login", loginUserValidator, authController.loginUser);

export default authRouter;