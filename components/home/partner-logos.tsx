import Image from "next/image";
import { Plus } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";

/**
 * Partner tiles. To add an official logo, drop the file into
 * /public/images/partners/ and set `logo` in config/site.ts, e.g.
 *   { name: "314+", logo: "/images/partners/314-plus.svg" }
 * Until then, the partner name is shown as clean text — never a made-up logo.
 */
export function PartnerLogos() {
  const { partners, showAdditionalPartnersTile } = siteConfig;

  return (
    <section aria-labelledby="partners-heading" className="container-page mt-20 sm:mt-24">
      <Reveal>
        <h2 id="partners-heading" className="text-center text-3xl font-semibold sm:text-4xl">
          In Partnership With
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {partners.map((partner) => {
            const tile = (
              <div className="flex h-28 items-center justify-center rounded-2xl border border-sand bg-white/60 px-6 text-center transition-colors hover:border-ember/40">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={180}
                    height={64}
                    className="max-h-16 w-auto object-contain"
                  />
                ) : (
                  <span className="font-serif text-xl font-semibold text-bark/85">{partner.name}</span>
                )}
              </div>
            );
            return (
              <li key={partner.name}>
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </li>
            );
          })}
          {showAdditionalPartnersTile && (
            <li>
              <div className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-sand px-6 text-center">
                <Plus className="h-4 w-4 text-sage-dark" aria-hidden="true" />
                <span className="text-sm font-medium text-bark/65">Additional community partners</span>
              </div>
            </li>
          )}
        </ul>
      </Reveal>
    </section>
  );
}
