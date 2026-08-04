"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSetPageHeading } from "@/components/layout/PageHeader";

/**
 * Declares the page title/description. The shell renders them in the header row
 * beside the search and account controls, so only the action stays in the body.
 */
export function PageIntro({
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  useSetPageHeading(title, description);

  if (!action) return null;

  return <div className="mb-6 flex justify-end">{action}</div>;
}

/** Small capitalised section heading with the brand underline. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-heading">
        {children}
      </h2>
      <span aria-hidden="true" className="mt-2 block h-0.5 w-10 bg-brand" />
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-heading">{value}</p>
      {hint ? <p className="mt-1 text-sm text-body">{hint}</p> : null}
    </div>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-md bg-brand-tint px-2 py-1 text-xs font-semibold text-brand">
      {children}
    </span>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
    >
      {children}
    </Link>
  );
}

/** The main content panel: a white card on the shell's surface. */
export function PlainCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:p-8">
      {children}
    </div>
  );
}
