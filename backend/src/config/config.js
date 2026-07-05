import { config as loadEnv } from "dotenv";

loadEnv({ quiet: true });


if(!process.env.MONGO_URI){
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1); // Exit the process with an error code
}

if(!process.env.JWT_ACCESS_TOKEN_SECRET){
    console.error("JWT_ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    process.exit(1); // Exit the process with an error code
}

if(!process.env.JWT_REFRESH_TOKEN_SECRET){
    console.error("JWT_REFRESH_TOKEN_SECRET is not defined in the environment variables.");
    process.exit(1); // Exit the process with an error code
}

if(!process.env.REDIS_URL) {
    console.error("REDIS_URL is not defined in the environment variables.");
    process.exit(1); // Exit the process with an error code
}

const _config = {
    Mongo_URI: process.env.MONGO_URI || "mongodb://localhost:27017/chatwave",
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    REDIS_URL: process.env.REDIS_URL
};


export default Object.freeze(_config);
