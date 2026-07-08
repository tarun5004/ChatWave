import * as authController from "../controllers/auth.controller.js";
import { Router } from "express";
import { registerUserValidator, loginUserValidator, updateProfileValidator } from "../validator/auth.validator.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";


const authRouter = Router();

//-----------------------------Register User---------------------------------
authRouter.post("/register",authRateLimiter(5, 60), registerUserValidator, authController.registerUser);

//-----------------------------Login User---------------------------------
authRouter.post("/login", authRateLimiter(5, 60), loginUserValidator, authController.loginUser);

//-----------------------------Logout User---------------------------------
authRouter.post("/logout", authController.logoutUser);

//-----------------------------Refresh Token---------------------------------
authRouter.post("/refresh-token", authController.refreshAccessToken);

//-----------------------------get me---------------------------------
authRouter.get("/me", authenticateUser, authController.getMe);

//-----------------------------Update Profile---------------------------------
authRouter.put("/update-profile", authenticateUser, updateProfileValidator, authController.updateProfile);

// -----------------------------Delete User---------------------------------
authRouter.delete("/delete-user", authenticateUser, authController.deleteUser);

// -----------------------------Search user---------------------------------
authRouter.get("/user/search", authenticateUser, authController.getUserByEmailOrUsername);

// -----------------------------Get user by ID---------------------------------
authRouter.get("/user/:id", authenticateUser, authController.getUserById);

export default authRouter;
