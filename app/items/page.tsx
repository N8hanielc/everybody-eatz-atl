import type { Metadata } from "next";
import Link from "next/link";
import { Info, PackageOpen } from "lucide-react";
import { siteConfig } from "@/config/site";
import { GroceryCarousel } from "@/components/items/grocery-carousel";
import { AdditionalItemsGrid } from "@/components/items/additional-items-grid";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Thanksgiving Meal Essentials",
  description:
    "See what goes into each Everybody Eatz ATL Thanksgiving basket and which groceries the community is being asked to donate.",
};

export default function ItemsPage() {
  const { groceries, dropOff } = siteConfig;

  return (
    <div className="container-page pt-12 sm:pt-16">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">What&apos;s in the basket?</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Thanksgiving Meal Essentials</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark/75">
          We&apos;re collecting the items below to help families prepare a Thanksgiving meal. Every item makes a
          difference!
        </p>
      </Reveal>

      <section aria-label="Basket items" className="mt-10">
        <GroceryCarousel items={groceries.carousel} />
        <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-2 text-center text-sm text-bark/65">
          <Info className="h-4 w-4 shrink-0 text-sage-dark" aria-hidden="true" />
          {groceries.priceNote}
        </p>
      </section>

      <AdditionalItemsGrid items={groceries.additional} />

      <Reveal className="mt-24">
        <aside
          aria-labelledby="grocery-callout-heading"
          className="card-cream mx-auto flex max-w-3xl flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:p-10"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-ember-dark">
            <PackageOpen className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 id="grocery-callout-heading" className="text-2xl font-semibold">
              Have groceries you&apos;d like to donate?
            </h2>
            <p className="mt-2 text-bark/75">Nonperishable food items and packaging supplies are welcome.</p>
            {!dropOff.confirmed && (
              <p className="mt-2 text-sm text-bark/60">Drop-off details are pending confirmation.</p>
            )}
          </div>
          <Link href="/donate#groceries" className="btn-primary shrink-0">
            Donate Items
          </Link>
        </aside>
      </Reveal>
    </div>
  );
}
