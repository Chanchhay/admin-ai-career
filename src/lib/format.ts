/**
 * Display helpers for values that arrive as backend enums or ISO instants.
 *
 * Dates are formatted with an explicit locale and time zone: the console runs
 * on the server for the first paint and in the browser afterwards, and letting
 * each pick its own default makes React hydration complain about mismatched
 * text.
 */

const dateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const dateOnly = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/** `2026-03-04T09:30:00Z` → `4 Mar 2026, 09:30 UTC`, or `—` when absent. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return `${dateTime.format(parsed)} UTC`;
}

/** `2026-03-04T09:30:00Z` → `4 Mar 2026`, or `—` when absent. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return dateOnly.format(parsed);
}

/** `HUMAN_INTERVIEW_SCHEDULED` → `Human interview scheduled`. */
export function humanizeEnum(value: string | null | undefined): string {
  if (!value) return "—";
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Falls back to an em dash so empty backend strings do not render as gaps. */
export function orDash(value: string | null | undefined): string {
  return value?.trim() ? value : "—";
}

/**
 * Turns a `datetime-local` input value into the UTC instant the API expects.
 * The input has no zone, so the browser's own offset is what gets applied.
 */
export function toInstant(localValue: string): string {
  return new Date(localValue).toISOString();
}
