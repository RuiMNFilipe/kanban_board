import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

redisClient.on("connect", () => {
  console.log("Connected to Redis for notifications");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis for notifications:", err);
});

export default redisClient;
