import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

/** "Donate Groceries or Supplies" — drop-off is shown as pending until confirmed in config. */
export function GroceryDonationInfo() {
  const { groceries, dropOff } = siteConfig;
  const requested = [...groceries.carousel.map((i) => i.name), ...groceries.additional.map((i) => i.name)];

  return (
    <section id="groceries" aria-labelledby="groceries-heading" className="card-cream p-7 sm:p-10">
      <h2 id="groceries-heading" className="text-2xl font-semibold sm:text-3xl">
        Donate Groceries or Supplies
      </h2>
      <p className="mt-3 max-w-2xl text-bark/75">
        Prefer to donate food instead of money? We&apos;re also collecting nonperishable Thanksgiving groceries and
        packaging supplies.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Requested items">
        {requested.map((name) => (
          <li key={name} className="rounded-full border border-sand bg-white px-3.5 py-1.5 text-sm text-bark/80">
            {name}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 text-[15px]">
          {dropOff.confirmed ? (
            <>
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ember-dark" aria-hidden="true" />
              <p>
                <span className="font-semibold">{dropOff.locationName}</span>
                {dropOff.confirmedDetails && <span className="block text-bark/70">{dropOff.confirmedDetails}</span>}
              </p>
            </>
          ) : (
            <>
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sage-dark" aria-hidden="true" />
              <p>
                <span className="mr-2 inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-sage-dark">
                  Pending
                </span>
                {dropOff.pendingMessage}
                <span className="mt-1 block text-sm text-bark/60">
                  Please hold grocery donations until drop-off details are confirmed here.
                </span>
              </p>
            </>
          )}
        </div>
        <Link
          href="/items"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ember-dark underline-offset-4 hover:underline"
        >
          See the full food list
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
