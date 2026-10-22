"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { GroceryItem } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { GroceryIllustration } from "@/components/items/grocery-illustration";

/** One product card. Falls back to an illustration if the photo is missing or fails to load. */
export function GroceryItemCard({ item, featured = false }: { item: GroceryItem; featured?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(item.image) && !imageFailed;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-shadow duration-300 ${
        featured ? "border-ember/30 shadow-lift" : "border-sand shadow-soft"
      }`}
    >
      <div className="relative aspect-square w-full bg-cream">
        {showImage ? (
          <Image
            src={item.image as string}
            alt={item.imageAlt ?? item.name}
            fill
            sizes="(min-width: 640px) 300px, 260px"
            className="object-contain p-6"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 p-5">
            <GroceryIllustration kind={item.illustration} label={item.name} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold leading-snug">{item.name}</h3>
          <p className="shrink-0 rounded-full bg-cream px-3 py-1 text-sm font-semibold text-ember-dark">
            {item.price === null ? (
              "Price TBD"
            ) : (
              <>
                <span className="sr-only">Approximate price: </span>~{formatPrice(item.price)}
              </>
            )}
          </p>
        </div>
        {item.description && <p className="mt-2 text-sm leading-relaxed text-bark/70">{item.description}</p>}
        {item.productUrl && (
          <a
            href={item.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-sage-dark underline-offset-4 hover:underline"
          >
            {item.productUrlLabel ?? "View example product"}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
