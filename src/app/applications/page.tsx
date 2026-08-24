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
import { toast } from "sonner";
import { Pager } from "@/components/console/Pager";
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
  const candidateName = orDash(item.candidate?.headline);

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
    <li className="rounded-[18px] bg-ws-card-hover px-4 py-3.5">
      <div className="grid grid-cols-[1.35fr_1.35fr_.6fr_.8fr_1fr_1.15fr_2.2fr] items-center gap-3">
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
          <ActionLink href={detailHref} label="View details" icon={Eye} primary />
        </span>
      </div>

      {panel === "schedule" || panel === "reschedule" ? (
        <div className="mt-3 grid gap-3 rounded-[16px] bg-ws-card p-3 sm:grid-cols-2">
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
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[16px] bg-ws-card p-3">
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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger"
          ? "bg-chip-alert text-chip-alert-fg"
          : "bg-ws-card text-ws-muted hover:text-ws-fg",
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {label}
    </button>
  );
}
