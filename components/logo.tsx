import Link from "next/link";
import { LeafIcon } from "@/components/decor/leaf";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Everybody Eatz ATL — home"
    >
      <LeafIcon className="h-7 w-7 shrink-0 text-ember transition-transform duration-500 group-hover:rotate-12" />
      <span className="font-serif text-[1.15rem] font-semibold leading-[1.05] tracking-tight text-bark">
        <span className="block">Everybody</span>
        <span className="block">
          Eatz <span className="text-ember">ATL</span>
        </span>
      </span>
    </Link>
  );
}
