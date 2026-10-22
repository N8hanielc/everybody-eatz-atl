import type { SVGProps } from "react";

/** A simple maple-style autumn leaf. Inherits color from `currentColor`. */
export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M32 3c1.6 4.4 3.4 7.6 5.6 9.3l3.8-2.7.6 6.4c2.8 1 5.8.7 9.2-.8l-1.7 6.8c2.6 1.4 5.4 1.9 8.5 1.6-2.4 4.4-5.6 7.4-9.6 9l3.4 4c-4.4 1.2-8.6 1.1-12.6-.5l.2 5.5c-2.2-.8-4.2-2.1-5.9-3.8V61h-3V44.8c-1.7 1.7-3.7 3-5.9 3.8l.2-5.5c-4 1.6-8.2 1.7-12.6.5l3.4-4c-4-1.6-7.2-4.6-9.6-9 3.1.3 5.9-.2 8.5-1.6l-1.7-6.8c3.4 1.5 6.4 1.8 9.2.8l.6-6.4 3.8 2.7C28.6 10.6 30.4 7.4 32 3Z" />
    </svg>
  );
}

/** An oval leaf with a vein — used for subtle floating decoration. */
export function SimpleLeaf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M8 40C8 20 20 8 42 6c-1 22-13 34-34 34Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M8 40 34 14" stroke="#F8F3EA" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/** Decorative divider: line — leaf — line. */
export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-sand sm:w-16" />
      <LeafIcon className="h-5 w-5 text-ember" />
      <span className="h-px w-12 bg-sand sm:w-16" />
    </div>
  );
}
