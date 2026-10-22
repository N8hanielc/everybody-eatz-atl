"use client";

import { useId, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/lib/format";
import type { DonorDisplayPreference } from "@/lib/types";
import { ErrorMessage, Spinner } from "@/components/ui/feedback";

type Choice = number | "custom";

/**
 * Donation amount picker + public-display preference.
 * Submits to /api/donations, which validates on the server and returns a
 * Stripe Checkout URL. Nothing is counted until Stripe's webhook confirms payment.
 */
export function DonationForm() {
  const { options, minAmount, maxAmount, taxDeductibleConfirmed } = siteConfig.fundraising;
  const ids = useId();

  const [choice, setChoice] = useState<Choice>(options[1]?.amount ?? options[0]?.amount ?? "custom");
  const [customAmount, setCustomAmount] = useState("");
  const [display, setDisplay] = useState<DonorDisplayPreference>("anonymous");
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const amount = choice === "custom" ? Number(customAmount) : choice;
  const amountIsValid = Number.isFinite(amount) && amount >= minAmount && amount <= maxAmount;

  function validate() {
    const errors: Record<string, string> = {};
    if (choice === "custom") {
      if (!customAmount.trim()) errors.amount = "Please enter an amount.";
      else if (!Number.isFinite(amount)) errors.amount = "Please enter a number, like 25.";
      else if (amount < minAmount) errors.amount = `The minimum donation is ${formatCurrency(minAmount)}.`;
      else if (amount > maxAmount)
        errors.amount = `For gifts over ${formatCurrency(maxAmount)}, please contact the organizers.`;
      else if (Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-6)
        errors.amount = "Please use no more than two decimal places.";
    }
    if (display === "name") {
      if (!firstName.trim()) errors.firstName = "Please enter your first name, or choose Anonymous.";
      if (lastInitial.trim() && !/^\p{L}$/u.test(lastInitial.trim()))
        errors.lastInitial = "Use a single letter.";
    }
    return errors;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          displayPreference: display,
          firstName: display === "name" ? firstName : "",
          lastInitial: display === "name" ? lastInitial : "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!res.ok || !data.url) {
        setFieldErrors(data.fieldErrors ?? {});
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Hand off to Stripe's secure hosted checkout page.
      window.location.assign(data.url);
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-9" aria-describedby={`${ids}-secure`}>
      <fieldset>
        <legend className="font-serif text-2xl font-semibold">Choose an amount</legend>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((opt) => {
            const selected = choice === opt.amount;
            return (
              <label
                key={opt.amount}
                className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-ember/40 ${
                  selected ? "border-ember bg-cream shadow-soft" : "border-sand bg-white hover:border-ember/40"
                }`}
              >
                <input
                  type="radio"
                  name="amount"
                  value={opt.amount}
                  checked={selected}
                  onChange={() => setChoice(opt.amount)}
                  className="sr-only"
                />
                <span className="font-serif text-2xl font-semibold">{opt.label}</span>
                <span className="mt-1 text-[13px] leading-snug text-bark/65">{opt.description}</span>
              </label>
            );
          })}
          <label
            className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-ember/40 ${
              choice === "custom" ? "border-ember bg-cream shadow-soft" : "border-sand bg-white hover:border-ember/40"
            }`}
          >
            <input
              type="radio"
              name="amount"
              value="custom"
              checked={choice === "custom"}
              onChange={() => setChoice("custom")}
              className="sr-only"
            />
            <span className="font-serif text-2xl font-semibold">Custom</span>
            <span className="mt-1 text-[13px] leading-snug text-bark/65">Give any amount you&apos;d like.</span>
          </label>
        </div>

        {choice === "custom" && (
          <div className="mt-5 max-w-xs">
            <label htmlFor={`${ids}-custom`} className="field-label">
              Custom amount ({siteConfig.fundraising.currency.toUpperCase()})
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-bark/60">$</span>
              <input
                id={`${ids}-custom`}
                type="number"
                inputMode="decimal"
                min={minAmount}
                max={maxAmount}
                step="0.01"
                placeholder="25"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={fieldErrors.amount ? `${ids}-amount-error` : `${ids}-amount-hint`}
                className="field-input pl-8"
                autoFocus
              />
            </div>
            {fieldErrors.amount ? (
              <p id={`${ids}-amount-error`} className="field-error">
                {fieldErrors.amount}
              </p>
            ) : (
              <p id={`${ids}-amount-hint`} className="field-hint">
                {formatCurrency(minAmount)} – {formatCurrency(maxAmount)}
              </p>
            )}
          </div>
        )}
        {choice !== "custom" && fieldErrors.amount && <p className="field-error">{fieldErrors.amount}</p>}
        <p className="mt-4 text-xs text-bark/55">
          Descriptions are examples of how gifts help; they aren&apos;t exact quantities.
        </p>
      </fieldset>

      <fieldset className="mt-9">
        <legend className="font-serif text-xl font-semibold">How should we show your gift?</legend>
        <p className="mt-1 text-sm text-bark/65">
          Recent donations appear on this page. We never show emails, full names, or payment details.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: "name", label: "Display my first name and last initial" },
              { value: "anonymous", label: "Display as Anonymous" },
            ] as { value: DonorDisplayPreference; label: string }[]
          ).map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-[15px] transition ${
                display === opt.value ? "border-ember bg-cream" : "border-sand bg-white hover:border-ember/40"
              }`}
            >
              <input
                type="radio"
                name="display"
                value={opt.value}
                checked={display === opt.value}
                onChange={() => setDisplay(opt.value)}
                className="h-4 w-4 accent-[#C86B32]"
              />
              {opt.label}
            </label>
          ))}
        </div>

        {display === "name" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_140px]">
            <div>
              <label htmlFor={`${ids}-first`} className="field-label">
                First name
              </label>
              <input
                id={`${ids}-first`}
                type="text"
                autoComplete="given-name"
                maxLength={30}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-invalid={Boolean(fieldErrors.firstName)}
                aria-describedby={fieldErrors.firstName ? `${ids}-first-error` : undefined}
                className="field-input"
              />
              {fieldErrors.firstName && (
                <p id={`${ids}-first-error`} className="field-error">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${ids}-initial`} className="field-label">
                Last initial
              </label>
              <input
                id={`${ids}-initial`}
                type="text"
                autoComplete="off"
                maxLength={1}
                value={lastInitial}
                onChange={(e) => setLastInitial(e.target.value)}
                aria-invalid={Boolean(fieldErrors.lastInitial)}
                aria-describedby={fieldErrors.lastInitial ? `${ids}-initial-error` : undefined}
                className="field-input uppercase"
              />
              {fieldErrors.lastInitial && (
                <p id={`${ids}-initial-error`} className="field-error">
                  {fieldErrors.lastInitial}
                </p>
              )}
            </div>
          </div>
        )}
      </fieldset>

      {error && (
        <div className="mt-6">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-[220px]" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner /> Redirecting to secure checkout…
            </>
          ) : (
            <>Donate Now{amountIsValid ? ` · ${formatCurrency(amount)}` : ""}</>
          )}
        </button>
        <p id={`${ids}-secure`} className="flex items-center gap-2 text-sm text-bark/60">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Secure payment processed by Stripe.
        </p>
      </div>

      {!taxDeductibleConfirmed && (
        <p className="mt-5 text-xs leading-relaxed text-bark/55">
          Please note: tax-deductibility of donations has not been confirmed. Consult your tax advisor.
        </p>
      )}
    </form>
  );
}
