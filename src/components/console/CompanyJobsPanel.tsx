"use client";

import Link from "next/link";
import { useState } from "react";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Chip, Panel, PanelHeader, type Tone } from "@/components/workspace/primitives";
import type { JobStatus, ModeratorJobListItem } from "@/contracts";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import { useGetCompanyJobsQuery } from "@/services/moderationApi";

/**
 * The company's jobs — a list, and nothing more.
 *
 * Taking a posting down is not a thing to do in passing while scanning a list:
 * it needs the job in front of you and a note explaining it, so the actions
 * live on the job's own page and this only gets you there.
 */

export const jobTone: Record<JobStatus, Tone> = {
  DRAFT: "quiet",
  PENDING: "soft",
  APPROVED: "soft",
  REJECTED: "alert",
  PUBLISHED: "solid",
  PAUSED: "soft",
  CLOSED: "quiet",
  EXPIRED: "quiet",
};

export function CompanyJobsPanel({ companyId }: { companyId: string }) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, isError, refetch } = useGetCompanyJobsQuery({
    companyId,
    page,
    size,
  });

  const jobs = data?.content ?? [];

  return (
    <Panel variant="outlined" className="p-0">
      <div className="px-5 pt-5">
        <PanelHeader
          title={`Jobs (${data?.totalElements ?? 0})`}
          icon={<BriefcaseBusiness aria-hidden="true" className="size-4" />}
        />
      </div>

      {isLoading ? (
        <div className="px-5 pb-5">
          <LoadingState rows={3} />
        </div>
      ) : isError ? (
        /* Never the empty state: "no jobs posted" and "the request failed" are
           different facts, and showing the first when the second happened
           sends the reader looking for a problem at the company. */
        <div className="px-5 pb-5">
          <ErrorState
            message="Unable to load this company's jobs."
            onRetry={refetch}
          />
        </div>
      ) : jobs.length === 0 ? (
        <p className="px-5 pb-6 text-sm text-ws-faint">
          This company has not posted a job yet.
        </p>
      ) : (
        <ul className="border-t border-ws-line">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} companyId={companyId} />
          ))}
        </ul>
      )}

      {data && data.totalElements > 0 ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-ws-line px-5 py-2.5">
          <PageSizeSelect
            value={size}
            onChange={(next) => {
              setSize(next);
              setPage(0);
            }}
            id={`company-jobs-size-${companyId}`}
          />
          <div className="ml-auto">
            <Pager page={data} onPageChange={setPage} />
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function JobRow({
  job,
  companyId,
}: {
  job: ModeratorJobListItem;
  companyId: string;
}) {
  return (
    <li className="border-b border-ws-line/70 last:border-0">
      <Link
        href={`/companies/${companyId}/jobs/${job.id}`}
        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ws-card"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ws-fg">
            {orDash(job.title)}
          </span>
          <span className="block truncate text-xs text-ws-faint">
            {[orDash(job.location), job.workMode, job.jobType]
              .filter((part) => part && part !== "—")
              .join(" · ")}
            {job.publishedAt
              ? ` · Published ${formatDateTime(job.publishedAt)}`
              : ` · Created ${formatDateTime(job.createdAt)}`}
          </span>
        </span>

        <Chip tone={jobTone[job.status]}>{humanizeEnum(job.status)}</Chip>

        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ws-faint" />
      </Link>
    </li>
  );
}
