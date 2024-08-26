import cacheClient from "./memcache";

interface RateLimitOptions {
  key: string;
  maxRequests: number;
  windowMs: number;
}

export async function checkRateLimit(
  options: RateLimitOptions
): Promise<boolean> {
  const { key, maxRequests, windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  const cacheKey = `ratelimit:${key}`;
  const requestData = await cacheClient.get(cacheKey);

  let requests: number[] = requestData ? JSON.parse(requestData) : [];
  requests = requests.filter((timestamp) => timestamp > windowStart);

  if (requests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  requests.push(now);
  await cacheClient.set(cacheKey, JSON.stringify(requests));

  return true; // Request allowed
}
