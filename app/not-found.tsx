import Link from "next/link";
import { LeafIcon } from "@/components/decor/leaf";

export default function NotFound() {
  return (
    <div className="container-page flex justify-center pt-16 sm:pt-24">
      <div className="max-w-lg text-center">
        <LeafIcon className="mx-auto h-10 w-10 text-ember" />
        <h1 className="mt-5 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-bark/70">This page may have blown away with the autumn leaves.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/donate" className="btn-secondary">
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
}
