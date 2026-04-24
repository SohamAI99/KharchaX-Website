// utils/rateLimit.ts

const rateLimitMap = new Map();

/**
 * Basic In-Memory Rate Limiter for Next.js App Router API
 * @param ip - The IP address to track
 * @param limit - Maximum allowed requests in the window
 * @param windowMs - The time window in milliseconds (default: 1 minute)
 * @returns boolean - true if allowed, false if rate limited
 */
export function checkRateLimit(ip: string, limit: number, windowMs = 60000): boolean {
  const currentTime = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: currentTime + windowMs });
    return true;
  }

  const record = rateLimitMap.get(ip);

  if (currentTime > record.resetTime) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, resetTime: currentTime + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false; // Rate limit exceeded
  }

  // Increment
  record.count += 1;
  return true;
}
