import jwt from "jsonwebtoken";
import config from "../config/config.js";
import * as userDao from "../dao/user.dao.js";


export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1]; //means split the string by space and take the second part which is the token

    try {
        const payload = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET);

        const user = await userDao.getUserById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}