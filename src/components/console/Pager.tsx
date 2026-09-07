"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Page } from "@/contracts";
import { cn } from "@/lib/utils";

/**
 * Numbered paging over a Spring `Page`.
 *
 * The window is always the same width — first page, last page, and a run
 * around the current one, with an ellipsis where numbers were dropped — so the
 * control does not change size as you walk through a long queue.
 */
export function Pager<T>({
  page,
  onPageChange,
}: {
  page: Pick<Page<T>, "number" | "totalPages" | "totalElements" | "first" | "last">;
  onPageChange: (nextPage: number) => void;
}) {
  if (page.totalElements === 0) return null;

  const totalPages = Math.max(page.totalPages, 1);

  return (
    <div className="flex items-center gap-3">
      <p className="hidden text-xs text-ws-faint sm:block">
        {page.totalElements.toLocaleString()}{" "}
        {page.totalElements === 1 ? "result" : "results"}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Arrow
          label="Previous page"
          disabled={page.first}
          onClick={() => onPageChange(page.number - 1)}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </Arrow>

        <span className="px-2 text-sm tabular-nums sm:hidden">
          {page.number + 1} / {totalPages}
        </span>

        {pageWindow(page.number, totalPages).map((entry, index) =>
          entry === null ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="hidden px-1 text-xs text-ws-faint sm:inline"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page.number ? "page" : undefined}
              aria-label={`Page ${entry + 1}`}
              className={cn(
                "hidden h-9 min-w-9 rounded-md px-2 text-sm font-medium tabular-nums transition-colors sm:inline-block",
                entry === page.number
                  ? "bg-chip-solid text-chip-solid-fg"
                  : "text-ws-muted hover:bg-ws-card hover:text-ws-fg",
              )}
            >
              {entry + 1}
            </button>
          ),
        )}

        <Arrow
          label="Next page"
          disabled={page.last}
          onClick={() => onPageChange(page.number + 1)}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </Arrow>
      </nav>
    </div>
  );
}

/**
 * The page numbers to render, zero-based, with `null` standing for a gap.
 *
 * Seven slots at most: first, last, the current page and one either side, plus
 * up to two ellipses. Short runs are returned whole — an ellipsis that hides a
 * single page is worse than the page it replaced.
 */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index);

  const pages = new Set<number>([0, total - 1, current]);
  if (current - 1 > 0) pages.add(current - 1);
  if (current + 1 < total - 1) pages.add(current + 1);

  // Keep the run the same width wherever it sits, so the control does not
  // shrink at the ends of the range.
  if (current <= 2) [1, 2, 3].forEach((page) => pages.add(page));
  if (current >= total - 3)
    [total - 4, total - 3, total - 2].forEach((page) => pages.add(page));

  const sorted = [...pages].filter((page) => page >= 0 && page < total).sort((a, b) => a - b);

  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? [null, page] : [page],
  );
}

function Arrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-md text-ws-muted transition-colors hover:bg-ws-card hover:text-ws-fg disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
