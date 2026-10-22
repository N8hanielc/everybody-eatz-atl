"use client";

import { useEffect, useState } from "react";
import { formatCurrency, progressPercent } from "@/lib/format";
import type { DonationSummary } from "@/lib/types";
import { ProgressBar } from "@/components/donate/progress-bar";
import { DonorActivity } from "@/components/donate/donor-activity";

const REFRESH_MS = 30_000;

/**
 * Fundraising progress card for the donate page.
 * Starts from the server-rendered verified total, then quietly refreshes from
 * /api/donations so new webhook-verified gifts appear without a reload.
 */
export function DonationProgress({ initial }: { initial: DonationSummary }) {
  const [summary, setSummary] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/donations", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as DonationSummary;
        if (!cancelled && typeof data.totalRaised === "number") setSummary(data);
      } catch {
        // Network hiccup — keep showing the last known total.
      }
    };
    const id = window.setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const percent = progressPercent(summary.totalRaised, summary.goal);

  return (
    <div className="card-cream p-7 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bark/60">Total Raised</p>
          <p className="mt-2 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
            {formatCurrency(summary.totalRaised)}
          </p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-bark/60">
            of {formatCurrency(summary.goal)}
          </p>
        </div>
        <p className="font-serif text-3xl font-semibold text-ember-dark">{Math.round(percent)}%</p>
      </div>

      <div className="mt-6">
        <ProgressBar percent={percent} label="Fundraising progress toward goal" />
      </div>

      <p className="mt-4 text-sm text-bark/70">Every contribution brings us closer to our goal.</p>

      <div className="mt-6 border-t border-sand pt-5">
        <DonorActivity donors={summary.recentDonors} />
      </div>
    </div>
  );
}
