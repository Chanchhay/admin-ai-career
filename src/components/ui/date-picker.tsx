"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A Material 3 docked date picker, plus M3's time *input* variant beside it.
 *
 * Built rather than borrowed: the console has its own colour and type tokens,
 * so what is taken from M3 is the anatomy and the behaviour — a text field with
 * a calendar trigger, a docked surface holding a month/year header with its own
 * year view, arrow navigation, a weekday row over a seven-column grid, today as
 * an outline and the selection as a filled circle — while the paint comes from
 * this app. The native `datetime-local` control it replaces rendered the
 * operating system's own picker, which matched nothing around it and could not
 * be styled at all.
 *
 * The value stays in `datetime-local` shape (`YYYY-MM-DDTHH:mm`, local time) so
 * callers keep handing it to `toInstant()` exactly as before — 24-hour on the
 * wire whatever the field shows.
 *
 * Days before today are refused rather than merely discouraged: every use of
 * this so far is booking something, and a booking in the past is a mistake in
 * every case, not a choice the reader might have meant.
 */

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

type Parts = { year: number; month: number; day: number; hour: number; minute: number };

function parseValue(value: string): Parts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match;
  return {
    year: Number(y),
    month: Number(mo) - 1,
    day: Number(d),
    hour: Number(h),
    minute: Number(mi),
  };
}

function formatValue({ year, month, day, hour, minute }: Parts) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

/** The cells of the visible month, padded with the days either side of it. */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return { date, outside: date.getMonth() !== month };
  });
}

function sameDay(a: Date, b: { year: number; month: number; day: number }) {
  return (
    a.getFullYear() === b.year && a.getMonth() === b.month && a.getDate() === b.day
  );
}

/** Midnight today, so "today" itself is always still bookable. */
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** 24-hour clock → what the field shows. */
function to12Hour(hour: number) {
  return { hour: hour % 12 === 0 ? 12 : hour % 12, meridiem: hour < 12 ? "AM" : "PM" } as const;
}

/** What the field shows → the 24-hour clock the value is stored in. */
function to24Hour(hour: number, meridiem: "AM" | "PM") {
  return (hour % 12) + (meridiem === "PM" ? 12 : 0);
}

export function DateTimePicker({
  value,
  onChange,
  label,
  id,
  disabled,
}: {
  /** `YYYY-MM-DDTHH:mm` in local time, or `""` for empty. */
  value: string;
  onChange: (value: string) => void;
  label: string;
  id?: string;
  disabled?: boolean;
}) {
  const parts = parseValue(value);
  const today = new Date();
  // Compared by timestamp against each cell, which is also midnight-anchored.
  const floor = startOfToday();

  const [open, setOpen] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [view, setView] = useState(() => ({
    year: parts?.year ?? today.getFullYear(),
    month: parts?.month ?? today.getMonth(),
  }));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const cells = useMemo(() => monthGrid(view.year, view.month), [view]);

  const commit = (next: Partial<Parts>) => {
    const base: Parts = parts ?? {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
      // A sensible working hour beats 00:00, which nobody schedules for.
      hour: 9,
      minute: 0,
    };
    onChange(formatValue({ ...base, ...next }));
  };

  const pickDay = (date: Date) => {
    if (date.getTime() < floor.getTime()) return;
    commit({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate() });
    setOpen(false);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(view.year, view.month + delta, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };

  const display = parts
    ? `${parts.day} ${MONTHS[parts.month].slice(0, 3)} ${parts.year}`
    : "";
  const clock = to12Hour(parts?.hour ?? 9);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ws-muted">{label}</span>

      <div className="flex flex-wrap items-start gap-2">
        {/* The field itself: read-only text plus the trigger, so the calendar
            is the only way to set a date and it cannot be typed into an
            impossible state. */}
        <div ref={containerRef} className="relative">
          <button
            type="button"
            id={id}
            disabled={disabled}
            onClick={() => {
              if (open) {
                setOpen(false);
                return;
              }
              // Reopening on a set value lands on that month, not on wherever
              // the reader last browsed to. Done here rather than in an effect
              // so the state settles before the surface is ever painted.
              if (parts) setView({ year: parts.year, month: parts.month });
              setShowYears(false);
              setOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "flex h-10 w-48 items-center gap-2 rounded-md border px-3 text-left text-sm transition-colors outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
              open ? "border-brand bg-ws-panel" : "border-ws-line bg-ws-panel hover:bg-ws-card",
            )}
          >
            <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-ws-faint" />
            <span className={cn("flex-1 truncate", !display && "text-ws-faint")}>
              {display || "Select date"}
            </span>
          </button>

          {open ? (
            <div
              role="dialog"
              aria-label="Choose a date"
              className="absolute top-full left-0 z-50 mt-2 w-80 rounded-2xl border border-ws-line bg-ws-panel p-3 shadow-(--shadow-dropdown)"
            >
              <div className="mb-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowYears((current) => !current)}
                  aria-expanded={showYears}
                  className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-ws-fg transition-colors hover:bg-ws-card"
                >
                  {MONTHS[view.month]} {view.year}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-4 transition-transform", showYears && "rotate-180")}
                  />
                </button>

                {showYears ? null : (
                  <span className="ml-auto flex items-center gap-1">
                    <IconStep
                      label="Previous month"
                      onClick={() => shiftMonth(-1)}
                      disabled={
                        view.year < floor.getFullYear() ||
                        (view.year === floor.getFullYear() &&
                          view.month <= floor.getMonth())
                      }
                    >
                      <ChevronLeft aria-hidden="true" className="size-4" />
                    </IconStep>
                    <IconStep label="Next month" onClick={() => shiftMonth(1)}>
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </IconStep>
                  </span>
                )}
              </div>

              {showYears ? (
                <div className="ws-scroll grid max-h-64 grid-cols-3 gap-1 overflow-y-auto p-1">
                  {Array.from({ length: 16 }, (_, index) => floor.getFullYear() + index).map(
                    (year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setView((current) => ({ ...current, year }));
                          setShowYears(false);
                        }}
                        className={cn(
                          "rounded-full py-1.5 text-sm tabular-nums transition-colors",
                          year === view.year
                            ? "bg-chip-solid font-semibold text-chip-solid-fg"
                            : "text-ws-muted hover:bg-ws-card hover:text-ws-fg",
                        )}
                      >
                        {year}
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7">
                    {WEEKDAYS.map((day, index) => (
                      <span
                        key={`${day}-${index}`}
                        aria-hidden="true"
                        className="flex h-8 items-center justify-center text-xs text-ws-faint"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7">
                    {cells.map(({ date, outside }) => {
                      const selected = parts ? sameDay(date, parts) : false;
                      const isToday = date.getTime() === floor.getTime();
                      const past = date.getTime() < floor.getTime();

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          disabled={past}
                          onClick={() => pickDay(date)}
                          aria-current={isToday ? "date" : undefined}
                          aria-pressed={selected}
                          aria-disabled={past || undefined}
                          className={cn(
                            "mx-auto flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors",
                            past && "cursor-not-allowed text-ws-faint/40",
                            !past && outside && "text-ws-faint/60 hover:bg-ws-card",
                            !past && !outside && !selected && "text-ws-fg hover:bg-ws-card",
                            // Today is an outline; the selection is the fill.
                            isToday && !selected && "ring-1 ring-brand ring-inset",
                            selected && "bg-chip-solid font-semibold text-chip-solid-fg",
                          )}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex justify-end gap-1 border-t border-ws-line pt-2">
                    <button
                      type="button"
                      onClick={() => pickDay(new Date())}
                      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-2.5 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-ws-card"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* M3's time *input* variant: two fields and a separator with the
            meridiem beside them, rather than a dial nobody wants to drag for a
            09:30 slot. The clock is 12-hour and says which half it means —
            "09:00" alone reads as either one. */}
        <div className="flex items-center gap-1.5">
          <div className="flex h-10 items-center gap-1 rounded-md border border-ws-line bg-ws-panel px-2">
            <TimeField
              label="Hour"
              value={clock.hour}
              min={1}
              max={12}
              disabled={disabled}
              onChange={(hour) => commit({ hour: to24Hour(hour, clock.meridiem) })}
            />
            <span aria-hidden="true" className="text-sm text-ws-faint">
              :
            </span>
            <TimeField
              label="Minute"
              value={parts?.minute ?? 0}
              min={0}
              max={59}
              step={5}
              disabled={disabled}
              onChange={(minute) => commit({ minute })}
            />
          </div>

          <div
            role="group"
            aria-label="AM or PM"
            className="flex h-10 overflow-hidden rounded-md border border-ws-line"
          >
            {(["AM", "PM"] as const).map((meridiem) => (
              <button
                key={meridiem}
                type="button"
                disabled={disabled}
                aria-pressed={clock.meridiem === meridiem}
                onClick={() => commit({ hour: to24Hour(clock.hour, meridiem) })}
                className={cn(
                  "w-10 text-sm font-medium transition-colors disabled:opacity-50",
                  clock.meridiem === meridiem
                    ? "bg-chip-solid text-chip-solid-fg"
                    : "bg-ws-panel text-ws-muted hover:bg-ws-card hover:text-ws-fg",
                )}
              >
                {meridiem}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconStep({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-8 items-center justify-center rounded-full text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** One half of the time input. Wraps rather than clamps on arrow keys. */
function TimeField({
  label,
  value,
  min,
  max,
  step = 1,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={label}
      disabled={disabled}
      value={String(value).padStart(2, "0")}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "").slice(-2);
        if (digits === "") return;
        const next = Number(digits);
        if (next >= min && next <= max) onChange(next);
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        const next = value + (event.key === "ArrowUp" ? step : -step);
        onChange(next > max ? min : next < min ? max : next);
      }}
      className="w-7 bg-transparent text-center text-sm tabular-nums text-ws-fg outline-none disabled:opacity-50"
    />
  );
}
