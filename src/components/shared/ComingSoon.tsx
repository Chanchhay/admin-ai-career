import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ComingSoonProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function ComingSoon({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: ComingSoonProps) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-tint">
        <Icon aria-hidden="true" className="size-6 text-brand" />
      </span>

      <h2 className="mt-5 text-lg font-bold text-heading">{title}</h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            "mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white",
            "transition-colors duration-200 hover:bg-brand-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
          )}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}