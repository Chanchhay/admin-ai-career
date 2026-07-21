import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  children: ReactNode;
  className?: string;
};

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
