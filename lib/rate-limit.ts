import "server-only";

/**
 * Very small, best-effort in-memory rate limiter.
 *
 * On serverless hosting (Vercel) each instance has its own memory, so this
 * only slows down obvious bursts from a single client. It is a light extra
 * layer on top of the honeypot and server-side validation — not a guarantee.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { allowed: true };
  }

  bucket.count += 1;
  return { allowed: bucket.count <= limit };
}

export function clientKey(req: Request, scope: string) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
