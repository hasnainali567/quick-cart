import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

/**
 * Acquires a distributed lock using Redis SET NX EX pattern
 * @param {string} lockKey - The lock key (e.g., "driver:lock:123")
 * @param {string} lockValue - Unique identifier for the lock holder (e.g., job ID)
 * @param {number} ttlMs - Lock TTL in milliseconds (default: 30000)
 * @returns {Promise<boolean>} - True if lock acquired, false otherwise
 */
export async function acquireLock(lockKey, lockValue, ttlMs = 30000) {
  const result = await redis.set(lockKey, lockValue, "PX", ttlMs, "NX");
  return result === "OK";
}

/**
 * Releases a distributed lock only if we own it (Lua script for atomicity)
 * @param {string} lockKey - The lock key
 * @param {string} lockValue - The lock value we expect to match
 * @returns {Promise<boolean>} - True if lock released, false if not owned
 */
export async function releaseLock(lockKey, lockValue) {
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;
  const result = await redis.eval(script, 1, lockKey, lockValue);
  return result === 1;
}

/**
 * Extends a lock's TTL if we own it
 * @param {string} lockKey - The lock key
 * @param {string} lockValue - The lock value we expect to match
 * @param {number} ttlMs - New TTL in milliseconds
 * @returns {Promise<boolean>} - True if extended, false if not owned
 */
export async function extendLock(lockKey, lockValue, ttlMs = 30000) {
  const script = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("PEXPIRE", KEYS[1], ARGV[2])
    else
      return 0
    end
  `;
  const result = await redis.eval(script, 1, lockKey, lockValue, ttlMs);
  return result === 1;
}

/**
 * Attempts to acquire a lock with retries
 * @param {string} lockKey - The lock key
 * @param {string} lockValue - Unique identifier for the lock holder
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum retry attempts (default: 10)
 * @param {number} options.retryDelayMs - Delay between retries in ms (default: 200)
 * @param {number} options.ttlMs - Lock TTL in milliseconds (default: 30000)
 * @returns {Promise<boolean>} - True if lock acquired
 */
export async function acquireLockWithRetry(lockKey, lockValue, options = {}) {
  const { maxRetries = 10, retryDelayMs = 200, ttlMs = 30000 } = options;

  for (let i = 0; i < maxRetries; i++) {
    const acquired = await acquireLock(lockKey, lockValue, ttlMs);
    if (acquired) return true;

    if (i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
  return false;
}

export default redis;