import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A counter tile. The number carries the emphasis, so the tile itself stays on
 * the neutral card fill rather than picking up a status colour — a wall of
 * tinted boxes would flatten the one thing worth reading.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  /** `undefined` while the query is in flight, rendered as a dash. */
  value: number | undefined;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-ws-line/80 bg-ws-card p-5 shadow-[0_1px_2px_rgba(24,25,28,0.025)] transition-transform duration-200 hover:-translate-y-0.5", className)}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ws-faint">
            {label}
          </p>
          <p className="mt-2 text-[2rem] font-bold tracking-tight tabular-nums text-ws-fg">
            {value === undefined ? "—" : value.toLocaleString()}
          </p>
          {hint ? <p className="mt-1 text-xs text-ws-faint">{hint}</p> : null}
        </div>
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ws-card-hover text-ws-muted">
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}
