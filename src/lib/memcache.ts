import cache from "ioredis";

const redis = new cache(process.env.REDIS_URL || "");

const cacheClient = {
  async get(key: string) {
    return redis.get(key);
  },
  async set(key: string, value: string) {
    return redis.set(key, value);
  },
};

export default cacheClient;
