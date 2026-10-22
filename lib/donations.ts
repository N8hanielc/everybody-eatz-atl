import "server-only";
import { siteConfig } from "@/config/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { DonationSummary, PublicDonor } from "@/lib/types";

const RECENT_DONOR_LIMIT = 8;

function emptySummary(connected: boolean): DonationSummary {
  return {
    totalRaised: 0,
    donationCount: 0,
    goal: siteConfig.fundraising.goal,
    recentDonors: [],
    connected,
  };
}

/**
 * Returns the public fundraising summary.
 *
 * Counts ONLY rows written by the verified Stripe webhook with
 * payment_status = 'paid'. Clicking "Donate" or landing on the success
 * page never creates a row, so it can never inflate the total.
 *
 * Never returns emails, full names, payment IDs, or other private data.
 */
export async function getDonationSummary(): Promise<DonationSummary> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return emptySummary(false);

  try {
    const [totals, recent] = await Promise.all([
      supabase.from("donations").select("amount_cents").eq("payment_status", "paid"),
      supabase
        .from("donations")
        .select("id, amount_cents, donor_display_name, is_anonymous, created_at")
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false })
        .limit(RECENT_DONOR_LIMIT),
    ]);

    if (totals.error) throw totals.error;
    if (recent.error) throw recent.error;

    const rows = (totals.data ?? []) as { amount_cents: number }[];
    const totalCents = rows.reduce((sum, r) => sum + (Number(r.amount_cents) || 0), 0);

    const recentDonors: PublicDonor[] = (
      (recent.data ?? []) as {
        id: string;
        amount_cents: number;
        donor_display_name: string | null;
        is_anonymous: boolean;
        created_at: string;
      }[]
    ).map((r) => {
      const anonymous = r.is_anonymous || !r.donor_display_name;
      return {
        id: r.id,
        displayName: anonymous ? null : r.donor_display_name,
        amount: anonymous ? null : Math.round(Number(r.amount_cents)) / 100,
        createdAt: r.created_at,
      };
    });

    return {
      totalRaised: totalCents / 100,
      donationCount: rows.length,
      goal: siteConfig.fundraising.goal,
      recentDonors,
      connected: true,
    };
  } catch (error) {
    console.error("[donations] Failed to load summary:", error);
    return emptySummary(false);
  }
}
