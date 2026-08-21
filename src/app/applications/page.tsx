"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, UsersRound } from "lucide-react";
import { Pager } from "@/components/console/Pager";
import { ReviewStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type { CandidateApplicationReviewStatus } from "@/contracts";
import { formatDate, orDash } from "@/lib/format";
import { useGetApplicationsQuery } from "@/services/moderationApi";

const TABS = ["Pending", "In review", "Interviewing", "Approved", "Forwarded", "Rejected"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, CandidateApplicationReviewStatus> = {
  Pending: "PENDING",
  "In review": "IN_REVIEW",
  Interviewing: "HUMAN_INTERVIEW_SCHEDULED",
  Approved: "APPROVED",
  Forwarded: "FORWARDED",
  Rejected: "REJECTED",
};

export default function ApplicationsPage() {
  useSetPageHeading("Applications");

  const [tab, setTab] = useState<Tab>("Pending");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetApplicationsQuery({
    status: tabStatus[tab],
    page,
  });

  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  const applications = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          Candidates reach this queue once their AI interview is done. Approve
          to clear them, schedule a human interview when the AI result is
          borderline, and forward to hand the recruiter the file.
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title="Review queue"
          icon={<UsersRound aria-hidden="true" className="size-5" />}
        />

        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={selectTab}
          className="mb-4 rounded-full bg-ws-card-hover p-1"
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load applications." onRetry={refetch} />
        ) : applications.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            Nothing in {tab.toLowerCase()}.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {applications.map((item) => (
              <li key={item.application.id}>
                <Link
                  href={`/applications/${item.application.id}`}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {orDash(item.candidate?.headline) } ·{" "}
                      {orDash(item.application.jobTitle)}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">
                      Applied {formatDate(item.application.appliedAt)}
                      {item.candidate?.preferredLocation
                        ? ` · ${item.candidate.preferredLocation}`
                        : ""}
                    </span>
                  </span>

                  {item.review ? (
                    <ReviewStatusChip status={item.review.reviewStatus} />
                  ) : null}
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ws-faint"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
    </div>
  );
}
