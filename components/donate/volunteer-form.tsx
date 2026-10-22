"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ErrorMessage, Spinner, SuccessMessage } from "@/components/ui/feedback";

type Fields = {
  fullName: string;
  email: string;
  phone: string;
  volunteerRole: string;
  availability: string;
  groupSize: string;
  notes: string;
};

const EMPTY: Fields = {
  fullName: "",
  email: "",
  phone: "",
  volunteerRole: "",
  availability: "",
  groupSize: "",
  notes: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.fullName.trim()) e.fullName = "Please enter your full name.";
  else if (f.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!f.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(f.email.trim())) e.email = "Please enter a valid email address (e.g. name@example.com).";
  if (f.phone.trim()) {
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) e.phone = "Please enter a valid phone number, or leave it blank.";
  }
  if (!f.volunteerRole) e.volunteerRole = "Please choose a preferred role.";
  if (!f.availability) e.availability = "Please tell us when you're available.";
  if (f.groupSize.trim()) {
    const n = Number(f.groupSize);
    if (!Number.isInteger(n) || n < 1 || n > siteConfig.volunteer.maxGroupSize)
      e.groupSize = `Enter a whole number from 1 to ${siteConfig.volunteer.maxGroupSize}.`;
  }
  if (f.notes.length > 1000) e.notes = "Notes should be 1,000 characters or fewer.";
  return e;
}

export function VolunteerForm() {
  const ids = useId();
  const { roles, availability, maxGroupSize } = siteConfig.volunteer;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef<number>(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`${ids}-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Partial<Record<keyof Fields, string>>;
      };
      if (!res.ok || !data.ok) {
        setErrors(data.fieldErrors ?? {});
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
      setFields(EMPTY);
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="outline-none">
        <SuccessMessage title="You're signed up — thank you!">
          Thank you for volunteering with Everybody Eatz ATL! We&apos;ll follow up with you using the contact
          information you provided.
        </SuccessMessage>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
          }}
          className="mt-4 text-sm font-semibold text-ember-dark underline-offset-4 hover:underline"
        >
          Register another volunteer
        </button>
      </div>
    );
  }

  const errorId = (key: keyof Fields) => `${ids}-${key}-error`;
  const describe = (key: keyof Fields, hint?: string) =>
    errors[key] ? errorId(key) : hint ? `${ids}-${key}-hint` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="card relative p-6 sm:p-9">
      {/* Honeypot: hidden from people and screen readers; bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${ids}-website`}>Website</label>
        <input
          id={`${ids}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <p className="text-sm text-bark/60">
        Fields marked <span className="text-ember-dark">*</span> are required.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${ids}-fullName`} className="field-label">
            Full Name <span className="text-ember-dark">*</span>
          </label>
          <input
            id={`${ids}-fullName`}
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            value={fields.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describe("fullName")}
            className="field-input"
          />
          {errors.fullName && (
            <p id={errorId("fullName")} className="field-error">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-email`} className="field-label">
            Email Address <span className="text-ember-dark">*</span>
          </label>
          <input
            id={`${ids}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            value={fields.email}
            onChange={(e) => set("email")(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            className="field-input"
          />
          {errors.email && (
            <p id={errorId("email")} className="field-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-phone`} className="field-label">
            Phone Number <span className="font-normal text-bark/55">(optional)</span>
          </label>
          <input
            id={`${ids}-phone`}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={30}
            value={fields.phone}
            onChange={(e) => set("phone")(e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describe("phone")}
            className="field-input"
          />
          {errors.phone && (
            <p id={errorId("phone")} className="field-error">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-volunteerRole`} className="field-label">
            Preferred Volunteer Role <span className="text-ember-dark">*</span>
          </label>
          <div className="relative">
          <select
            id={`${ids}-volunteerRole`}
            required
            value={fields.volunteerRole}
            onChange={(e) => set("volunteerRole")(e.target.value)}
            aria-invalid={Boolean(errors.volunteerRole)}
            aria-describedby={describe("volunteerRole")}
            className="field-input appearance-none pr-10"
          >
            <option value="">Select a role…</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-bark/60" aria-hidden="true" />
          </div>
          {errors.volunteerRole && (
            <p id={errorId("volunteerRole")} className="field-error">
              {errors.volunteerRole}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${ids}-availability`} className="field-label">
            Availability <span className="text-ember-dark">*</span>
          </label>
          <div className="relative">
          <select
            id={`${ids}-availability`}
            required
            value={fields.availability}
            onChange={(e) => set("availability")(e.target.value)}
            aria-invalid={Boolean(errors.availability)}
            aria-describedby={describe("availability")}
            className="field-input appearance-none pr-10"
          >
            <option value="">Select availability…</option>
            {availability.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-bark/60" aria-hidden="true" />
          </div>
          {errors.availability && (
            <p id={errorId("availability")} className="field-error">
              {errors.availability}
            </p>
          )}
        </div>

        <div className="sm:col-span-2 sm:max-w-xs">
          <label htmlFor={`${ids}-groupSize`} className="field-label">
            Number of volunteers <span className="font-normal text-bark/55">(optional)</span>
          </label>
          <input
            id={`${ids}-groupSize`}
            type="number"
            inputMode="numeric"
            min={1}
            max={maxGroupSize}
            step={1}
            value={fields.groupSize}
            onChange={(e) => set("groupSize")(e.target.value)}
            aria-invalid={Boolean(errors.groupSize)}
            aria-describedby={describe("groupSize", "hint")}
            className="field-input"
          />
          {errors.groupSize ? (
            <p id={errorId("groupSize")} className="field-error">
              {errors.groupSize}
            </p>
          ) : (
            <p id={`${ids}-groupSize-hint`} className="field-hint">
              Registering a group? Include yourself in the count.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${ids}-notes`} className="field-label">
            Additional Notes <span className="font-normal text-bark/55">(optional)</span>
          </label>
          <textarea
            id={`${ids}-notes`}
            rows={4}
            maxLength={1000}
            value={fields.notes}
            onChange={(e) => set("notes")(e.target.value)}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describe("notes")}
            className="field-input resize-y"
            placeholder="Anything we should know — skills, accessibility needs, service-hour questions…"
          />
          {errors.notes && (
            <p id={errorId("notes")} className="field-error">
              {errors.notes}
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="mt-6">
          <ErrorMessage>{serverError}</ErrorMessage>
        </div>
      )}

      <button type="submit" className="btn-primary mt-8 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Spinner /> Sending…
          </>
        ) : (
          "Sign Up to Volunteer"
        )}
      </button>
      <p className="mt-4 text-xs text-bark/55">
        Your details are only shared with the event organizers and are never shown publicly.
      </p>
    </form>
  );
}
