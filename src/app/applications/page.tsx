"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Search, UsersRound } from "lucide-react";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { ReapplyCooldownPanel } from "@/components/console/ReapplyCooldownPanel";
import { ResultChip, ReviewStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillTabs } from "@/components/workspace/primitives";
import type {
  CandidateApplicationListItem,
  CandidateApplicationReviewStatus,
} from "@/contracts";
import { resolveFileUrl } from "@/lib/file-url";
import { formatDateTime, orDash } from "@/lib/format";
import {
  DEFAULT_PAGE_SIZE,
  useGetApplicationsQuery,
} from "@/services/moderationApi";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

const TABS = [
  "All",
  "Pending",
  "In review",
  "Interviewing",
  "Decision pending",
  "Approved",
  "Forwarded",
  "Rejected",
] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, CandidateApplicationReviewStatus | undefined> = {
  All: undefined,
  Pending: "PENDING",
  "In review": "IN_REVIEW",
  Interviewing: "HUMAN_INTERVIEW_SCHEDULED",
  "Decision pending": "DECISION_PENDING",
  Approved: "APPROVED",
  Forwarded: "FORWARDED",
  Rejected: "REJECTED",
};

const EMPTY: CandidateApplicationListItem[] = [];

/** Shared by the header and the body so the columns cannot drift apart. */
const COLUMNS = [
  { key: "candidate", label: "Candidate", className: "w-[23%]" },
  { key: "job", label: "Applied for", className: "w-[17%]" },
  { key: "ai", label: "AI interview", className: "w-[14%]" },
  { key: "resume", label: "Résumé", className: "w-[9%]" },
  { key: "applied", label: "Applied", className: "w-[16%]" },
  { key: "status", label: "Status", className: "w-[13%] text-right" },
  { key: "actions", label: "", className: "w-[8%]" },
] as const;

export default function ApplicationsPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Moderator results"));

  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = useState("");

  const { data, isLoading, isError, refetch } = useGetApplicationsQuery({
    status: tabStatus[tab],
    page,
    size,
  });

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  const applications = data?.content ?? EMPTY;

  // The list endpoint takes no search term, so this narrows what is already on
  // screen rather than pretending to query the whole queue.
  const rows = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((item) =>
      `${item.candidate?.headline ?? ""} ${item.candidate?.currentPosition ?? ""} ${item.application.jobTitle ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [applications, filter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 max-lg:min-w-0 max-lg:flex-none">
      <ReapplyCooldownPanel />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel max-lg:min-w-0 max-lg:flex-none">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <h2 className="font-semibold text-ws-fg">Review queue</h2>
          {data ? (
            <span className="rounded-md bg-ws-card px-2 py-0.5 text-xs font-medium text-ws-muted">
              {data.totalElements}
            </span>
          ) : null}

          <div className="relative ml-auto w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Search this page"
              className="pl-9"
            />
          </div>
        </div>

        <div className="min-w-0 shrink-0 px-4 pb-3">
          <PillTabs
            tabs={TABS}
            value={tab}
            onChange={reset(setTab)}
            className="rounded-lg bg-ws-card p-1"
          />
        </div>

        {/* Desktop scrolls within the pane. On smaller screens the list grows
            with its rows; horizontal scrolling keeps every column accessible. */}
        <div className="ws-scroll min-h-0 flex-1 overflow-auto border-t border-ws-line max-lg:flex-none max-sm:hidden">
          <table className="w-full table-fixed border-collapse text-left max-lg:min-w-[960px]">
            <thead className="sticky top-0 z-10">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    /* The fill and the rule live on the cell, not the row: a
                       collapsed border does not travel with a sticky header,
                       so the divider is drawn as an inset shadow instead. */
                    className={`${column.className} bg-ws-card px-4 py-2.5 text-xs font-semibold text-ws-muted shadow-[inset_0_-1px_0_var(--ws-line)]`}
                  >
                    {column.label || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <FullRow>
                  <LoadingState rows={6} />
                </FullRow>
              ) : isError ? (
                <FullRow>
                  <ErrorState
                    message="Unable to load applications."
                    onRetry={refetch}
                  />
                </FullRow>
              ) : rows.length === 0 ? (
                <FullRow>
                  <EmptyState filtered={applications.length > 0} />
                </FullRow>
              ) : (
                rows.map((item) => (
                  <CandidateRow key={item.application.id} item={item} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 border-t border-ws-line p-3 sm:hidden">
          {isLoading ? <LoadingState rows={6} /> : isError ? (
            <ErrorState message="Unable to load applications." onRetry={refetch} />
          ) : rows.length === 0 ? (
            <EmptyState filtered={applications.length > 0} />
          ) : rows.map((item) => (
            <CandidateCard key={item.application.id} item={item} />
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect
            value={size}
            onChange={reset(setSize)}
            id="applications-page-size"
          />
          {data ? (
            <div className="ml-auto">
              <Pager page={data} onPageChange={setPage} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** A state that spans the table rather than sitting in one column. */
function FullRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="p-4 align-top">
        {children}
      </td>
    </tr>
  );
}

/**
 * One candidate.
 *
 * Deliberately only what the list endpoint already returns: the AI score and
 * the interview live on the detail endpoint, and reaching for them here would
 * mean a request per row on every page of a screen that is being scanned. They
 * are on the candidate's own page, which is also where the decisions are made.
 */
function CandidateRow({ item }: { item: CandidateApplicationListItem }) {
  const href = `/applications/${item.application.id}`;

  return (
    <tr className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid text-sm font-semibold text-chip-solid-fg">
            {item.candidate?.headline?.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <span className="min-w-0">
            <Link
              href={href}
              className="block truncate font-medium text-ws-fg hover:underline"
            >
              {orDash(item.candidate?.headline)}
            </Link>
            <span className="block truncate text-xs text-ws-faint">
              {orDash(item.candidate?.currentPosition)}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="block truncate text-sm text-ws-fg">
          {orDash(item.application.jobTitle)}
        </span>
        <span className="block truncate text-xs text-ws-faint">
          {orDash(item.candidate?.preferredLocation)}
        </span>
      </td>

      {/* The score is the first thing a moderator reads when deciding who to
          open, so it belongs in the row rather than behind it. */}
      <td className="px-4 py-3">
        {item.aiResult || item.aiScore != null ? (
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-ws-fg">
              {item.aiScore == null ? "—" : item.aiScore}
            </span>
            <ResultChip result={item.aiResult} />
          </span>
        ) : (
          <span className="text-xs text-ws-faint">Not finished</span>
        )}
      </td>

      <td className="px-4 py-3">
        {item.submittedResume?.resumeFileUrl ? (
          /* A plain anchor: the file is served by the backend through the
             gateway, not by a route of this app. */
          <a
            href={resolveFileUrl(item.submittedResume.resumeFileUrl)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-ws-muted transition-colors hover:text-ws-fg hover:underline"
          >
            <FileText aria-hidden="true" className="size-4 shrink-0" />
            Open
          </a>
        ) : (
          <span className="text-xs text-ws-faint">None</span>
        )}
      </td>

      <td className="px-4 py-3 text-sm text-ws-muted">
        {formatDateTime(item.application.appliedAt)}
      </td>

      <td className="px-4 py-3">
        <div className="flex justify-end">
          {item.review ? (
            <ReviewStatusChip status={item.review.reviewStatus} />
          ) : null}
        </div>
      </td>

      <td className="px-4 py-3">
        <Button size="sm" variant="ghost" render={<Link href={href} />}>
          Open
        </Button>
      </td>
    </tr>
  );
}

function CandidateCard({ item }: { item: CandidateApplicationListItem }) {
  const href = `/applications/${item.application.id}`;
  return (
    <article className="min-w-0 rounded-xl border border-ws-line bg-ws-panel p-4 shadow-xs">
      <Link href={href} className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip-solid font-semibold text-chip-solid-fg">
          {item.candidate?.headline?.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <span className="min-w-0 break-words">
          <span className="block text-sm font-semibold text-ws-fg">{orDash(item.candidate?.headline)}</span>
          <span className="block text-xs text-ws-faint">{orDash(item.candidate?.currentPosition)}</span>
        </span>
      </Link>
      <dl className="mt-3 divide-y divide-ws-line text-sm [&>div]:grid [&>div]:grid-cols-[5.5rem_minmax(0,1fr)] [&>div]:gap-3 [&>div]:py-3 [&_dt]:text-ws-muted [&_dd]:min-w-0 [&_dd]:break-words [&_dd]:text-right">
        <div><dt>Applied for</dt><dd>{orDash(item.application.jobTitle)}</dd></div>
        <div><dt>Location</dt><dd>{orDash(item.candidate?.preferredLocation)}</dd></div>
        <div><dt>AI interview</dt><dd>
          {item.aiResult || item.aiScore != null ? (
            <span className="flex flex-wrap items-center justify-end gap-2">
              <span className="font-semibold tabular-nums">{item.aiScore ?? "—"}</span>
              <ResultChip result={item.aiResult} />
            </span>
          ) : "Not finished"}
        </dd></div>
        <div><dt>Résumé</dt><dd>
          {item.submittedResume?.resumeFileUrl ? (
            <a href={resolveFileUrl(item.submittedResume.resumeFileUrl)} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-primary hover:underline">
              <FileText aria-hidden="true" className="size-4" /> Open résumé
            </a>
          ) : "None"}
        </dd></div>
        <div><dt>Applied</dt><dd>{formatDateTime(item.application.appliedAt)}</dd></div>
        <div><dt>Status</dt><dd>{item.review ? <ReviewStatusChip status={item.review.reviewStatus} /> : "—"}</dd></div>
      </dl>
      <Button variant="outline" className="mt-2 min-h-11 w-full" render={<Link href={href} />}>
        Open application
      </Button>
    </article>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-16 text-center">
      <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-ws-card text-ws-faint">
        <UsersRound aria-hidden="true" className="size-5" />
      </span>
      <p className="font-semibold text-ws-fg">
        {filtered ? "No candidates match that search" : "Nothing in this queue"}
      </p>
      <p className="text-xs text-ws-faint">
        {filtered
          ? "The search only covers the candidates loaded on this page."
          : "Candidates arrive here once their AI interview is finished."}
      </p>
    </div>
  );
}
