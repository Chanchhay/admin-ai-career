/** Strips every non-digit and returns a number, or undefined if empty. */
export function parseNumericInput(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  return Number(digits);
}

/** 80000 -> "80,000". Empty when the value is missing. */
export function formatThousands(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return "";
  return value.toLocaleString("en-US");
}

/** 80000 -> "$80,000" */
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** Removes markdown noise so previews read cleanly. */
export function stripMarkdown(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .trim();
}

/** "2022-08-01" -> "Aug 2022" */
export function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}