import { config as loadEnv } from "dotenv";

loadEnv({ quiet: true });


if(!process.env.MONGO_URI){
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1); // Exit the process with an error code
}

const _config = {
    Mongo_URI: process.env.MONGO_URI || "mongodb://localhost:27017/chatwave"
};

export default Object.freeze(_config);
