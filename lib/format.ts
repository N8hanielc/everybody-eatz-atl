import { siteConfig } from "@/config/site";

/** Format a whole-dollar (or fractional) amount, e.g. 4000 → "$4,000". */
export function formatCurrency(amount: number, opts: { cents?: boolean } = {}) {
  const showCents = opts.cents ?? !Number.isInteger(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: siteConfig.fundraising.currency.toUpperCase(),
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/** Format an item price; null → "Price TBD". */
export function formatPrice(price: number | null) {
  return price === null ? "Price TBD" : formatCurrency(price, { cents: true });
}

/** Progress percentage, clamped to 0–100. */
export function progressPercent(raised: number, goal: number) {
  if (!goal || goal <= 0 || !Number.isFinite(raised) || raised <= 0) return 0;
  return Math.min(100, Math.max(0, (raised / goal) * 100));
}

/** Short relative time, e.g. "5 minutes ago". */
export function timeAgo(iso: string, now: number = Date.now()) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
