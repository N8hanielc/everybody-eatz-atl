import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe-webhook
 *
 * The ONLY place a donation is recorded. Stripe calls this endpoint after a
 * payment; we verify the signature with STRIPE_WEBHOOK_SECRET so nobody can
 * fake a donation, then store it in Supabase.
 *
 * Duplicate protection: stripe_checkout_session_id and stripe_payment_intent_id
 * are UNIQUE in the database, and inserts ignore duplicates — so if Stripe
 * retries the same event, the donation is still counted only once.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("[stripe-webhook] Stripe keys are not configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // The raw body is required for signature verification.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.warn("[stripe-webhook] Signature verification failed:", (error as Error).message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Delayed payment methods complete as "unpaid" first; they are recorded
        // later when checkout.session.async_payment_succeeded arrives.
        if (session.payment_status !== "paid") break;
        await recordDonation(session);
        refreshPages();
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        // Only full refunds remove a donation from the total.
        if (charge.refunded) {
          await markRefunded(charge);
          refreshPages();
        }
        break;
      }

      default:
        // Other events are acknowledged and ignored.
        break;
    }
  } catch (error) {
    console.error(`[stripe-webhook] Failed to handle ${event.type}:`, error);
    // A 500 tells Stripe to retry later, so no verified payment is lost.
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function recordDonation(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured.");

  const amountCents = session.amount_total ?? 0;
  if (amountCents <= 0) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const wantsName = session.metadata?.donor_display_preference === "name";
  const rawName = (session.metadata?.donor_display_name ?? "").trim().slice(0, 40);
  const displayName = wantsName && rawName ? rawName : null;

  const { error } = await supabase.from("donations").upsert(
    {
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      amount_cents: amountCents,
      currency: (session.currency ?? "usd").toLowerCase(),
      donor_display_name: displayName,
      is_anonymous: !displayName,
      payment_status: "paid",
    },
    { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true },
  );

  // 23505 = unique violation (e.g. same payment intent already stored). Safe to ignore.
  if (error && error.code !== "23505") throw error;
}

async function markRefunded(charge: Stripe.Charge) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured.");

  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  const { error } = await supabase
    .from("donations")
    .update({ payment_status: "refunded" })
    .eq("stripe_payment_intent_id", paymentIntentId);

  if (error) throw error;
}

function refreshPages() {
  try {
    revalidatePath("/");
    revalidatePath("/donate");
  } catch (error) {
    console.warn("[stripe-webhook] revalidatePath failed:", error);
  }
}
