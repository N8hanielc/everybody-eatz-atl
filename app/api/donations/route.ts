import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { getDonationSummary } from "@/lib/donations";
import { getStripe } from "@/lib/stripe";
import { getSiteUrl } from "@/lib/site-url";
import { buildDisplayName, validateDonationInput } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/donations
 * Public, safe summary: the verified total and donor names donors chose to share.
 */
export async function GET() {
  const summary = await getDonationSummary();
  return NextResponse.json(summary, {
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60" },
  });
}

/**
 * POST /api/donations
 * Validates the amount on the server and creates a Stripe Checkout Session.
 * Nothing is recorded here — a donation only counts after the Stripe webhook
 * confirms payment (see /api/stripe-webhook).
 */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "checkout"), 10, 60_000).allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("[donations] STRIPE_SECRET_KEY is not set.");
    return NextResponse.json(
      { error: "Online donations aren't available yet. Please check back soon." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validateDonationInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: result.errors },
      { status: 400 },
    );
  }

  const { amount, displayPreference, firstName, lastInitial } = result.data;
  const unitAmount = Math.round(amount * 100);
  const displayName = displayPreference === "name" ? buildDisplayName(firstName, lastInitial) : "";
  const siteUrl = getSiteUrl();
  const { fundraising } = siteConfig;

  const metadata = {
    donor_display_preference: displayPreference,
    donor_display_name: displayName,
    source: "everybody-eatz-atl-website",
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: fundraising.currency,
            unit_amount: unitAmount,
            product_data: {
              name: fundraising.checkoutProductName,
              description: fundraising.checkoutProductDescription,
            },
          },
        },
      ],
      metadata,
      payment_intent_data: {
        description: fundraising.checkoutProductName,
        metadata,
      },
      success_url: `${siteUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/donate/cancel`,
    });

    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[donations] Failed to create Checkout Session:", error);
    return NextResponse.json(
      { error: "We couldn't start the secure checkout. Please try again in a moment." },
      { status: 502 },
    );
  }
}
