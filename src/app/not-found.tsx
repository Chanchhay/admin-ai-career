import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-tint">
        <Compass aria-hidden="true" className="size-6 text-brand" />
      </span>

      <h1 className="mt-5 text-lg font-bold text-heading">Page not found</h1>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>

      <Link
        href="/"
        className={cn(
          "mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white",
          "transition-colors duration-200 hover:bg-brand-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
        )}
      >
        Back to dashboard
      </Link>
    </div>
  );
}