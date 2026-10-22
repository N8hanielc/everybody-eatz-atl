import { CalendarDays, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";

type InfoCard = {
  icon: LucideIcon;
  label: string;
  title: string;
  lines: string[];
  link?: { href: string; label: string };
};

export function EventInfo() {
  const { event } = siteConfig;

  const cards: InfoCard[] = [
    {
      icon: CalendarDays,
      label: "Date & Time",
      title: event.dateLabel,
      lines: [event.timeLabel],
    },
    {
      icon: MapPin,
      label: "Location",
      title: event.locationName,
      lines: [event.addressLine1, event.addressLine2],
      link: { href: event.mapsUrl, label: "Get directions" },
    },
    {
      icon: Users,
      label: "Community Impact",
      title: event.impactHeadline,
      lines: [event.impactDetail],
    },
  ];

  return (
    <section aria-labelledby="event-heading" className="container-page">
      <h2 id="event-heading" className="sr-only">
        Event details
      </h2>
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.08}>
            <article className="card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ember-dark">
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-sage-dark">{card.label}</p>
              <h3 className="mt-2 text-xl font-semibold leading-snug">{card.title}</h3>
              {card.lines.map((line) => (
                <p key={line} className="mt-1 text-[15px] leading-relaxed text-bark/70">
                  {line}
                </p>
              ))}
              {card.link && (
                <a
                  href={card.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-ember-dark underline-offset-4 hover:underline"
                >
                  {card.link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
