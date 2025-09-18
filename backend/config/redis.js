import { createClient } from "redis";

let redisClient; // singleton

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

    await redisClient.connect();
    console.log("✅ Redis connected");
  }

  return redisClient;
};
