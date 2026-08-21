"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Building2, ChevronRight, UsersRound } from "lucide-react";
import { DecisionRing } from "@/components/console/DecisionRing";
import { CompanyStatusChip, ReviewStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { orDash } from "@/lib/format";
import { useGetApplicationsQuery, useGetCompaniesQuery } from "@/services/moderationApi";

/** One row, one query — `totalElements` is the count, nothing is fetched twice. */
const countOnly = { page: 0, size: 1 } as const;
/** A handful of the most recent decisions, newest first. */
const recentList = { page: 0, size: 6, sort: "id,desc" } as const;

export default function DecisionsPage() {
  useSetPageHeading(
    "Decisions",
    "How moderator calls have landed across companies and candidates.",
  );

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          A running read of every verification and review decision recorded
          so far: the approve/reject split, and who landed on each side of
          it.
        </p>
      </Panel>

      <CompanyDecisions />
      <ApplicationDecisions />
    </div>
  );
}

/* ------------------------------------------------------------ companies --- */

function CompanyDecisions() {
  const approvedCount = useGetCompaniesQuery({
    verificationStatus: "APPROVED",
    ...countOnly,
  });
  const rejectedCount = useGetCompaniesQuery({
    verificationStatus: "REJECTED",
    ...countOnly,
  });
  const pendingCount = useGetCompaniesQuery({
    verificationStatus: "PENDING_VERIFICATION",
    ...countOnly,
  });

  const approvedList = useGetCompaniesQuery({
    verificationStatus: "APPROVED",
    ...recentList,
  });
  const rejectedList = useGetCompaniesQuery({
    verificationStatus: "REJECTED",
    ...recentList,
  });

  const approved = approvedCount.data?.totalElements;
  const rejected = rejectedCount.data?.totalElements;

  return (
    <Panel>
      <PanelHeader
        title="Company verification"
        icon={<Building2 aria-hidden="true" className="size-5" />}
      />

      <DecisionSummary
        approved={approved}
        rejected={rejected}
        thirdLabel="Still pending"
        thirdValue={pendingCount.data?.totalElements}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DecisionList
          title="Recently approved"
          query={approvedList}
          empty="No companies approved yet."
          renderItems={(companies) =>
            companies.map((company) => ({
              id: company.id,
              href: `/companies/${company.id}`,
              title: company.name,
              subtitle: orDash(company.industryName),
              chip: <CompanyStatusChip status={company.verificationStatus} />,
            }))
          }
        />
        <DecisionList
          title="Recently rejected"
          query={rejectedList}
          empty="No companies rejected yet."
          renderItems={(companies) =>
            companies.map((company) => ({
              id: company.id,
              href: `/companies/${company.id}`,
              title: company.name,
              subtitle: orDash(company.industryName),
              chip: <CompanyStatusChip status={company.verificationStatus} />,
            }))
          }
        />
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------- applications --- */

function ApplicationDecisions() {
  const approvedCount = useGetApplicationsQuery({
    status: "APPROVED",
    ...countOnly,
  });
  const rejectedCount = useGetApplicationsQuery({
    status: "REJECTED",
    ...countOnly,
  });
  const forwardedCount = useGetApplicationsQuery({
    status: "FORWARDED",
    ...countOnly,
  });

  const approvedList = useGetApplicationsQuery({
    status: "APPROVED",
    ...recentList,
  });
  const rejectedList = useGetApplicationsQuery({
    status: "REJECTED",
    ...recentList,
  });

  const approved = approvedCount.data?.totalElements;
  const rejected = rejectedCount.data?.totalElements;

  return (
    <Panel>
      <PanelHeader
        title="Candidate applications"
        icon={<UsersRound aria-hidden="true" className="size-5" />}
      />

      <DecisionSummary
        approved={approved}
        rejected={rejected}
        thirdLabel="Forwarded"
        thirdValue={forwardedCount.data?.totalElements}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <DecisionList
          title="Recently approved"
          query={approvedList}
          empty="No applications approved yet."
          renderItems={(items) =>
            items.map((item) => ({
              id: item.application.id,
              href: `/applications/${item.application.id}`,
              title: orDash(item.candidate?.headline),
              subtitle: orDash(item.application.jobTitle),
              chip: item.review ? (
                <ReviewStatusChip status={item.review.reviewStatus} />
              ) : null,
            }))
          }
        />
        <DecisionList
          title="Recently rejected"
          query={rejectedList}
          empty="No applications rejected yet."
          renderItems={(items) =>
            items.map((item) => ({
              id: item.application.id,
              href: `/applications/${item.application.id}`,
              title: orDash(item.candidate?.headline),
              subtitle: orDash(item.application.jobTitle),
              chip: item.review ? (
                <ReviewStatusChip status={item.review.reviewStatus} />
              ) : null,
            }))
          }
        />
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------- pieces --- */

function DecisionSummary({
  approved,
  rejected,
  thirdLabel,
  thirdValue,
}: {
  approved: number | undefined;
  rejected: number | undefined;
  thirdLabel: string;
  thirdValue: number | undefined;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <DecisionRing approved={approved ?? 0} rejected={rejected ?? 0} />

      <div className="grid flex-1 grid-cols-3 gap-3">
        <Metric label="Approved" value={approved} tone="text-primary" />
        <Metric label="Rejected" value={rejected} tone="text-[var(--error)]" />
        <Metric label={thirdLabel} value={thirdValue} tone="text-ws-muted" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | undefined;
  tone: string;
}) {
  return (
    <div className="rounded-[18px] bg-ws-card px-4 py-3">
      <p className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-ws-faint">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${tone}`}>
        {value === undefined ? "—" : value.toLocaleString()}
      </p>
    </div>
  );
}

type DecisionListRow = {
  id: number;
  href: string;
  title: string;
  subtitle: string;
  chip: ReactNode;
};

/**
 * Wraps any RTK Query result that has `content`, `isLoading`, and `isError` —
 * the two callers just supply `renderItems`, everything else is shared so the
 * loading/empty/error states can't drift between the two panels.
 */
function DecisionList<T>({
  title,
  query,
  renderItems,
  empty,
}: {
  title: string;
  query: {
    data?: { content: T[] };
    isLoading: boolean;
    isError: boolean;
  };
  renderItems: (items: T[]) => DecisionListRow[];
  empty: string;
}) {
  const rows = query.data ? renderItems(query.data.content) : [];

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ws-faint">
        {title}
      </p>

      {query.isLoading ? (
        <LoadingState rows={3} />
      ) : query.isError ? (
        <ErrorState message="Unable to load." />
      ) : rows.length === 0 ? (
        <p className="rounded-[18px] bg-ws-card-hover px-4 py-6 text-center text-xs text-ws-faint">
          {empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="flex items-center gap-3 rounded-[14px] bg-ws-card-hover px-3.5 py-2.5 transition-colors hover:bg-ws-panel"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ws-fg">
                    {row.title}
                  </span>
                  <span className="block truncate text-xs text-ws-faint">
                    {row.subtitle}
                  </span>
                </span>
                {row.chip}
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-ws-faint"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
