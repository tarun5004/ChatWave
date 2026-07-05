import redisClient from "../config/redis";
import { refreshToken } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";

const USER_CACHE_TTL = 900; // Cache time-to-live in seconds (15 minutes)

export const getUserbyId = async (userId) => {
    const cacheKey = `user:${userId}`;

    // step 1: Check if the user data is in the cache
    const cachedUser = await redisClient.get(cacheKey);
    try {
    if (cachedUser) {
        console.log("User data retrieved from cache.");
        return JSON.parse(cachedUser);
    }

    // step 2: if not in cache, fetch from the database
    const user = await User.findById(userId).select("-password"); // Exclude password field
    if (!user) {
        throw new Error("User not found");
    }

    // step 3: Store the user data in the cache for future requests
    await redisClient.set(cacheKey, JSON.stringify(user), "EX", USER_CACHE_TTL);
    console.log("User data stored in cache.");

    return user;
    } catch (error) {
    console.error("Error retrieving user data:", error);
    // Handle the error appropriately, e.g., return a default value or rethrow the error
    return await User.findById(userId).select("-password"); // Fallback to database if cache fails
}
};

// INVALIDATE CACHE FUNCTION
export const invalidateUserCache = async (userId) => {
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
    console.log(`User cache invalidated for userId: ${userId}`);
};

// Session based refresh token validation 
export const storeRefreshTokenSession = async (userId, refreshToken) => {
    const sessionKey = `refresh:${userId}`;
    await redisClient.set(sessionKey, refreshToken, "EX", 7 * 24* 60 * 60); //7days 
};

export const validateRefreshTokenSession = async (userId, refreshToken) => {
    const sessionKey = `refresh:${userId}`;
    const stored = await redisClient.get(sessionKey);
    return stored == refreshToken;
};

export const clearRefreshTokenSession = async(userId) => {
    const sessionKey = `refresh:${userId}`;
    await redisClient.del(sessionKey);
};