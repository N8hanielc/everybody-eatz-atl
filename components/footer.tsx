import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";

export function Footer() {
  const { organization, event, nav } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-sand bg-cream/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-bark/70">{organization.footerMessage}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bark/60">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-bark/80 transition-colors hover:text-ember-dark">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-bark/60">Event</h2>
          <p className="mt-4 text-sm leading-relaxed text-bark/80">
            {event.dateLabel}
            <br />
            {event.timeLabel}
            <br />
            {event.locationName}
          </p>
          {organization.contactEmail && (
            <a
              href={`mailto:${organization.contactEmail}`}
              className="mt-3 inline-block text-sm text-ember-dark underline-offset-4 hover:underline"
            >
              {organization.contactEmail}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-sand">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-bark/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {organization.name}. Give thanks. Give back.
          </p>
          <p>Made with care for our Atlanta neighbors.</p>
        </div>
      </div>
    </footer>
  );
}
