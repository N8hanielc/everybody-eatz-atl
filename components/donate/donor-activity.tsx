"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { formatCurrency, timeAgo } from "@/lib/format";
import type { PublicDonor } from "@/lib/types";

const ROTATE_MS = 4500;

function donorMessage(donor: PublicDonor) {
  if (!donor.displayName) return "An anonymous supporter donated";
  return donor.amount !== null
    ? `${donor.displayName} donated ${formatCurrency(donor.amount)}`
    : `${donor.displayName} donated`;
}

/**
 * Shows recent VERIFIED donations only — data comes from the webhook-written
 * donations table. Names appear only when the donor opted in; amounts are
 * hidden for anonymous donors. With no donations, shows a quiet invitation.
 */
export function DonorActivity({ donors }: { donors: PublicDonor[] }) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (donors.length <= 1 || reduce) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % donors.length);
      setNow(Date.now());
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [donors.length, reduce]);

  useEffect(() => {
    if (current >= donors.length) setCurrent(0);
  }, [current, donors.length]);

  if (donors.length === 0) {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-bark/60">
        <Heart className="h-4 w-4 text-ember" aria-hidden="true" />
        Be the first to support the mission.
      </p>
    );
  }

  // Reduced motion: show a calm static list instead of a rotating ticker.
  if (reduce) {
    return (
      <ul className="space-y-1.5 text-sm text-bark/75" aria-label="Recent donations">
        {donors.slice(0, 4).map((d) => (
          <li key={d.id} className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
            <span>
              {donorMessage(d)}
              {now !== null && <span className="text-bark/50"> · {timeAgo(d.createdAt, now)}</span>}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  const donor = donors[Math.min(current, donors.length - 1)];

  return (
    <div className="relative h-7 overflow-hidden" aria-label="Recent donations">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={donor.id}
          className="absolute inset-x-0 flex items-center justify-center gap-2 text-sm text-bark/75"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Heart className="h-3.5 w-3.5 shrink-0 text-ember" aria-hidden="true" />
          <span className="truncate">
            {donorMessage(donor)}
            {now !== null && <span className="text-bark/50"> · {timeAgo(donor.createdAt, now)}</span>}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
