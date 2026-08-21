"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The console's whole accent range. Emphasis comes from weight, not hue:
 * `solid` is the brand green, `soft` its tint, `quiet` a neutral. `alert` is
 * the one non-brand fill and exists only so a rejection reads as one.
 */
export type Tone = "solid" | "soft" | "quiet" | "alert";

const toneFill: Record<Tone, string> = {
  solid: "bg-chip-solid text-chip-solid-fg",
  soft: "bg-chip-soft text-chip-soft-fg",
  quiet: "bg-chip-quiet text-chip-quiet-fg",
  alert: "bg-chip-alert text-chip-alert-fg",
};

export function Chip({
  tone = "soft",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        toneFill[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A quiet pill for metadata that should not compete with the brand fills. */
export function GhostChip({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-ws-card px-2.5 py-1 text-xs font-medium text-ws-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The console's only container. Borderless by default — separation comes from
 * the fill and the radius, never from a rule.
 */
export function Panel({
  tone,
  className,
  children,
}: {
  /** A tinted panel lifts a block out of the stack; omit for the card fill. */
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-ws-line/80 p-5 shadow-[0_1px_2px_rgba(24,25,28,0.025)]",
        tone ? toneFill[tone] : "bg-ws-card text-ws-fg",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  icon,
  action,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-4 flex items-center gap-2">
      {icon}
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      {action ? (
        <div className="ml-auto flex items-center gap-1">{action}</div>
      ) : null}
    </header>
  );
}

/** Pill tab strip — the console's substitute for a bordered tab bar. */
export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("ws-scroll flex items-center gap-1.5 overflow-x-auto", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          aria-pressed={value === tab}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold transition-all",
            value === tab
              ? "bg-ws-panel text-ws-fg shadow-sm"
              : "text-ws-faint hover:bg-ws-panel/60 hover:text-ws-fg",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
