"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorMessage } from "@/components/ui/feedback";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex justify-center pt-16 sm:pt-24">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <div className="mt-6 text-left">
          <ErrorMessage>We couldn&apos;t load this page. Please try again in a moment.</ErrorMessage>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
