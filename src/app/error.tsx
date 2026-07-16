"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle aria-hidden="true" className="size-6 text-red-500" />
      </span>

      <h1 className="mt-5 text-lg font-bold text-heading">
        Something went wrong
      </h1>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        An unexpected error occurred while loading this page. You can try again,
        and if it keeps happening, reach out to support.
      </p>

      <Button
        type="button"
        onClick={reset}
        className="mt-6 h-10 bg-brand font-semibold text-white hover:bg-brand-hover"
      >
        Try again
      </Button>
    </div>
  );
}