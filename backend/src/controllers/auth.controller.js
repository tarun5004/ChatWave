import * as userDao from "../dao/user.dao.js";
import * as sessionDao from "../dao/session.dao.js";
import * as authUtils from "../utils/auth.utils.js";


export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userDao.getUserByEmailOrUsername({ email, username });
    if (existingUser) {
        return res.status(400).json({ message: "Email or username already exists" });
    }

    const user = await userDao.createUser({ username, email, password });


    const AccessToken = authUtils.generateAccessToken(user);
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



//-----------------------------Login User---------------------------------
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await userDao.getUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const AccessToken = authUtils.generateAccessToken(user);
    const RefreshToken = authUtils.generateRefreshToken(user);

    await sessionDao.updateSession({ userId: user._id, refreshToken: RefreshToken });

    res.cookie("refreshToken", RefreshToken, 
        { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        },
        accessToken: AccessToken,
        refreshToken: RefreshToken
    });
}
