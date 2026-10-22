import { siteConfig } from "@/config/site";
import type { DonorDisplayPreference } from "@/lib/types";

/* ───────────────────────── Donations ───────────────────────── */

export type DonationInput = {
  amount: number; // whole dollars, may include cents
  displayPreference: DonorDisplayPreference;
  firstName: string;
  lastInitial: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

const NAME_PATTERN = /^[\p{L}][\p{L}' .-]*$/u;

/** Builds the public display name, e.g. ("jordan", "t") → "Jordan T." */
export function buildDisplayName(firstName: string, lastInitial: string) {
  const first = firstName.trim().replace(/\s+/g, " ");
  const initial = lastInitial.trim().charAt(0).toUpperCase();
  const cappedFirst = first.charAt(0).toUpperCase() + first.slice(1);
  return initial ? `${cappedFirst} ${initial}.` : cappedFirst;
}

export function validateDonationInput(raw: unknown): ValidationResult<DonationInput> {
  const errors: Record<string, string> = {};
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const { minAmount, maxAmount } = siteConfig.fundraising;

  const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);
  if (!Number.isFinite(amount)) {
    errors.amount = "Please choose or enter a donation amount.";
  } else if (amount < minAmount) {
    errors.amount = `The minimum donation is $${minAmount}.`;
  } else if (amount > maxAmount) {
    errors.amount = `For gifts over $${maxAmount.toLocaleString()}, please contact the organizers.`;
  } else if (Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-6) {
    errors.amount = "Please enter an amount with no more than two decimal places.";
  }

  const displayPreference: DonorDisplayPreference =
    body.displayPreference === "name" ? "name" : "anonymous";

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastInitial = typeof body.lastInitial === "string" ? body.lastInitial.trim() : "";

  if (displayPreference === "name") {
    if (!firstName) errors.firstName = "Please enter your first name, or choose Anonymous.";
    else if (firstName.length > 30 || !NAME_PATTERN.test(firstName))
      errors.firstName = "Please enter a first name using letters only (30 characters max).";
    if (lastInitial && !/^\p{L}$/u.test(lastInitial.charAt(0)))
      errors.lastInitial = "Last initial should be a single letter.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      amount: Math.round(amount * 100) / 100,
      displayPreference,
      firstName: displayPreference === "name" ? firstName : "",
      lastInitial: displayPreference === "name" ? lastInitial.charAt(0) : "",
    },
  };
}

/* ───────────────────────── Volunteers ───────────────────────── */

export type VolunteerInput = {
  fullName: string;
  email: string;
  phone: string | null;
  volunteerRole: string;
  availability: string;
  groupSize: number | null;
  notes: string | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateVolunteerInput(raw: unknown): ValidationResult<VolunteerInput> {
  const errors: Record<string, string> = {};
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const fullName = str(body.fullName);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const volunteerRole = str(body.volunteerRole);
  const availability = str(body.availability);
  const groupSizeRaw = str(body.groupSize);
  const notes = str(body.notes);

  if (!fullName) errors.fullName = "Please enter your full name.";
  else if (fullName.length < 2 || fullName.length > 100)
    errors.fullName = "Name should be between 2 and 100 characters.";

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email))
    errors.email = "Please enter a valid email address (e.g. name@example.com).";

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15 || !/^[\d\s()+.-]+$/.test(phone))
      errors.phone = "Please enter a valid phone number, or leave it blank.";
  }

  const roles = siteConfig.volunteer.roles.map((r) => r.value);
  if (!volunteerRole) errors.volunteerRole = "Please choose a preferred role.";
  else if (!roles.includes(volunteerRole)) errors.volunteerRole = "Please choose one of the listed roles.";

  const slots = siteConfig.volunteer.availability.map((a) => a.value);
  if (!availability) errors.availability = "Please tell us when you're available.";
  else if (!slots.includes(availability)) errors.availability = "Please choose one of the listed options.";

  let groupSize: number | null = null;
  if (groupSizeRaw) {
    const n = Number(groupSizeRaw);
    if (!Number.isInteger(n) || n < 1 || n > siteConfig.volunteer.maxGroupSize)
      errors.groupSize = `Group size should be a whole number from 1 to ${siteConfig.volunteer.maxGroupSize}.`;
    else groupSize = n;
  }

  if (notes.length > 1000) errors.notes = "Notes should be 1,000 characters or fewer.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      fullName,
      email,
      phone: phone || null,
      volunteerRole,
      availability,
      groupSize,
      notes: notes || null,
    },
  };
}
