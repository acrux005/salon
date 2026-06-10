/**
 * Prosty rate-limit in-memory (dev/prod minimalnie).
 * Klucz np. email lub IP; max N prób w oknie windowMs.
 */
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 10;

export function tryConsume(key: string, maxAttempts = MAX_ATTEMPTS, windowMs = WINDOW_MS): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) return false;
  entry.count++;
  return true;
}

export function getRemaining(key: string, maxAttempts = MAX_ATTEMPTS): number {
  const entry = store.get(key);
  if (!entry) return maxAttempts;
  if (Date.now() > entry.resetAt) return maxAttempts;
  return Math.max(0, maxAttempts - entry.count);
}

/** Rate limit dla akcji admina (CRUD zabiegów): 30 prób / 15 min na klucz. */
export function tryConsumeAdmin(key: string, maxAttempts = 30, windowMs = 15 * 60 * 1000): boolean {
  return tryConsume(key, maxAttempts, windowMs);
}
