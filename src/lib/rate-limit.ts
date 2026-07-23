import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only instantiate Redis if the env variables are present to avoid runtime errors when not configured
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? Redis.fromEnv()
  : null;

// Create a new ratelimiter, that allows 5 requests per 10 seconds
export const rateLimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
}) : null;
