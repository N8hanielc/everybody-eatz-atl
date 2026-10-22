import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { FloatingLeaves } from "@/components/decor/floating-leaves";
import { HarvestIllustration } from "@/components/decor/harvest-illustration";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-16 md:grid-cols-[1.1fr_0.9fr] md:pb-24 md:pt-20">
        <Reveal>
          <p className="eyebrow">{siteConfig.organization.tagline}</p>
          <h1
            id="hero-heading"
            className="mt-5 text-[2.6rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]"
          >
            Together We Can Make a <em className="font-medium text-ember">Difference</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark/75">
            Providing families and individuals with holiday meals, because no one should have to worry about
            their next meal.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/donate" className="btn-primary">
              Donate Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/items" className="btn-secondary">
              View Food List
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto w-full max-w-[420px]">
          <FloatingLeaves />
          <HarvestIllustration className="relative h-auto w-full" />
        </Reveal>
      </div>
    </section>
  );
}
