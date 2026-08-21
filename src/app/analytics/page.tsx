"use client";

import {
  Banknote,
  Building2,
  ClipboardList,
  Gauge,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { NotImplementedNotice } from "@/components/console/NotImplementedNotice";
import { StatTile } from "@/components/console/StatTile";
import { BreakdownBars, TrendBars } from "@/components/console/TrendBars";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { humanizeEnum } from "@/lib/format";
import {
  useGetDashboardAnalyticsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardRevenueQuery,
} from "@/services/adminApi";

export default function AnalyticsPage() {
  useSetPageHeading(
    "Analytics",
    "Platform-wide numbers: accounts, activity, and revenue.",
  );

  return (
    <div className="flex flex-col gap-5">
      <NotImplementedNotice endpoint="GET /api/v1/admin/dashboard/overview" />

      <OverviewSection />
      <TrendsSection />
      <RevenueSection />
    </div>
  );
}

function OverviewSection() {
  const { data, isLoading, isError, refetch } = useGetDashboardOverviewQuery();

  if (isError) {
    return <ErrorState message="Unable to load the overview." onRetry={refetch} />;
  }

  if (isLoading) return <LoadingState rows={4} />;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatTile
        label="Total users"
        value={data?.totalUsers}
        icon={<UsersRound aria-hidden="true" className="size-4" />}
        hint={data ? `+${data.newUsersToday} today` : undefined}
      />
      <StatTile
        label="Total companies"
        value={data?.totalCompanies}
        icon={<Building2 aria-hidden="true" className="size-4" />}
      />
      <StatTile
        label="Total applications"
        value={data?.totalApplications}
        icon={<ClipboardList aria-hidden="true" className="size-4" />}
        hint={data ? `+${data.newApplicationsToday} today` : undefined}
      />
      <StatTile
        label="Total jobs"
        value={data?.totalJobs}
        icon={<Gauge aria-hidden="true" className="size-4" />}
      />
      <StatTile
        label="Pending verifications"
        value={data?.pendingCompanyVerifications}
        hint="Companies waiting on a moderator"
      />
      <StatTile
        label="Pending reviews"
        value={data?.pendingApplicationReviews}
        hint="Applications waiting on a moderator"
      />
    </div>
  );
}

function TrendsSection() {
  const { data, isLoading, isError, refetch } = useGetDashboardAnalyticsQuery();

  return (
    <Panel>
      <PanelHeader
        title="Trends"
        icon={<TrendingUp aria-hidden="true" className="size-5" />}
      />

      {isLoading ? (
        <LoadingState rows={4} />
      ) : isError || !data ? (
        <ErrorState message="Unable to load analytics." onRetry={refetch} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ws-faint">
              User signups
            </p>
            <TrendBars points={data.userSignups} />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ws-faint">
              Applications submitted
            </p>
            <TrendBars points={data.applicationsSubmitted} />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ws-faint">
              Company verifications
            </p>
            <TrendBars points={data.companyVerifications} />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ws-faint">
              Users by role
            </p>
            <BreakdownBars
              items={data.usersByRole.map((entry) => ({
                label: humanizeEnum(entry.role),
                value: entry.count,
              }))}
            />
          </div>
        </div>
      )}
    </Panel>
  );
}

function RevenueSection() {
  const { data, isLoading, isError, refetch } = useGetDashboardRevenueQuery();

  return (
    <Panel>
      <PanelHeader
        title="Revenue"
        icon={<Banknote aria-hidden="true" className="size-5" />}
      />

      {isLoading ? (
        <LoadingState rows={3} />
      ) : isError || !data ? (
        <ErrorState message="Unable to load revenue." onRetry={refetch} />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-[18px] bg-ws-card px-5 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ws-faint">
              {data.periodLabel}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-ws-fg">
              {formatCurrency(data.totalRevenue, data.currency)}
            </p>
          </div>

          <TrendBars
            points={data.revenueByPeriod}
            formatValue={(value) => formatCurrency(value, data.currency)}
          />
        </div>
      )}
    </Panel>
  );
}

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString()} ${currency}`;
  }
}
