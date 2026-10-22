import { getDonationSummary } from "@/lib/donations";
import { Hero } from "@/components/home/hero";
import { EventInfo } from "@/components/home/event-info";
import { FundraisingGoal } from "@/components/home/fundraising-goal";
import { PartnerLogos } from "@/components/home/partner-logos";
import { ClosingSection } from "@/components/home/closing-section";

// Refresh the verified total at least once a minute (the Stripe webhook also
// triggers an immediate refresh after each verified donation).
export const revalidate = 60;

export default async function HomePage() {
  const summary = await getDonationSummary();

  return (
    <>
      <Hero />
      <EventInfo />
      <FundraisingGoal summary={summary} />
      <PartnerLogos />
      <ClosingSection />
    </>
  );
}
