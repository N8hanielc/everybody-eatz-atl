import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { formatCurrency } from "@/lib/format";
import { LeafDivider } from "@/components/decor/leaf";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string }> };

/**
 * Shown after Stripe redirects back. This page does NOT record or count the
 * donation — only the verified webhook does. It just looks up the session
 * (server-side) to show a friendly confirmation.
 */
export default async function DonateSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  let amount: number | null = null;
  let paid = false;

  const stripe = getStripe();
  if (stripe && sessionId && /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      amount = session.amount_total !== null ? session.amount_total / 100 : null;
    } catch {
      // Unknown or expired session — show the generic thank-you.
    }
  }

  return (
    <div className="container-page flex justify-center pt-16 sm:pt-24">
      <div className="card-cream w-full max-w-xl p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-dark" aria-hidden="true" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Thank you!</h1>
        <p className="mt-4 text-lg leading-relaxed text-bark/75">
          {paid && amount !== null
            ? `Your ${formatCurrency(amount)} donation went through. `
            : "Thanks for supporting Everybody Eatz ATL. "}
          Your generosity helps put Thanksgiving meals on the table for families in our community.
        </p>
        <p className="mt-3 text-sm text-bark/60">
          {paid
            ? "Stripe will email your receipt. The fundraising total updates as soon as Stripe confirms the payment."
            : "If your payment is still processing, it will be added to the fundraising total once Stripe confirms it."}
        </p>

        <LeafDivider className="my-8" />

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/donate#volunteer" className="btn-primary">
            Volunteer With Us
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
