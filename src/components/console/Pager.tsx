"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Page } from "@/contracts";

/**
 * Previous / next paging over a Spring `Page`. Deliberately not numbered: the
 * queues are worked front to back, and the page count moves as decisions are
 * recorded, so a fixed number strip would go stale between renders.
 */
export function Pager<T>({
  page,
  onPageChange,
}: {
  page: Pick<Page<T>, "number" | "totalPages" | "totalElements" | "first" | "last">;
  onPageChange: (nextPage: number) => void;
}) {
  if (page.totalElements === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-ws-faint">
        Page {page.number + 1} of {Math.max(page.totalPages, 1)} ·{" "}
        {page.totalElements} total
      </p>

      <div className="flex items-center gap-1.5">
        <PagerButton
          label="Previous page"
          disabled={page.first}
          onClick={() => onPageChange(page.number - 1)}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </PagerButton>
        <PagerButton
          label="Next page"
          disabled={page.last}
          onClick={() => onPageChange(page.number + 1)}
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </PagerButton>
      </div>
    </div>
  );
}

function PagerButton({
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
      className="flex size-9 items-center justify-center rounded-full bg-ws-card text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
