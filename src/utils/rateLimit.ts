import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(2, "1 h"), 
  analytics: false,
});
