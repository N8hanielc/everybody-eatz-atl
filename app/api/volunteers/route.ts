import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateVolunteerInput } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Forms submitted faster than this are almost certainly bots. */
const MIN_FILL_TIME_MS = 2500;

/**
 * POST /api/volunteers
 * Validates the sign-up on the server and stores it in Supabase with the
 * server-only service-role client. Visitors can submit but never read
 * other volunteers' information (Row Level Security blocks public access).
 */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "volunteer"), 5, 10 * 60_000).allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam protection: a hidden "website" field humans never see, plus a minimum fill time.
  // Bots get a normal-looking success response so they don't learn what tripped them.
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";
  const startedAt = Number(body.startedAt);
  const tooFast = Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const result = validateVolunteerInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors: result.errors },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[volunteers] Supabase is not configured.");
    return NextResponse.json(
      { error: "Volunteer sign-up isn't available yet. Please check back soon." },
      { status: 503 },
    );
  }

  const v = result.data;
  const { error } = await supabase.from("volunteers").insert({
    full_name: v.fullName,
    email: v.email,
    phone: v.phone,
    volunteer_role: v.volunteerRole,
    availability: v.availability,
    group_size: v.groupSize,
    notes: v.notes,
  });

  if (error) {
    console.error("[volunteers] Insert failed:", error);
    return NextResponse.json(
      { error: "We couldn't save your sign-up. Please try again in a moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
