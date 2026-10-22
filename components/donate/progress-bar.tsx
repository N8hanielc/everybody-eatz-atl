"use client";

import { motion } from "framer-motion";

/** Accessible, animated progress bar. `percent` is clamped to 0–100. */
export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)}% of goal`}
      className="h-3 w-full overflow-hidden rounded-full bg-sand/70"
    >
      <motion.div
        className="h-full rounded-full bg-ember"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
