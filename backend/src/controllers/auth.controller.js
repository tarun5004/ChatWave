import * as userDao from "../dao/user.dao.js";
import * as sessionDao from "../dao/session.dao.js";
// import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils.js";
import * as authUtils from "../utils/auth.utils.js";
import * as userCacheService from "../services/userCache.service.js";


const REFRESH_COOKIE_OPTIONS ={
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const REFRESH_COOKIE_CLEAR_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
}


// -----------------------------Register User---------------------------------
// ==================== REGISTER ====================
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userDao.getUserByEmailOrUsername({ email, username });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }

        const user = await userDao.createUser({ username, email, password });

        const accessToken = authUtils.generateAccessToken(user);
        const refreshToken = authUtils.generateRefreshToken(user);

        await sessionDao.createSession({ userId: user._id, refreshToken });
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        return res.status(201).json({
            message: "User registered successfully",
            user: { _id: user._id, username: user.username, email: user.email },
            accessToken : accessToken,
        });
    } catch (err) {
        next(err); // error middleware ko forward — controller mein hi res bhejne se JSON format todta agar unexpected error aaye
    }
};



//-----------------------------Login User---------------------------------
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const loginIdentifier = email.trim();

        const user = await userDao.getUserByLoginIdentifier(loginIdentifier);
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

        const accessToken = authUtils.generateAccessToken(user);
        const refreshToken = authUtils.generateRefreshToken(user);

        await sessionDao.createSession({ userId: user._id, refreshToken });
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

        return res.status(200).json({
            message: "User logged in successfully",
            user: { _id: user._id, username: user.username, email: user.email },
            accessToken,
        });
    } catch (err) {
        next(err);
    }
};



//-----------------------------Refresh Token Generation---------------------------------
export const refreshAccessToken = async (req, res, next) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({message: "Refresh token not found"});
        }

        // Step 1 - signature + expiry check(JWT verify)
        let payload;
        try{
            payload = authUtils.verifyRefreshToken(refreshToken);
        }catch {
            return res.status(401).json({message: "Invalid refresh token"});
        }

        // Step 2 -  Check this extract token we issued by us or not (DB check)
        const session = await sessionDao.getSessionByUserId(payload.id);
        if (!session) {
            return res.status(401).json({message: "Invalid refresh token"});
        }

        const isValid = await session.compareRefreshToken(refreshToken);
        if (!isValid) {
            return res.status(401).json({message: "Invalid refresh token"});
        }

        // Step 3 - Generate new access token
        const user = await userDao.getUserById(payload.id);
        if (!user) {
            await sessionDao.deleteSession(payload.id);
            res.clearCookie("refreshToken", REFRESH_COOKIE_CLEAR_OPTIONS);
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = authUtils.generateAccessToken(user);

        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken
        });
    }catch (err){
        next(err);
    }
}



//-----------------------------Logout User---------------------------------
export const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token not found" });
        }

        // Step 1 - Verify the refresh token
        let payload;
        try {
            payload = authUtils.verifyRefreshToken(refreshToken);
        } catch {
            res.clearCookie("refreshToken", REFRESH_COOKIE_CLEAR_OPTIONS);
            return res.status(401).json({ message: "Already logged out" });
        }

        // Step 2 - Delete the session from the database
        await sessionDao.deleteSession(payload.id);
        res.clearCookie("refreshToken", REFRESH_COOKIE_CLEAR_OPTIONS);

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        next(err);
    }
}


//-----------------------------Get USER by ID ---------------------------------

export const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        user: { _id: req.user._id, username: req.user.username, email: req.user.email },
    });
};



// ----------------------------Update Profile -----------------------------------


export const updateProfile = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        const { username, email } = req.body;
        if (!username && !email) {
            return res.status(400).json({ message: "At least one field required" });
        }

        const profileUpdates = {};
        if (username) profileUpdates.username = username;
        if (email) profileUpdates.email = email;

        const updatedUser = await userDao.updateUserProfile(userId, profileUpdates);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await userCacheService.invalidateUserCache(userId);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

// ---------------------------------DELETE USER---------------------------------
export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const password = req.body.password;
        const deletedUser = await userDao.deleteUser(userId, password);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await userCacheService.invalidateUserCache(userId);
        await sessionDao.deleteSession(userId);
        res.clearCookie("refreshToken", REFRESH_COOKIE_CLEAR_OPTIONS);

        return res.status(200).json({
            message: "User deleted successfully",
            user: {
                _id: deletedUser._id,
                username: deletedUser.username,
                email: deletedUser.email
            }
        });
    } catch (err) {
        next(err);
    }
}


// -----------------------------Get User by ID (For search)---------------------------------
export const getUserByEmailOrUsername = async (req, res, next) => {
    try {
        const {email, username} = req.query;

        const user = await userDao.getUserByEmailOrUsername({email, username});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await userDao.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
}

