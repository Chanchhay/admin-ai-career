"use client";

import Link from "next/link";
import { Check, Mic, Pin } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The workspace's whole accent range. Emphasis comes from weight, not hue:
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
 * The workspace's only container. Borderless by default — separation comes from
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
      {action ? <div className="ml-auto flex items-center gap-1">{action}</div> : null}
    </header>
  );
}

/**
 * Pipeline bar: filled segments sized by share, with the remainder hatched so
 * an empty pipeline still reads as a track rather than a broken progress bar.
 */
export function PipelineTrack({
  segments,
  restLabel,
}: {
  segments: { label: string; count: number; tone: Tone }[];
  restLabel: string;
}) {
  const filled = segments.reduce((sum, segment) => sum + segment.count, 0);
  const total = Math.max(filled, 1);

  return (
    <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
      {segments
        .filter((segment) => segment.count > 0)
        .map((segment) => (
          <div
            key={segment.label}
            style={{ flexGrow: segment.count / total }}
            className={cn(
              "flex min-w-fit items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[13px] font-semibold",
              toneFill[segment.tone],
            )}
          >
            <span className="truncate">{segment.label}</span>
            <span className="tabular-nums opacity-70">{segment.count}</span>
          </div>
        ))}

      <div className="ws-track-rest flex min-w-fit grow items-center justify-end rounded-full px-4 py-2.5 text-[13px] font-medium text-ws-faint">
        {restLabel}
      </div>
    </div>
  );
}

/** Round icon control used in panel headers — a link when given an href. */
export function IconAction({
  label,
  href,
  onClick,
  className,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "flex size-8 items-center justify-center rounded-full opacity-60 transition-all hover:bg-ws-fg/10 hover:opacity-100",
    className,
  );

  return href ? (
    <Link href={href} aria-label={label} className={classes}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {children}
    </button>
  );
}

/** Pill tab strip — the workspace's substitute for a bordered tab bar. */
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
    <div className={cn("ws-scroll flex items-center gap-1.5 overflow-x-auto", className)}>
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

/**
 * A stream entry with its own gutter: the date and a round marker sit outside
 * the card, joined by a hairline, so a list of them reads as one timeline.
 */
export function TimelineRow({
  href,
  date,
  icon,
  iconTone = "soft",
  title,
  meta,
  chip,
  chipTone = "quiet",
  done,
  last,
}: {
  href: string;
  date: string;
  icon: ReactNode;
  iconTone?: Tone;
  title: string;
  meta: string;
  chip?: string;
  chipTone?: Tone;
  done?: boolean;
  /** Suppresses the connector below the marker on the final row. */
  last?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <div className="relative flex w-11 shrink-0 flex-col items-center pt-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            toneFill[iconTone],
          )}
        >
          {done ? <Check aria-hidden="true" className="size-4" /> : icon}
        </span>
        <span className="mt-1.5 text-[10px] font-medium text-ws-faint">{date}</span>
        {last ? null : (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 top-13 mx-auto w-px bg-ws-line"
          />
        )}
      </div>

      <Link
        href={href}
        className="mb-2 flex min-w-0 flex-1 items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-sm font-semibold text-ws-fg", done && "line-through opacity-60")}>
            {title}
          </span>
          <span className="block truncate text-xs text-ws-faint">{meta}</span>
        </span>
        {chip ? (
          <Chip tone={chipTone} className="shrink-0">
            {chip}
          </Chip>
        ) : null}
      </Link>
    </li>
  );
}

/** Document card with a ruled-paper stand-in for the file preview. */
export function FileCard({
  href,
  eyebrow,
  title,
  badge,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  badge?: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[22px] bg-ws-card p-4 transition-colors hover:bg-ws-card-hover"
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-ws-faint">{eyebrow}</p>
          <p className="truncate text-sm font-semibold text-ws-fg">{title}</p>
        </div>
        {badge ? <Chip tone="solid">{badge}</Chip> : null}
        <Pin
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 text-ws-faint opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <div className="mt-3 flex h-28 items-end gap-3 overflow-hidden rounded-2xl bg-ws-panel p-3">
        <span className="shrink-0 text-ws-faint">{icon}</span>
        <span aria-hidden="true" className="ws-paper h-full flex-1 rounded-md opacity-70" />
      </div>
    </Link>
  );
}

/** The composer that closes a stream — visual only until notes are wired up. */
export function NoteBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-ws-card-hover px-4 py-3 text-sm text-ws-faint">
      <Mic aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{placeholder}</span>
    </div>
  );
}
