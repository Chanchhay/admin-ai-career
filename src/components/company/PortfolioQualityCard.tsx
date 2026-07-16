"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetPortfolioQualityQuery } from "@/redux/api/companyApi";

export function PortfolioQualityCard() {
  const { data, isLoading, isError, refetch } = useGetPortfolioQualityQuery();

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-slate-200/60 bg-white p-5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-5">
        <ErrorState
          message="Portfolio quality is unavailable."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
      />
      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          Live Portfolio Quality
        </p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">{data.score}%</span>
          <span className="text-xs font-semibold text-lime-300">
            +{data.deltaThisWeek}% this week
          </span>
        </p>
        <p className="mt-4 max-w-[85%] text-xs leading-relaxed text-green-50/90">
          {data.message}
        </p>
      </div>
    </section>
  );
}