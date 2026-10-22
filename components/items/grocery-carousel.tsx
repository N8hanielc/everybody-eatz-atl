"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GroceryItem } from "@/config/site";
import { GroceryItemCard } from "@/components/items/grocery-item-card";

const SWIPE_THRESHOLD = 50;

/**
 * Center-focused grocery carousel built with Framer Motion only (no third-party carousel).
 * - Arrow buttons, pagination dots, swipe/drag, and ←/→ keys
 * - Neighbor cards peek in from the sides, smaller and dimmed
 * - Instant transitions when the visitor prefers reduced motion
 */
export function GroceryCarousel({ items }: { items: GroceryItem[] }) {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(280);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const count = items.length;

  // Size cards to the available width so the layout works from phones to desktops.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setCardWidth(Math.round(Math.min(320, Math.max(220, w * 0.66))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((i: number) => setIndex(Math.max(0, Math.min(count - 1, i))), [count]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(count - 1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400) next();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400) prev();
  };

  if (count === 0) return null;

  const spacing = cardWidth * 0.86;
  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.9 };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Thanksgiving grocery items"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ember/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Item {index + 1} of {count}: {items[index]?.name}
      </p>

      <div ref={stageRef} className="relative overflow-hidden py-6">
        <motion.div
          className="relative mx-auto h-[500px] cursor-grab touch-pan-y active:cursor-grabbing sm:h-[540px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
        >
          {items.map((item, i) => {
            const offset = i - index;
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const hidden = distance > 2;

            return (
              <motion.div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${item.name}`}
                aria-hidden={!isActive}
                className="absolute left-1/2 top-0"
                style={{ width: cardWidth, marginLeft: -cardWidth / 2, zIndex: 10 - distance }}
                initial={false}
                animate={{
                  x: offset * spacing,
                  scale: isActive ? 1 : distance === 1 ? 0.84 : 0.72,
                  opacity: hidden ? 0 : isActive ? 1 : distance === 1 ? 0.6 : 0.3,
                }}
                transition={transition}
                onClick={!isActive && !hidden ? () => goTo(i) : undefined}
              >
                {/* Inactive cards are inert: not focusable or clickable inside, but the
                    wrapper can be clicked to bring them to the center. */}
                <div inert={!isActive} className={isActive ? "" : "cursor-pointer select-none"}>
                  <GroceryItemCard item={item} featured={isActive} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous item"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sand bg-white text-bark shadow-soft transition hover:border-ember/50 hover:text-ember-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1" role="group" aria-label="Choose an item">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.name}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-11 w-7 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-ember" : "w-2 bg-bark/25 hover:bg-bark/45"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={index === count - 1}
          aria-label="Next item"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-sand bg-white text-bark shadow-soft transition hover:border-ember/50 hover:text-ember-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-bark/55">Swipe, use the arrows, or press ← / → keys.</p>
    </div>
  );
}
