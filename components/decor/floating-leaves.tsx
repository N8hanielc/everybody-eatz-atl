"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LeafIcon, SimpleLeaf } from "@/components/decor/leaf";

const leaves = [
  { kind: "maple", className: "left-[6%] top-[8%] h-10 w-10 text-ember/70", delay: 0, drift: 10, rotate: 12 },
  { kind: "simple", className: "right-[10%] top-[4%] h-8 w-8 text-sage/70", delay: 1.2, drift: 8, rotate: -10 },
  { kind: "simple", className: "left-[14%] bottom-[10%] h-7 w-7 text-ember/50", delay: 0.6, drift: 12, rotate: 16 },
  { kind: "maple", className: "right-[4%] bottom-[18%] h-9 w-9 text-sage/60", delay: 1.8, drift: 9, rotate: -14 },
] as const;

/** A few softly drifting leaves. Static when the visitor prefers reduced motion. */
export function FloatingLeaves() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {leaves.map((leaf, i) => {
        const Icon = leaf.kind === "maple" ? LeafIcon : SimpleLeaf;
        return (
          <motion.div
            key={i}
            className={`absolute ${leaf.className}`}
            initial={{ opacity: 0 }}
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: [0, leaf.drift, 0],
                    rotate: [0, leaf.rotate, 0],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    opacity: { duration: 1.2, delay: leaf.delay * 0.3 },
                    y: { duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
                    rotate: { duration: 9 + i, repeat: Infinity, ease: "easeInOut", delay: leaf.delay },
                  }
            }
          >
            <Icon className="h-full w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}
