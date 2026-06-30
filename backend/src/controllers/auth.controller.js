import * as userDao from "../dao/user.dao.js";
import * as sessionDao from "../dao/session.dao.js";
// import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils.js";
import * as authUtils from "../utils/auth.utils.js";


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


    await sessionDao.createSession({ userId: user._id, refreshToken: RefreshToken });

    res.cookie("refreshToken", RefreshToken, {
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

//-----------------------------Logout User---------------------------------
export const logoutUser = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token not found" });
    }
    if (!authUtils.verifyAccessToken(refreshToken)) {
        return res.status(400).json({ message: "Invalid refresh token" });
    }

    const decoded = authUtils.verifyAccessToken(refreshToken);
    await sessionDao.updateSession({ userId: decoded.id, refreshToken: null });
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User logged out successfully" });
}


//-----------------------------Refresh Token Generation---------------------------------
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies.RefreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    const payload = jwt.verifyAccessToken(refreshToken);
    const session = await sessionDao.getSessionByUserId({ userId: payload.id, refreshToken });
    if (!session) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isValidRefreshToken = authUtils.verifyRefreshToken(refreshToken);

    if (!isValidRefreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await userDao.getUserByEmailOrUsername({ email: payload.email, username: null });
    
    const newAccessToken = authUtils.generateAccessToken(user);

    return res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken: newAccessToken
    });
}


//-----------------------------Get USER by ID ---------------------------------

export const getMe = async (req, res) => {
    return res.status(200).json({
    user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    }
    });
};

