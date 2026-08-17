"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarClock,
  Check,
  CircleCheck,
  ChevronRight,
  Eye,
  RotateCw,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import { Pager } from "@/components/console/Pager";
import {
  InterviewStatusChip,
  ResultChip,
  ReviewStatusChip,
} from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type {
  CandidateApplicationListItem,
  CandidateApplicationReviewStatus,
} from "@/contracts";
import { formatDateTime, orDash } from "@/lib/format";
import {
  useGetApplicationQuery,
  useGetApplicationsQuery,
} from "@/services/moderationApi";

const TABS = [
  "All candidates",
  "Pending",
  "In review",
  "Interviewing",
  "Decision pending",
  "Approved",
  "Forwarded",
  "Rejected",
] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, CandidateApplicationReviewStatus> = {
  "All candidates": "PENDING",
  Pending: "PENDING",
  "In review": "IN_REVIEW",
  Interviewing: "HUMAN_INTERVIEW_SCHEDULED",
  "Decision pending": "DECISION_PENDING",
  Approved: "APPROVED",
  Forwarded: "FORWARDED",
  Rejected: "REJECTED",
};

export default function ApplicationsPage() {
  useSetPageHeading("Moderator results");

  const [tab, setTab] = useState<Tab>("All candidates");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetApplicationsQuery({
    status: tab === "All candidates" ? undefined : tabStatus[tab],
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
          <div className="ws-scroll overflow-x-auto">
            <div className="min-w-[1180px]">
              <div className="grid grid-cols-[1.35fr_1.35fr_.6fr_.8fr_1fr_1.15fr_2.2fr] gap-3 px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ws-faint">
                <span>Candidate</span>
                <span>Job</span>
                <span>AI score</span>
                <span>AI result</span>
                <span>Application result</span>
                <span>Human interview</span>
                <span>Actions</span>
              </div>
              <ul className="flex flex-col gap-2">
                {applications.map((item) => (
                  <CandidateReviewRow
                    key={item.application.id}
                    item={item}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
    </div>
  );
}

function CandidateReviewRow({ item }: { item: CandidateApplicationListItem }) {
  const applicationId = item.application.id;
  const { data: detail, isLoading } = useGetApplicationQuery(applicationId);
  const aiFeedback = detail?.aiResult?.feedback;
  const interviews = detail?.humanInterviews ?? [];
  const latestInterview = interviews.at(-1);
  const detailHref = `/applications/${applicationId}`;

  return (
    <li className="grid grid-cols-[1.35fr_1.35fr_.6fr_.8fr_1fr_1.15fr_2.2fr] items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5">
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ws-fg">
          {orDash(item.candidate?.headline)}
        </span>
        <span className="block truncate text-xs text-ws-faint">
          {orDash(item.candidate?.currentPosition)}
        </span>
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ws-fg">
          {orDash(item.application.jobTitle)}
        </span>
        <span className="block truncate text-xs text-ws-faint">
          {formatDateTime(item.application.appliedAt)}
        </span>
      </span>

      <span className="text-sm font-bold tabular-nums text-ws-fg">
        {isLoading ? "…" : (aiFeedback?.overallScore ?? "—")}
      </span>

      <span>{aiFeedback ? <ResultChip result={aiFeedback.result} /> : "—"}</span>

      <span>
        {item.review ? (
          <ReviewStatusChip status={item.review.reviewStatus} />
        ) : (
          "—"
        )}
      </span>

      <span className="min-w-0">
        {latestInterview ? (
          <span className="flex flex-col items-start gap-1">
            <InterviewStatusChip status={latestInterview.status} />
            <span className="max-w-full truncate text-[11px] text-ws-faint">
              {formatDateTime(latestInterview.scheduledAt)}
            </span>
          </span>
        ) : (
          <span className="text-xs text-ws-faint">Not scheduled</span>
        )}
      </span>

      <span className="flex flex-wrap gap-1.5">
        <ActionLink href={detailHref} label="Approve" icon={Check} />
        <ActionLink href={detailHref} label="Reject" icon={X} tone="danger" />
        <ActionLink href={detailHref} label="Forward" icon={Send} />
        {!latestInterview ? (
          <ActionLink
            href={detailHref}
            label="Schedule interview"
            icon={CalendarClock}
          />
        ) : latestInterview.status !== "COMPLETED" &&
          latestInterview.status !== "CANCELLED" ? (
          <>
            <ActionLink href={detailHref} label="Reschedule" icon={RotateCw} />
            <ActionLink href={detailHref} label="Complete" icon={CircleCheck} />
            <ActionLink
              href={detailHref}
              label="Cancel"
              icon={X}
              tone="danger"
            />
          </>
        ) : null}
        <ActionLink href={detailHref} label="View details" icon={Eye} primary />
      </span>
    </li>
  );
}

function ActionLink({
  href,
  label,
  icon: Icon,
  primary,
  tone,
}: {
  href: string;
  label: string;
  icon: typeof ChevronRight;
  primary?: boolean;
  tone?: "danger";
}) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground"
          : tone === "danger"
            ? "inline-flex items-center gap-1 rounded-full bg-chip-alert px-2.5 py-1.5 text-[11px] font-semibold text-chip-alert-fg"
            : "inline-flex items-center gap-1 rounded-full bg-ws-card px-2.5 py-1.5 text-[11px] font-semibold text-ws-muted hover:text-ws-fg"
      }
    >
      <Icon aria-hidden="true" className="size-3" />
      {label}
    </Link>
  );
}
