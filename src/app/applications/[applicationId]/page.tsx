"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Send,
  Sparkles,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  ApplicationStatusChip,
  InterviewStatusChip,
  ResultChip,
  ReviewStatusChip,
} from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StartConversation } from "@/components/messages/StartConversation";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type { HumanInterviewResponse, InterviewResult } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { formatDateTime, humanizeEnum, orDash, toInstant } from "@/lib/format";
import { isUuid } from "@/lib/uuid";
import { cn } from "@/lib/utils";
import {
  useCancelHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useDecideApplicationMutation,
  useGetApplicationQuery,
  useRescheduleHumanInterviewMutation,
  useScheduleHumanInterviewMutation,
} from "@/services/moderationApi";

function getInitials(name?: string): string {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const id = applicationId;

  const { data, isLoading, isError, refetch } = useGetApplicationQuery(id, {
    skip: !isUuid(id),
  });
  const [decide, { isLoading: isDeciding }] = useDecideApplicationMutation();
  const [note, setNote] = useState("");

  useSetPageHeading(data?.candidate?.headline ?? "Application");

  const submit = async (decision: "approve" | "reject" | "forward") => {
    if (decision === "reject" && !note.trim()) {
      toast.error("Explain the rejection in the note first.");
      return;
    }

    try {
      await decide({
        applicationId: id,
        decision,
        body:
          decision === "forward" || !note.trim()
            ? undefined
            : { decisionNote: note.trim() },
      }).unwrap();
      setNote("");
      toast.success(
        decision === "approve"
          ? "Application approved. You can forward it to the recruiter now."
          : decision === "forward"
            ? "Forwarded to the recruiter."
            : "Application rejected.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record the decision."));
    }
  };

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !data) {
    return (
      <ErrorState message="Unable to load this application." onRetry={refetch} />
    );
  }

  const { application, candidate, submittedResume, review, aiResult } = data;
  const resumeUrl = resolveFileUrl(submittedResume?.resumeFileUrl);

  const reviewStatus = review?.reviewStatus;
  const isApproved = reviewStatus === "APPROVED";
  const isForwarded = reviewStatus === "FORWARDED";
  const isRejected = reviewStatus === "REJECTED";
  const isDecided = isApproved || isForwarded || isRejected;

  // Prevent duplicate "[Rejected] [Rejected]" badges:
  // Show reviewStatus as primary, and application.status only if different
  const showApplicationStatus =
    !reviewStatus || application.status !== reviewStatus;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ws-muted transition-colors hover:text-ws-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to queue
        </Link>
      </div>

      {/* Hero Candidate Profile Card */}
      <Panel className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary shadow-xs">
                {getInitials(candidate?.headline)}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-ws-fg">
                  {orDash(candidate?.headline)}
                </h2>
                <p className="mt-1 text-xs text-ws-muted">
                  Applied for{" "}
                  <span className="font-semibold text-ws-fg">
                    {orDash(application.jobTitle)}
                  </span>{" "}
                  · {formatDateTime(application.appliedAt)}
                </p>
              </div>
            </div>

            {/* Status & Message Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {review ? <ReviewStatusChip status={review.reviewStatus} /> : null}
              {showApplicationStatus ? (
                <ApplicationStatusChip status={application.status} />
              ) : null}

              <StartConversation
                applicationId={id}
                label="Message candidate"
                recipientName={orDash(candidate?.headline)}
              />
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-ws-line/60 bg-ws-card-hover/50 p-3.5 transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
                <Briefcase aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ws-faint">
                  Current position
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ws-fg">
                  {orDash(candidate?.currentPosition)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-ws-line/60 bg-ws-card-hover/50 p-3.5 transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
                <MapPin aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ws-faint">
                  Preferred location
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ws-fg">
                  {orDash(candidate?.preferredLocation)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-ws-line/60 bg-ws-card-hover/50 p-3.5 transition-colors">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ws-card text-ws-muted">
                <Clock aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ws-faint">
                  Availability
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ws-fg">
                  {orDash(candidate?.availabilityStatus)}
                </p>
              </div>
            </div>
          </div>

          {/* Cover Letter if present */}
          {application.coverLetter ? (
            <div className="rounded-xl border border-ws-line/60 bg-ws-card-hover/40 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ws-faint">
                <FileText aria-hidden="true" className="size-3.5" />
                Cover letter
              </div>
              <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-ws-muted">
                {application.coverLetter}
              </p>
            </div>
          ) : null}
        </div>
      </Panel>

      {/* Submitted Resume */}
      {submittedResume ? (
        <Panel>
          <PanelHeader
            title="Submitted resume"
            icon={<FileText aria-hidden="true" className="size-4" />}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ws-line/60 bg-ws-card-hover/60 p-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText aria-hidden="true" className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ws-fg">
                  {orDash(submittedResume.title)}
                </p>
                <p className="text-xs text-ws-faint">PDF document</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GhostChip>{humanizeEnum(submittedResume.visibility)}</GhostChip>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-ws-panel px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-ws-card shadow-xs"
              >
                <span>View resume</span>
                <ExternalLink aria-hidden="true" className="size-3" />
              </a>
            </div>
          </div>
        </Panel>
      ) : null}

      {/* AI Interview Result */}
      {aiResult?.feedback ? (
        <Panel>
          <PanelHeader
            title="AI interview evaluation"
            icon={<Sparkles aria-hidden="true" className="size-4 text-primary" />}
            action={<ResultChip result={aiResult.feedback.result} />}
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <ScoreCard label="Overall score" value={aiResult.feedback.overallScore} />
            <ScoreCard label="Technical" value={aiResult.feedback.technicalScore} />
            <ScoreCard
              label="Communication"
              value={aiResult.feedback.communicationScore}
            />
            <ScoreCard label="Confidence" value={aiResult.feedback.confidenceScore} />
            <ScoreCard
              label="Problem solving"
              value={aiResult.feedback.problemSolvingScore}
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <EvaluationCard
              label="Strengths"
              value={aiResult.feedback.strengths}
              tone="positive"
            />
            <EvaluationCard
              label="Weaknesses"
              value={aiResult.feedback.weaknesses}
              tone="warning"
            />
            <EvaluationCard
              label="Recommendation"
              value={aiResult.feedback.recommendation}
              tone="primary"
            />
          </div>
        </Panel>
      ) : null}

      {/* Human Interviews Panel */}
      <HumanInterviews
        applicationId={id}
        interviews={data.humanInterviews ?? []}
      />

      {/* Final Decision Panel */}
      <Panel>
        <PanelHeader
          title={isRejected || isForwarded ? "Final decision" : "Decision"}
          icon={
            isRejected ? (
              <XCircle aria-hidden="true" className="size-4 text-destructive" />
            ) : isForwarded || isApproved ? (
              <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
            ) : undefined
          }
        />

        {isDecided ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5 rounded-2xl border border-ws-line/70 bg-ws-card-hover/60 p-4">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs",
                  isRejected
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary",
                )}
              >
                {isRejected ? (
                  <X aria-hidden="true" className="size-5" />
                ) : (
                  <Check aria-hidden="true" className="size-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ws-faint">
                  Application review decision
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <ReviewStatusChip status={reviewStatus} />
                </div>
              </div>
            </div>

            {review?.decisionNote ? (
              <div className="rounded-xl border border-ws-line/60 bg-ws-panel p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ws-faint">
                  Decision note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ws-fg">
                  {review.decisionNote}
                </p>
              </div>
            ) : null}

            {isApproved ? (
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                <p className="text-sm font-semibold text-ws-fg">
                  Ready to forward
                </p>
                <p className="mt-1 text-xs text-ws-muted">
                  The review is approved. Forwarding sends the candidate’s resume
                  and AI interview result to the company recruiter.
                </p>
                <Button
                  className="mt-3"
                  disabled={isDeciding}
                  onClick={() => void submit("forward")}
                >
                  <Send aria-hidden="true" className="size-4" />
                  Forward to recruiter
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          /* Pending decision form */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="decision-note-textarea"
                className="text-xs font-semibold text-ws-muted"
              >
                Decision note
              </label>
              <Textarea
                id="decision-note-textarea"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Explain why this candidate is being approved or turned down…"
                rows={3}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button
                disabled={isDeciding}
                onClick={() => void submit("approve")}
                className="gap-1.5"
              >
                <Check aria-hidden="true" className="size-4" />
                Approve candidate
              </Button>
              <Button
                variant="destructive"
                disabled={isDeciding}
                onClick={() => void submit("reject")}
                className="gap-1.5"
              >
                <X aria-hidden="true" className="size-4" />
                Reject candidate
              </Button>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* --------------------------------------------------- human interviews --- */

function HumanInterviews({
  applicationId,
  interviews,
}: {
  applicationId: string;
  interviews: HumanInterviewResponse[];
}) {
  const [schedule, { isLoading: isScheduling }] =
    useScheduleHumanInterviewMutation();
  const [complete, { isLoading: isCompleting }] =
    useCompleteHumanInterviewMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelHumanInterviewMutation();
  const [reschedule, { isLoading: isRescheduling }] =
    useRescheduleHumanInterviewMutation();

  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(
    null,
  );
  const [rescheduledAt, setRescheduledAt] = useState("");
  const [rescheduledMeetingUrl, setRescheduledMeetingUrl] = useState("");

  const book = async () => {
    if (!scheduledAt || !meetingUrl.trim()) {
      toast.error("A date and a meeting link are both required.");
      return;
    }

    try {
      await schedule({
        applicationId,
        body: { scheduledAt: toInstant(scheduledAt), meetingUrl: meetingUrl.trim() },
      }).unwrap();
      setScheduledAt("");
      setMeetingUrl("");
      toast.success("Interview scheduled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to schedule the interview."));
    }
  };

  const finish = async (interviewId: string, result: InterviewResult) => {
    try {
      await complete({ interviewId, applicationId, body: { result } }).unwrap();
      toast.success(`Interview marked ${humanizeEnum(result).toLowerCase()}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to complete the interview."));
    }
  };

  const drop = async (interviewId: string) => {
    try {
      await cancel({ interviewId, applicationId }).unwrap();
      toast.success("Interview cancelled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to cancel the interview."));
    }
  };

  const startRescheduling = (interview: HumanInterviewResponse) => {
    const parsed = new Date(interview.scheduledAt);
    const localValue = Number.isNaN(parsed.getTime())
      ? ""
      : new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60_000)
          .toISOString()
          .slice(0, 16);
    setEditingInterviewId(interview.id);
    setRescheduledAt(localValue);
    setRescheduledMeetingUrl(interview.meetingUrl ?? "");
  };

  const saveReschedule = async (interviewId: string) => {
    if (!rescheduledAt || !rescheduledMeetingUrl.trim()) {
      toast.error("A date and a meeting link are both required.");
      return;
    }

    try {
      await reschedule({
        interviewId,
        applicationId,
        body: {
          scheduledAt: toInstant(rescheduledAt),
          meetingUrl: rescheduledMeetingUrl.trim(),
        },
      }).unwrap();
      setEditingInterviewId(null);
      toast.success("Interview rescheduled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reschedule the interview."));
    }
  };

  const busy = isCompleting || isCancelling || isRescheduling;

  return (
    <Panel>
      <PanelHeader
        title={`Human interviews (${interviews.length})`}
        icon={<Video aria-hidden="true" className="size-4" />}
        action={
          <Link
            href="/interviews"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ws-line/60 bg-ws-card px-2.5 py-1 text-xs font-semibold text-ws-muted transition-colors hover:bg-ws-card-hover hover:text-ws-fg"
          >
            <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
            View schedule on calendar
          </Link>
        }
      />

      {/* Existing interviews list */}
      {interviews.length > 0 ? (
        <ul className="mb-5 flex flex-col gap-3">
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="rounded-xl border border-ws-line/70 bg-ws-card-hover/50 p-4 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video aria-hidden="true" className="size-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-ws-fg">
                      {formatDateTime(interview.scheduledAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <InterviewStatusChip status={interview.status} />
                  <ResultChip result={interview.result} />
                </div>
              </div>

              {interview.meetingUrl ? (
                <div className="mt-2.5">
                  <a
                    href={interview.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-ws-panel px-2.5 py-1 text-xs font-medium text-primary hover:underline border border-ws-line/50"
                  >
                    <Video aria-hidden="true" className="size-3.5" />
                    <span className="truncate">{interview.meetingUrl}</span>
                    <ExternalLink aria-hidden="true" className="size-3" />
                  </a>
                </div>
              ) : null}

              {interview.note ? (
                <p className="mt-2.5 text-xs leading-relaxed text-ws-muted">
                  {interview.note}
                </p>
              ) : null}

              {editingInterviewId === interview.id ? (
                <div className="mt-3.5 grid gap-3 rounded-xl bg-ws-panel p-3.5 border border-ws-line/70 sm:grid-cols-2">
                  <DateTimePicker
                    label="New date and time"
                    value={rescheduledAt}
                    onChange={setRescheduledAt}
                    disabled={busy}
                  />
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-ws-muted">
                    Meeting link
                    <Input
                      type="url"
                      value={rescheduledMeetingUrl}
                      onChange={(event) =>
                        setRescheduledMeetingUrl(event.target.value)
                      }
                    />
                  </label>
                  <div className="flex gap-2 sm:col-span-2 pt-1">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => void saveReschedule(interview.id)}
                    >
                      Save new time
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => setEditingInterviewId(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Active interview actions */}
              {interview.status !== "COMPLETED" &&
              interview.status !== "CANCELLED" ? (
                <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-ws-line/50 pt-2.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => startRescheduling(interview)}
                    className="h-7 text-xs"
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "PASSED")}
                    className="h-7 text-xs"
                  >
                    Passed
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "NEEDS_REVIEW")}
                    className="h-7 text-xs"
                  >
                    Needs review
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "FAILED")}
                    className="h-7 text-xs"
                  >
                    Failed
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => void drop(interview.id)}
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                  >
                    Cancel
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Scheduling form */}
      <div className="rounded-xl border border-ws-line/70 bg-ws-card-hover/40 p-4">
        <div>
          <p className="text-xs font-bold text-ws-fg">Schedule an interview</p>
          <p className="text-[11px] text-ws-faint">
            Set the date, local time, and video meeting link for this candidate.
          </p>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <DateTimePicker
            label="When (your local time)"
            value={scheduledAt}
            onChange={setScheduledAt}
            disabled={isScheduling}
          />
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-ws-muted">
            Meeting link
            <Input
              type="url"
              value={meetingUrl}
              onChange={(event) => setMeetingUrl(event.target.value)}
              placeholder="https://meet.example.com/abc-defg"
            />
          </label>
        </div>

        <Button
          size="sm"
          className="mt-3.5 gap-1.5"
          disabled={isScheduling}
          onClick={() => void book()}
        >
          <CalendarPlus aria-hidden="true" className="size-4" />
          Schedule interview
        </Button>
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------- pieces --- */

function ScoreCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-ws-line/60 bg-ws-card-hover/50 p-4 transition-colors">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ws-faint">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-ws-fg">
          {value ?? "—"}
        </span>
        {value !== null ? (
          <span className="text-xs text-ws-faint">/ 10</span>
        ) : null}
      </div>
    </div>
  );
}

function EvaluationCard({
  label,
  value,
  tone,
}: {
  label: string;
  value?: string;
  tone: "positive" | "warning" | "primary";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        tone === "positive" && "border-emerald-500/30 bg-emerald-500/5",
        tone === "warning" && "border-amber-500/30 bg-amber-500/5",
        tone === "primary" && "border-brand/30 bg-brand/5",
      )}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-ws-fg">
        {label}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ws-muted">
        {orDash(value)}
      </p>
    </div>
  );
}
