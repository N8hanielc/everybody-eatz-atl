/** A single public donor entry. Contains ONLY information the donor agreed to show. */
export type PublicDonor = {
  id: string;
  /** "Jordan T." when the donor opted in, otherwise null (anonymous). */
  displayName: string | null;
  /** Amount in whole currency units (e.g. dollars). Null for anonymous donors. */
  amount: number | null;
  createdAt: string;
};

/** Safe, public fundraising summary — aggregate total plus consented donor display info. */
export type DonationSummary = {
  /** Total of verified (paid, not refunded) donations, in dollars. */
  totalRaised: number;
  donationCount: number;
  goal: number;
  recentDonors: PublicDonor[];
  /** False when Supabase isn't configured yet — the UI still shows $0. */
  connected: boolean;
};

export type DonorDisplayPreference = "name" | "anonymous";
