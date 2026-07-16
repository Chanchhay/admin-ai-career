import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="surface-card flex gap-6 p-6">
          <Skeleton className="size-28 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          </div>
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>

      <Skeleton className="h-64 max-w-3xl rounded-xl" />
    </div>
  );
}