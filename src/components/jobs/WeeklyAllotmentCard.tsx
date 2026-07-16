"use client";

import { TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetAllotmentQuery } from "@/redux/api/jobApi";

export function WeeklyAllotmentCard() {
  const { data, isLoading, isError, refetch } = useGetAllotmentQuery();

  if (isLoading) {
    return (
      <div className="surface-card space-y-4 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-5">
        <ErrorState
          message="Your weekly allotment is unavailable."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const remaining = Math.max(data.total - data.used, 0);
  const percent = data.total > 0 ? (remaining / data.total) * 100 : 0;

  return (
    <section className="surface-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-heading">Weekly Allotment</h2>
        <TrendingUp aria-hidden="true" className="size-4 text-brand" />
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-heading">
          {remaining}/{data.total}
        </span>
        <span className="text-xs text-slate-500">Remaining listings</span>
      </div>

      <Progress
        value={percent}
        aria-label="Remaining job listings this week"
        className="mt-3 h-1.5 bg-slate-100 [&>div]:bg-brand"
      />

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Your current plan allows for {data.total} high-priority postings per
        week. Posts reset on {data.resetsOn}.
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() => toast(`Upgrade options for the ${data.plan} plan are coming soon.`)}
        className="mt-4 h-9 w-full text-xs font-semibold"
      >
        Upgrade Plan
      </Button>
    </section>
  );
}