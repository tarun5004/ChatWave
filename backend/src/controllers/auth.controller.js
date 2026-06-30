import * as userDao from "../dao/user.dao.js";
import * as sessionDao from "../dao/session.dao.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils.js";


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userDao.getUserByEmailOrUsername({ email, username });
    if (existingUser) {
        return res.status(400).json({ message: "Email or username already exists" });
    }

    const user = await userDao.createUser({ username, email, password });


    const AccessToken = authUtils.generateAccessToken(user);  //why we pass full user obj not only user._id? because we might want to include other user info in the token payload for future use, like username or email, which can be useful for authorization and personalization in the application.
    const RefreshToken = authUtils.generateRefreshToken(user);

    await sessionDao.createSession({ userId: user._id, refreshToken: RefreshToken });

    res.cookie("refreshToken", RefreshToken, 
        { 
            httpOnly: true, 
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        },
        accessToken: AccessToken,
        refreshToken: RefreshToken
    });
}

