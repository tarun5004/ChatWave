import jwt from "jsonwebtoken";
import config from "../config/config.js";


// -----------------------------Generate Access Token---------------------------------
/**
 * Generate a JWT access token for a user.
 * @param {Object} user - The user object for whom to generate the token.
 * @param {string} user._id - The unique identifier of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} user.email - The email address of the user.
 * @returns {String} The generated JWT access token.
 */
export const generateAccessToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
    }
    const Accesstoken = jwt.sign(
        payload, 
        config.JWT_ACCESS_TOKEN_SECRET,
        { 
            expiresIn: "15m" 
        });
    return Accesstoken;
};

// -----------------------------Generate Refresh Token---------------------------------
/**
 * Generate a JWT refresh token for a user.
 * @param {Object} user - The user object for whom to generate the token.
 * @param {string} user._id - The unique identifier of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} user.email - The email address of the user.
 * @returns {String} The generated JWT refresh token.
 */

export const generateRefreshToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
    };
    const Refreshtoken = jwt.sign(
        payload,
        config.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
    return Refreshtoken;
};


//-----------------------------Verify Access Token---------------------------------

export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
};

//-----------------------------Verify Refresh Token---------------------------------

export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_REFRESH_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};
