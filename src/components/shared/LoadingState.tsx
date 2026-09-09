import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  rows?: number;
  className?: string;
};

export function LoadingState({ rows = 3, className }: LoadingStateProps) {
  const rowCount = Math.max(1, rows);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "overflow-hidden rounded-xl border border-ws-line bg-ws-panel",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        className
      )}
    >
      <span className="sr-only">Loading...</span>

      <div className="flex items-center gap-3 border-b border-ws-line px-4 py-3">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3.5 w-40 max-w-[60%] rounded-full" />
          <Skeleton className="h-3 w-64 max-w-[85%] rounded-full" />
        </div>
        <Skeleton className="hidden h-9 w-28 rounded-lg sm:block" />
      </div>

      <div className="grid gap-3 border-b border-ws-line p-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg border border-ws-line bg-ws-card p-3"
          >
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-24 max-w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="divide-y divide-ws-line/70">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1.5fr)_0.8fr_auto] items-center gap-4 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-[min(14rem,80%)] rounded-full" />
                <Skeleton className="h-3 w-[min(11rem,65%)] rounded-full" />
              </div>
            </div>
            <div className="hidden min-w-0 space-y-2 sm:block">
              <Skeleton className="h-3.5 w-24 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="hidden h-7 w-20 rounded-full md:block" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
