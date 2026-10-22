import "server-only";
import Stripe from "stripe";

/**
 * Server-only Stripe client. STRIPE_SECRET_KEY is never sent to the browser.
 * Use test-mode keys (sk_test_...) while developing.
 */
let cached: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, {
      appInfo: { name: "Everybody Eatz ATL" },
    });
  }
  return cached;
}
