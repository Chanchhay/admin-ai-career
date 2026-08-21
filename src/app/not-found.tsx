import Link from "next/link";
import { Compass } from "lucide-react";
import { Panel } from "@/components/workspace/primitives";

export default function NotFound() {
  return (
    <Panel className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-chip-soft text-chip-soft-fg">
        <Compass aria-hidden="true" className="size-6" />
      </span>

      <h1 className="mt-5 text-lg font-bold text-ws-fg">Page not found</h1>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ws-faint">
        This console only covers company verification, candidate review, and
        reference data. Everything else lives in the main app.
      </p>

      {/* `basePath` makes this /admin, the console's own overview. */}
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
      >
        Back to overview
      </Link>
    </Panel>
  );
}
