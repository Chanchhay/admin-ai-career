"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  Check,
  CircleCheck,
  ChevronRight,
  Eye,
  RotateCw,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/console/Pager";
import { ReapplyCooldownPanel } from "@/components/console/ReapplyCooldownPanel";
import {
  InterviewStatusChip,
  ResultChip,
  ReviewStatusChip,
} from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type {
  CandidateApplicationListItem,
  CandidateApplicationReviewStatus,
  InterviewResult,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, orDash, toInstant } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useCancelHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useDecideApplicationMutation,
  useGetApplicationQuery,
  useGetApplicationsQuery,
  useRescheduleHumanInterviewMutation,
  useScheduleHumanInterviewMutation,
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
    <div className="flex flex-col gap-4 text-sm">
      <ReapplyCooldownPanel />

      <Panel tone="soft" className="flex items-start gap-3 px-5 py-4">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ws-card/80">
          <Sparkles aria-hidden="true" className="size-4" />
        </span>
        <p className="max-w-5xl text-sm leading-6">
          Candidates reach this queue once their AI interview is done. Approve
          to clear them, schedule a human interview when the AI result is
          borderline, and forward to hand the recruiter the file.
        </p>
      </Panel>

      <Panel className="overflow-hidden border-ws-line/70 p-0 shadow-sm">
        <div className="border-b border-ws-line/70 bg-gradient-to-r from-primary-tint/80 via-ws-card to-ws-card px-4 py-4 sm:px-6 sm:py-5">
          <PanelHeader
            title="Review queue"
            icon={<UsersRound aria-hidden="true" className="size-5" />}
            action={
              data ? (
                <span className="rounded-full bg-ws-card-hover px-3 py-1 text-xs font-semibold text-ws-muted">
                  {data.totalElements} {data.totalElements === 1 ? "candidate" : "candidates"}
                </span>
              ) : null
            }
          />

        <p className="mt-1 max-w-2xl text-sm leading-6 text-ws-muted">
          Review AI assessments, coordinate interviews, and make the final
          application decision from one place.
        </p>

        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={selectTab}
          className="mt-4 rounded-2xl border border-ws-line/60 bg-ws-card/80 p-1.5 shadow-sm"
        />
        </div>

        <div className="p-4 sm:p-5">

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load applications." onRetry={refetch} />
        ) : applications.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            Nothing in {tab.toLowerCase()}.
          </p>
        ) : (
          <ul className="grid gap-4">
            {applications.map((item) => (
              <CandidateReviewRow key={item.application.id} item={item} />
            ))}
          </ul>
        )}

        {data ? <Pager page={data} onPageChange={setPage} /> : null}
        </div>
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
  const candidateName = orDash(item.candidate?.headline);
  const reviewStatus = item.review?.reviewStatus;
  const isDecisionFinal =
    reviewStatus === "APPROVED" || reviewStatus === "REJECTED";
  const candidateInitial =
    item.candidate?.headline?.trim().charAt(0).toUpperCase() || "?";

  const [decide, { isLoading: isDeciding }] = useDecideApplicationMutation();
  const [scheduleInterview, { isLoading: isScheduling }] =
    useScheduleHumanInterviewMutation();
  const [rescheduleInterview, { isLoading: isRescheduling }] =
    useRescheduleHumanInterviewMutation();
  const [completeInterview, { isLoading: isCompleting }] =
    useCompleteHumanInterviewMutation();
  const [cancelInterview, { isLoading: isCancelling }] =
    useCancelHumanInterviewMutation();
  const busy =
    isDeciding || isScheduling || isRescheduling || isCompleting || isCancelling;

  const [panel, setPanel] = useState<"schedule" | "reschedule" | "complete" | null>(
    null,
  );
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const approve = async () => {
    if (!window.confirm(`Approve ${candidateName}?`)) return;
    try {
      await decide({ applicationId, decision: "approve" }).unwrap();
      toast.success("Application approved.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to approve this application."));
    }
  };

  const reject = async () => {
    const note = window.prompt(`Why is ${candidateName} being rejected?`);
    if (note === null) return;
    if (!note.trim()) {
      toast.error("A rejection note is required.");
      return;
    }
    try {
      await decide({
        applicationId,
        decision: "reject",
        body: { decisionNote: note.trim() },
      }).unwrap();
      toast.success("Application rejected.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reject this application."));
    }
  };

  const forward = async () => {
    if (!window.confirm(`Forward ${candidateName} to the recruiter?`)) return;
    try {
      await decide({ applicationId, decision: "forward" }).unwrap();
      toast.success("Application forwarded.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to forward this application."));
    }
  };

  const cancel = async () => {
    if (!latestInterview) return;
    if (!window.confirm("Cancel this interview?")) return;
    try {
      await cancelInterview({
        interviewId: latestInterview.id,
        applicationId,
      }).unwrap();
      toast.success("Interview cancelled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to cancel the interview."));
    }
  };

  const openSchedule = () => {
    setScheduledAt("");
    setMeetingUrl("");
    setPanel("schedule");
  };

  const openReschedule = () => {
    if (!latestInterview) return;
    const parsed = new Date(latestInterview.scheduledAt);
    const localValue = Number.isNaN(parsed.getTime())
      ? ""
      : new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000)
          .toISOString()
          .slice(0, 16);
    setScheduledAt(localValue);
    setMeetingUrl(latestInterview.meetingUrl ?? "");
    setPanel("reschedule");
  };

  const saveInterview = async () => {
    if (!scheduledAt || !meetingUrl.trim()) {
      toast.error("A date and a meeting link are both required.");
      return;
    }

    const body = { scheduledAt: toInstant(scheduledAt), meetingUrl: meetingUrl.trim() };

    try {
      if (panel === "schedule") {
        await scheduleInterview({ applicationId, body }).unwrap();
        toast.success("Interview scheduled.");
      } else if (panel === "reschedule" && latestInterview) {
        await rescheduleInterview({
          interviewId: latestInterview.id,
          applicationId,
          body,
        }).unwrap();
        toast.success("Interview rescheduled.");
      }
      setPanel(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          panel === "schedule"
            ? "Unable to schedule the interview."
            : "Unable to reschedule the interview.",
        ),
      );
    }
  };

  const finish = async (result: InterviewResult) => {
    if (!latestInterview) return;
    try {
      await completeInterview({
        interviewId: latestInterview.id,
        applicationId,
        body: { result },
      }).unwrap();
      toast.success(
        `Interview marked ${result === "NEEDS_REVIEW" ? "needs review" : result.toLowerCase()}.`,
      );
      setPanel(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to complete the interview."));
    }
  };

  const interviewOpen =
    !latestInterview ||
    (latestInterview.status !== "COMPLETED" && latestInterview.status !== "CANCELLED");

  return (
    <li className="group overflow-hidden rounded-2xl border border-ws-line/80 bg-ws-card shadow-[0_8px_30px_rgba(24,25,28,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_14px_36px_rgba(24,25,28,0.08)]">
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-hover text-base font-bold text-primary-foreground shadow-sm">
            {candidateInitial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight text-ws-fg">
              {orDash(item.candidate?.headline)}
            </span>
            <span className="mt-1.5 flex items-center gap-1.5 truncate text-xs text-ws-muted">
              <UserRound aria-hidden="true" className="size-3.5 shrink-0" />
              {orDash(item.candidate?.currentPosition)}
            </span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start">
          {item.review ? (
            <span className="[&>span]:min-h-8 [&>span]:rounded-lg [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-sm">
              <ReviewStatusChip status={item.review.reviewStatus} />
            </span>
          ) : null}
          <ActionLink href={detailHref} label="View details" icon={Eye} primary />
        </div>
      </div>

      <div className="grid border-y border-ws-line/70 bg-ws-card-hover/35 sm:grid-cols-3 sm:divide-x sm:divide-ws-line/70">
        <div className="flex min-w-0 gap-3 px-5 py-4 sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ws-card text-ws-muted shadow-sm">
            <BriefcaseBusiness aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-ws-faint">Applied for</span>
            <span className="mt-1 block truncate text-sm font-semibold text-ws-fg">{orDash(item.application.jobTitle)}</span>
            <span className="mt-0.5 block truncate text-xs text-ws-muted">{formatDateTime(item.application.appliedAt)}</span>
          </span>
        </div>

        <div className="flex gap-3 border-t border-ws-line/70 px-5 py-4 sm:border-t-0 sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-tint text-sm font-bold text-primary">
            {isLoading ? "…" : (aiFeedback?.overallScore ?? "—")}
          </span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-ws-faint">AI assessment</span>
            <span className="mt-1.5 block">{aiFeedback ? <ResultChip result={aiFeedback.result} /> : <span className="text-xs text-ws-muted">Awaiting result</span>}</span>
          </span>
        </div>

        <div className="flex gap-3 border-t border-ws-line/70 px-5 py-4 sm:border-t-0 sm:px-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ws-card text-ws-muted shadow-sm">
            <CalendarClock aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-ws-faint">Human interview</span>
            {latestInterview ? (
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <InterviewStatusChip status={latestInterview.status} />
                <span className="text-xs text-ws-muted">{formatDateTime(latestInterview.scheduledAt)}</span>
              </span>
            ) : (
              <span className="mt-1.5 block text-xs text-ws-muted">Not scheduled</span>
            )}
          </span>
        </div>
      </div>

      {!isDecisionFinal ? (
        <div className="flex flex-col gap-3 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <span className="text-xs font-medium text-ws-faint">Choose the next step for this application</span>
          <span className="flex flex-wrap items-center gap-2">
            <>
              <ActionButton label="Approve" icon={Check} onClick={approve} disabled={busy} />
              <ActionButton
                label="Reject"
                icon={X}
                tone="danger"
                onClick={reject}
                disabled={busy}
              />
              <ActionButton label="Forward" icon={Send} onClick={forward} disabled={busy} />
              {!latestInterview ? (
                <ActionButton
                  label="Schedule interview"
                  icon={CalendarClock}
                  onClick={openSchedule}
                  disabled={busy}
                />
              ) : interviewOpen ? (
                <>
              <ActionButton
                label="Reschedule"
                icon={RotateCw}
                onClick={openReschedule}
                disabled={busy}
              />
              <ActionButton
                label="Complete"
                icon={CircleCheck}
                onClick={() => setPanel("complete")}
                disabled={busy}
              />
              <ActionButton
                label="Cancel"
                icon={X}
                tone="danger"
                onClick={cancel}
                disabled={busy}
              />
                </>
              ) : null}
            </>
          </span>
        </div>
      ) : null}

      {panel === "schedule" || panel === "reschedule" ? (
        <div className="mx-5 mb-5 grid gap-3 rounded-2xl border border-ws-line/70 bg-ws-card-hover/50 p-4 sm:mx-6 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            {panel === "schedule" ? "When (your local time)" : "New date and time"}
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            Meeting link
            <Input
              type="url"
              value={meetingUrl}
              onChange={(event) => setMeetingUrl(event.target.value)}
              placeholder="https://meet.example.com/abc-defg"
            />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <Button size="sm" disabled={busy} onClick={() => void saveInterview()}>
              {panel === "schedule" ? "Schedule" : "Save new time"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => setPanel(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : panel === "complete" ? (
        <div className="mx-5 mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-ws-line/70 bg-ws-card-hover/50 p-4 sm:mx-6">
          <span className="text-xs font-medium text-ws-muted">Mark interview as</span>
          <Button size="sm" disabled={busy} onClick={() => void finish("PASSED")}>
            Passed
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() => void finish("NEEDS_REVIEW")}
          >
            Needs review
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={() => void finish("FAILED")}
          >
            Failed
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => setPanel(null)}
          >
            Cancel
          </Button>
        </div>
      ) : null}
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
          ? "inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
          : tone === "danger"
            ? "inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-chip-alert px-3 py-1.5 text-sm font-semibold text-chip-alert-fg"
            : "inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-ws-line bg-ws-card px-3 py-1.5 text-sm font-semibold text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg"
      }
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </Link>
  );
}

/** Same shape as `ActionLink`, but fires a mutation instead of navigating. */
function ActionButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  tone,
}: {
  label: string;
  icon: typeof ChevronRight;
  onClick: () => void;
  disabled?: boolean;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger"
          ? "border-transparent bg-chip-alert text-chip-alert-fg hover:brightness-95"
          : "border-ws-line bg-ws-card text-ws-muted hover:bg-ws-card-hover hover:text-ws-fg",
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </button>
  );
}
