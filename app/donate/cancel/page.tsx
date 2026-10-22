import type { Metadata } from "next";
import Link from "next/link";
import { LeafIcon } from "@/components/decor/leaf";

export const metadata: Metadata = {
  title: "Donation Canceled",
  robots: { index: false, follow: false },
};

export default function DonateCancelPage() {
  return (
    <div className="container-page flex justify-center pt-16 sm:pt-24">
      <div className="card w-full max-w-xl p-8 text-center sm:p-12">
        <LeafIcon className="mx-auto h-10 w-10 text-ember" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">No donation was made</h1>
        <p className="mt-4 text-lg leading-relaxed text-bark/75">
          Your checkout was canceled and you haven&apos;t been charged. If something went wrong, you&apos;re welcome
          to try again whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/donate" className="btn-primary">
            Return to Donate
          </Link>
          <Link href="/donate#volunteer" className="btn-secondary">
            Volunteer Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
