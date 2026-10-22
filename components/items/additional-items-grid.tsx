import { Cherry, CookingPot, Drumstick, ShoppingBag, Sprout, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdditionalItem, AdditionalItemIcon } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/reveal";

const ICONS: Record<AdditionalItemIcon, LucideIcon> = {
  drumstick: Drumstick,
  corn: Sprout,
  cranberry: Cherry,
  mac: CookingPot,
  cornbread: Wheat,
  bag: ShoppingBag,
};

export function AdditionalItemsGrid({ items }: { items: AdditionalItem[] }) {
  return (
    <section aria-labelledby="additional-heading" className="mt-24">
      <Reveal>
        <h2 id="additional-heading" className="text-center text-3xl font-semibold sm:text-4xl">
          Additional Items Needed
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-bark/70">
          These round out each basket. Prices will be added as they&apos;re confirmed.
        </p>
      </Reveal>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.id}>
              <Reveal delay={i * 0.05} className="flex flex-col items-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-sand bg-cream text-ember-dark shadow-soft">
                  <Icon className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-sans text-[15px] font-semibold leading-snug">{item.name}</h3>
                <p className="mt-1 text-sm text-bark/60">{formatPrice(item.price)}</p>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
