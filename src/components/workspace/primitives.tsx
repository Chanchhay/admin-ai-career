"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Chip range — small fills only. `solid` is the brand primary, `soft` the
 * secondary surface, `quiet` a step below it, `alert` the one error fill. All
 * flat and fully opaque: no gradients, and no brand tint at low alpha. The
 * brand earns attention at this size; at panel size it shouts, which is what
 * `NoteFill` is for.
 */
export type Tone = "solid" | "soft" | "quiet" | "alert";

/**
 * Note-card fills, kept separate from the chips on purpose: a note card is a
 * big block of colour and must not be the brand green.
 */
export type NoteFill = "warm" | "cool" | "plain";

export const toneFill: Record<Tone, string> = {
  solid: "bg-chip-solid text-chip-solid-fg",
  soft: "bg-chip-soft text-chip-soft-fg",
  quiet: "bg-chip-quiet text-chip-quiet-fg",
  alert: "bg-chip-alert text-chip-alert-fg",
};

/** The note fills, as the custom property the notched panel paints with. */
const noteVar: Record<NoteFill, string> = {
  warm: "[--panel-fill:var(--note-warm)] text-note-warm-fg",
  cool: "[--panel-fill:var(--note-cool)] text-note-cool-fg",
  plain: "[--panel-fill:var(--ws-card)] text-ws-fg",
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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
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
        "rounded-[2rem] p-5",
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
      className={cn(
        "ws-scroll flex items-center gap-1.5 overflow-x-auto",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          aria-pressed={value === tab}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
            value === tab
              ? "bg-ws-panel text-ws-fg"
              : "text-ws-faint hover:text-ws-fg",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/**
 * A panel whose top-right corner is cut away, with the header's round actions
 * living in the cut. The title sits in the short strip beside it; everything
 * else goes in the body below, which runs the panel's full width.
 */
export function NotchedPanel({
  fill = "plain",
  title,
  icon,
  actions,
  className,
  children,
}: {
  /** The card's block of colour; never a brand tone. */
  fill?: NoteFill;
  title: string;
  icon?: ReactNode;
  /** Round controls, rendered on the sheet inside the cut. */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("ws-notch flex flex-col", noteVar[fill], className)}>
      <header className="ws-notch__top flex shrink-0 items-center gap-2 px-5">
        {icon}
        <h2 className="truncate text-[15px] font-semibold tracking-tight">
          {title}
        </h2>
      </header>

      <span aria-hidden="true" className="ws-notch__joint" />

      <div className="ws-notch__body flex-1 px-5 pb-5 pt-3">{children}</div>

      {actions ? <div className="ws-notch__actions">{actions}</div> : null}
    </section>
  );
}

/**
 * Tabs cut from the same sheet as the panel they open: the active one keeps its
 * feet on the card below and fillets into it on both sides, the rest stay flat
 * against the background. Render this directly above the panel it belongs to.
 */
export function FolderTabs<T extends string>({
  tabs,
  value,
  onChange,
  aside,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (tab: T) => void;
  /** Optional trailing note, kept clear of the tabs themselves. */
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-end gap-3">
      {/* The left pad lives on the scroller so the active tab's fillet has room
          inside the scroll box — outside it, overflow would clip it away. */}
      <div className="ws-scroll flex items-end gap-4 overflow-x-auto pl-12 pr-4 pt-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            aria-pressed={value === tab}
            className={cn(
              "shrink-0 px-4 text-[13px] font-semibold transition-colors",
              value === tab
                ? "ws-foldertab pb-3 pt-2.5 text-ws-fg"
                : "rounded-full py-2 text-ws-faint hover:bg-ws-card hover:text-ws-fg",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {aside ? (
        <span className="ml-auto hidden shrink-0 pb-3 pr-2 text-xs text-ws-faint sm:block">
          {aside}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Pipeline bar: filled segments sized by share, with the remainder hatched so
 * an empty queue still reads as a track rather than a broken progress bar.
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
              "flex min-w-fit items-center justify-between gap-3 rounded-full px-5 py-3 text-[13px] font-semibold",
              toneFill[segment.tone],
            )}
          >
            <span className="truncate">{segment.label}</span>
            <span className="tabular-nums opacity-70">{segment.count}</span>
          </div>
        ))}

      <div className="ws-track-rest flex min-w-fit grow items-center justify-end rounded-full px-5 py-3 text-[13px] font-medium text-ws-faint">
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
    "flex size-9 items-center justify-center rounded-full opacity-60 transition-all hover:bg-current/10 hover:opacity-100",
    className,
  );

  return href ? (
    <Link href={href} aria-label={label} className={classes}>
      {children}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={classes}
    >
      {children}
    </button>
  );
}
