"use client";

import { Select } from "@/components/ui/select";
import { PAGE_SIZES } from "@/services/moderationApi";

const OPTIONS = PAGE_SIZES.map((size) => ({ value: size, label: String(size) }));

/** Rows per page, for the footer of a paged table. */
export function PageSizeSelect({
  value,
  onChange,
  id = "page-size",
}: {
  value: number;
  /** Changing the size invalidates the current offset, so callers reset the page. */
  onChange: (size: number) => void;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-xs whitespace-nowrap text-ws-faint">
        Rows per page
      </label>
      <Select id={id} value={value} onChange={onChange} options={OPTIONS} />
    </div>
  );
}
