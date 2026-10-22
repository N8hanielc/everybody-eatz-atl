import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatCurrency, progressPercent } from "@/lib/format";
import type { DonationSummary } from "@/lib/types";
import { LeafDivider } from "@/components/decor/leaf";
import { ProgressBar } from "@/components/donate/progress-bar";
import { Reveal } from "@/components/reveal";

/** Homepage goal card. Shows the same verified total as the donate page. */
export function FundraisingGoal({ summary }: { summary: DonationSummary }) {
  const { goal, familiesGoal } = siteConfig.fundraising;
  const percent = progressPercent(summary.totalRaised, goal);

  return (
    <section aria-labelledby="goal-heading" className="container-page mt-20 sm:mt-24">
      <Reveal>
        <div className="card-cream relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="eyebrow">Our Goal</p>
          <h2 id="goal-heading" className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Feed {familiesGoal} Families
          </h2>
          <p className="mt-3 font-serif text-2xl text-ember-dark">{formatCurrency(goal)} Fundraising Goal</p>

          <LeafDivider className="my-7" />

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-bark/75">
            Your generosity helps put Thanksgiving meals on the table for families in our community.
          </p>

          <div className="mx-auto mt-9 max-w-md text-left">
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-bark">{formatCurrency(summary.totalRaised)} raised</span>
              <span className="text-bark/65">{Math.round(percent)}% of {formatCurrency(goal)}</span>
            </div>
            <ProgressBar percent={percent} label="Fundraising progress" />
          </div>

          <Link href="/donate" className="btn-primary mt-10">
            Help Us Reach Our Goal
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
