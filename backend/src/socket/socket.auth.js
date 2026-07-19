import jwt from "jsonwebtoken";
import config from "../config/config.js";
import * as userDao from "../dao/user.dao.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authorization token missing"));
        }

        const payload = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET);
        const user = await userDao.getUserById(payload.id);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = user; // Attach the user object to the socket for future use
        next(); // Allow the connection
    } catch (error) {
        return next(new Error("Invalid token or expired token"));
    }
};
































/**
 * Goal: Jab koi client socket se connect karne ki koshish kare, uske handshake.auth.token ko verify karo — bilkul jaisa authenticateUser HTTP middleware Authorization header verify karta hai
Input: socket object (jisme socket.handshake.auth.token hoga), aur next function
Expected output: Agar token valid hai → socket.user set ho aur next() call ho (connection allow). Agar invalid/missing → next(new Error("...")) call ho (connection reject)
 */