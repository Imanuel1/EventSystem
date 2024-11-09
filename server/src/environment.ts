import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT;

export const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379"
export const redisDb = process.env.REDIS_DATABASE_INDEX ?? "0"