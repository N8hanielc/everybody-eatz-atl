/**
 * The public base URL of the site, used for Stripe redirect URLs and metadata.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://everybodyeatzatl.org).
 * On Vercel preview deployments it falls back to the Vercel-provided URL.
 */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
