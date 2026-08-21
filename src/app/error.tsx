"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/workspace/primitives";

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
    <Panel className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-chip-alert text-chip-alert-fg">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>

      <h1 className="mt-5 text-lg font-bold text-ws-fg">Something went wrong</h1>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ws-faint">
        This screen failed to load. Retrying is safe — nothing is recorded until
        you press one of the decision buttons.
      </p>

      <Button type="button" onClick={reset} className="mt-6">
        Try again
      </Button>
    </Panel>
  );
}
