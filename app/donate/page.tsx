import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getDonationSummary } from "@/lib/donations";
import { DonationProgress } from "@/components/donate/donation-progress";
import { DonationForm } from "@/components/donate/donation-form";
import { VolunteerForm } from "@/components/donate/volunteer-form";
import { GroceryDonationInfo } from "@/components/donate/grocery-donation-info";
import { LeafDivider } from "@/components/decor/leaf";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Donate & Volunteer",
  description:
    "Donate securely to Everybody Eatz ATL's Thanksgiving food drive, sign up to volunteer, or donate groceries and supplies.",
};

// Verified total refreshes at least every minute; the webhook also refreshes it immediately.
export const revalidate = 60;

export default async function DonatePage() {
  const summary = await getDonationSummary();

  return (
    <div className="container-page pt-12 sm:pt-16">
      {/* ───────────── Section A: Monetary donations ───────────── */}
      <section id="donate" aria-labelledby="donate-heading">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Support the Mission</p>
          <h1 id="donate-heading" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Donate &amp; Make an Impact
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-bark/75">
            Your generosity helps us provide Thanksgiving meals to families and individuals in need.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-28">
            <DonationProgress initial={summary} />
          </Reveal>
          <Reveal delay={0.1}>
            <DonationForm />
          </Reveal>
        </div>
      </section>

      <div className="mt-14">
        <Reveal>
          <GroceryDonationInfo />
        </Reveal>
      </div>

      <LeafDivider className="my-20" />

      {/* ───────────── Section B: Volunteer registration ───────────── */}
      <section id="volunteer" aria-labelledby="volunteer-heading">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Give Your Time</p>
          <h2 id="volunteer-heading" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Help Make It Happen
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bark/75">
            Help us assemble food baskets and distribute meals on event day. Every helping hand makes a difference.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Reveal>
            <VolunteerForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-5">
            <div className="card p-6">
              <h3 className="text-lg font-semibold">Event day</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-bark/70">
                {siteConfig.event.dateLabel}
                <br />
                {siteConfig.event.timeLabel}
                <br />
                {siteConfig.event.locationName}
              </p>
            </div>
            <div className="card flex gap-4 p-6">
              <GraduationCap className="mt-0.5 h-6 w-6 shrink-0 text-sage-dark" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold">Student volunteers</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-bark/70">{siteConfig.volunteer.studentNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
