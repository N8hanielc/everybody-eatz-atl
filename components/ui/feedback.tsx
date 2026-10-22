import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

/** Inline spinner for buttons and loading states. */
export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin`} aria-hidden="true" />;
}

/** Full-section loading placeholder. */
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-bark/60">
      <Spinner className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
}

/** Error message box. Announced to screen readers. */
export function ErrorMessage({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-800/20 bg-red-50 p-4 text-sm text-red-900">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5" : ""}>{children}</div>
      </div>
    </div>
  );
}

/** Success confirmation box. */
export function SuccessMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="status" className="flex gap-3 rounded-2xl border border-sage/30 bg-[#EEF0E2] p-5 text-bark">
      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-sage-dark" aria-hidden="true" />
      <div>
        <p className="font-serif text-lg font-semibold">{title}</p>
        {children && <div className="mt-1 text-[15px] leading-relaxed text-bark/75">{children}</div>}
      </div>
    </div>
  );
}
