import User from "../models/user.model.js";
import redisClient from "../config/redis.js";

const USER_CACHE_TTL = 900; // Cache time-to-live in seconds (15 minutes)



// -----------------------------Get User by ID with Cache---------------------------------
export const getUserbyId = async (userId) => {
    const cacheKey = `user:${userId}`;

    try {
        const cachedUser = await redisClient.get(cacheKey);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }

        await redisClient.set(cacheKey, JSON.stringify(user), "EX", USER_CACHE_TTL);

        return user;
    } catch (error) {
        console.error("Error retrieving user data:", error);
        return await User.findById(userId).select("-password");
    }
};





// -----------------------------Invalidate User Cache---------------------------------
export const invalidateUserCache = async (userId) => {
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
};

// Session based refresh token validation 
export const storeRefreshTokenSession = async (userId, refreshToken) => {
    const sessionKey = `refresh:${userId}`;
    await redisClient.set(sessionKey, refreshToken, "EX", 7 * 24* 60 * 60); //7days 
};

export const validateRefreshTokenSession = async (userId, refreshToken) => {
    const sessionKey = `refresh:${userId}`;
    const stored = await redisClient.get(sessionKey);
    return stored === refreshToken;
};

export const clearRefreshTokenSession = async(userId) => {
    const sessionKey = `refresh:${userId}`;
    await redisClient.del(sessionKey);
};
