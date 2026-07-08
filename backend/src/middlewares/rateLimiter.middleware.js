import redisClient from "../config/redis.js";

export const authRateLimiter = (maxRequests = 5, windowSeconds = 60) => {
    return async (req, res, next) => {
        try {
            const key = `ratelimit:auth:${req.ip}`;
            const current = await redisClient.incr(key);
            if (current === 1) {
                await redisClient.expire(key, windowSeconds);
            }
            if (current > maxRequests) {
                return res.status(429).json({ message: "Too many requests" });
            }
            next();
        } catch (err) {
            console.error("Rate limiter unavailable:", err.message);
            next();
        }
    }
}

/**
 * har IP ke liye ek counter key, 60 sec window mein 5 se zyada login/register 
 * attempts → block. fail-open isliye important hai — agar Redis hi down ho jaye,
 *  tera auth system fail-closed nahi hona chahiye (warna Redis down = koi login hi 
 * nahi kar payega).
 */
