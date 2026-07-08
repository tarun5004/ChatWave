import Redis from "ioredis";
import config from "./config.js";

const redisClient = new Redis(config.REDIS_URL || "redis://localhost:6379");
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;
