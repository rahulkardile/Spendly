import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

// Create a rate limiter using Upstash Redis and sliding window algorithm
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(), // Automatically reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per 60 seconds
});

export default ratelimit;
