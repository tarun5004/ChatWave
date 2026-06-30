import * as authController from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerUserValidator, loginUserValidator } from "../validator/auth.validator.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";


const authRouter = Router();

//-----------------------------Register User---------------------------------
authRouter.post("/register", registerUserValidator, authController.registerUser);

//-----------------------------Login User---------------------------------
authRouter.post("/login", loginUserValidator, authController.loginUser);

//-----------------------------Logout User---------------------------------
authRouter.post("/logout", authController.logoutUser);

//-----------------------------Refresh Token---------------------------------
authRouter.post("/refresh-token", authController.refreshToken);

//-----------------------------get me---------------------------------
authRouter.get("/me", authenticateUser, authController.getMe);

export default authRouter;
