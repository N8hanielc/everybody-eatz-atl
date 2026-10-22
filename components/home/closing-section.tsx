import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LeafIcon, SimpleLeaf } from "@/components/decor/leaf";
import { Reveal } from "@/components/reveal";

/** Pumpkin-patch composition used when no closing photo has been added. */
function PumpkinScene() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" role="img" aria-label="Illustration of pumpkins and autumn leaves">
      <rect width="480" height="360" fill="#3A2115" />
      <circle cx="380" cy="80" r="120" fill="#C86B32" opacity="0.12" />
      <path d="M0 300 C 120 270, 360 280, 480 300 V 360 H 0 Z" fill="#2C1A12" />

      {/* large pumpkin */}
      <g transform="translate(140 150)">
        <ellipse cx="100" cy="110" rx="110" ry="78" fill="#C86B32" />
        <ellipse cx="56" cy="110" rx="56" ry="76" fill="#D27A42" />
        <ellipse cx="144" cy="110" rx="56" ry="76" fill="#D27A42" />
        <ellipse cx="100" cy="110" rx="42" ry="78" fill="#C86B32" />
        <path d="M94 40 C 94 22, 100 12, 112 6 L 118 14 C 108 20, 106 30, 106 40 Z" fill="#777A50" />
      </g>
      {/* small pumpkin */}
      <g transform="translate(330 222)">
        <ellipse cx="48" cy="52" rx="56" ry="40" fill="#E5D7C5" />
        <ellipse cx="26" cy="52" rx="28" ry="38" fill="#F1E7D8" />
        <ellipse cx="70" cy="52" rx="28" ry="38" fill="#F1E7D8" />
        <ellipse cx="48" cy="52" rx="20" ry="40" fill="#E5D7C5" />
        <path d="M44 14 C 44 6, 48 0, 56 -3 L 59 3 C 53 6, 51 10, 51 14 Z" fill="#777A50" />
      </g>
      {/* leaves */}
      <g fill="#777A50">
        <path d="M70 300 C 70 266, 96 246, 134 244 C 132 280, 108 300, 70 300 Z" />
      </g>
      <g fill="#A4521F">
        <path d="M60 250 C 52 226, 64 204, 92 194 C 100 222, 88 244, 60 250 Z" />
      </g>
    </svg>
  );
}

export function ClosingSection() {
  const image = siteConfig.closingImage;

  return (
    <section aria-labelledby="closing-heading" className="container-page mt-20 sm:mt-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-3xl bg-cocoa text-ivory shadow-lift md:grid-cols-2">
          <div className="relative min-h-[240px] md:min-h-[380px]">
            {image ? (
              <Image
                src={image}
                alt="Pumpkins and autumn leaves"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0">
                <PumpkinScene />
              </div>
            )}
          </div>

          <div className="relative flex flex-col justify-center px-7 py-12 sm:px-12">
            <LeafIcon className="absolute right-8 top-8 h-8 w-8 text-ember/40" aria-hidden="true" />
            <SimpleLeaf className="absolute bottom-8 right-14 h-6 w-6 text-sage/50" aria-hidden="true" />
            <h2 id="closing-heading" className="text-4xl font-semibold leading-tight text-ivory sm:text-5xl">
              Give Thanks. <span className="italic text-[#E59A63]">Give Back.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/80">
              Small acts of generosity can make a meaningful difference in someone&apos;s holiday.
            </p>
            <div className="mt-8">
              <Link
                href="/donate"
                className="btn bg-ivory text-cocoa shadow-soft hover:-translate-y-0.5 hover:bg-white"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
