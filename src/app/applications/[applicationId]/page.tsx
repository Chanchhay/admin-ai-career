"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  FileText,
  Send,
  Sparkles,
  Video,
  X,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type { HumanInterviewResponse, InterviewResult } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { formatDateTime, humanizeEnum, orDash, toInstant } from "@/lib/format";
import {
  useCancelHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useDecideApplicationMutation,
  useGetApplicationQuery,
  useScheduleHumanInterviewMutation,
} from "@/services/moderationApi";

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const id = Number(applicationId);

  const { data, isLoading, isError, refetch } = useGetApplicationQuery(id, {
    skip: Number.isNaN(id),
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
        // `forward` takes no body; the note would be dropped, so it is not sent.
        body:
          decision === "forward" || !note.trim()
            ? undefined
            : { decisionNote: note.trim() },
      }).unwrap();
      setNote("");
      toast.success(`Application ${decision}d.`);
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
  const isFinalReview =
    review?.reviewStatus === "APPROVED" ||
    review?.reviewStatus === "REJECTED" ||
    review?.reviewStatus === "FORWARDED";

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/applications"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ws-faint transition-colors hover:text-ws-fg"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to queue
      </Link>

      <Panel>
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ws-fg">
              {orDash(candidate?.headline)}
            </h2>
            <p className="mt-1 text-sm text-ws-faint">
              Applied to {orDash(application.jobTitle)} ·{" "}
              {formatDateTime(application.appliedAt)}
            </p>
          </div>
          {review ? <ReviewStatusChip status={review.reviewStatus} /> : null}
          <ApplicationStatusChip status={application.status} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Current position" value={candidate?.currentPosition} />
          <Field label="Preferred location" value={candidate?.preferredLocation} />
          <Field label="Availability" value={candidate?.availabilityStatus} />
        </dl>

        {application.coverLetter ? (
          <div className="mt-4 rounded-[18px] bg-ws-card-hover px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
              Cover letter
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ws-muted">
              {application.coverLetter}
            </p>
          </div>
        ) : null}
      </Panel>

      {submittedResume ? (
        <Panel>
          <PanelHeader
            title="Submitted resume"
            icon={<FileText aria-hidden="true" className="size-5" />}
          />
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
          >
            <FileText aria-hidden="true" className="size-4 text-ws-muted" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ws-fg">
              {orDash(submittedResume.title)}
            </span>
            <GhostChip>{humanizeEnum(submittedResume.visibility)}</GhostChip>
          </a>
        </Panel>
      ) : null}

      {aiResult?.feedback ? (
        <Panel>
          <PanelHeader
            title="AI interview result"
            icon={<Sparkles aria-hidden="true" className="size-5" />}
            action={<ResultChip result={aiResult.feedback.result} />}
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Score label="Overall" value={aiResult.feedback.overallScore} />
            <Score label="Technical" value={aiResult.feedback.technicalScore} />
            <Score
              label="Communication"
              value={aiResult.feedback.communicationScore}
            />
            <Score label="Confidence" value={aiResult.feedback.confidenceScore} />
            <Score
              label="Problem solving"
              value={aiResult.feedback.problemSolvingScore}
            />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <Prose label="Strengths" value={aiResult.feedback.strengths} />
            <Prose label="Weaknesses" value={aiResult.feedback.weaknesses} />
            <Prose
              label="Recommendation"
              value={aiResult.feedback.recommendation}
            />
          </div>
        </Panel>
      ) : null}

      <HumanInterviews
        applicationId={id}
        interviews={data.humanInterviews ?? []}
      />

      <Panel>
        <PanelHeader title="Decision" />

        {isFinalReview ? (
          <p className="rounded-[18px] bg-ws-card-hover px-4 py-3 text-sm text-ws-muted">
            This application has already been {review.reviewStatus.toLowerCase()}.
          </p>
        ) : (
          <>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
              Decision note
              <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Why this candidate is being approved or turned down." />
            </label>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button disabled={isDeciding} onClick={() => void submit("approve")}><Check aria-hidden="true" className="size-4" />Approve</Button>
              <Button variant="secondary" disabled={isDeciding} onClick={() => void submit("forward")}><Send aria-hidden="true" className="size-4" />Forward to recruiter</Button>
              <Button variant="destructive" disabled={isDeciding} onClick={() => void submit("reject")}><X aria-hidden="true" className="size-4" />Reject</Button>
            </div>
          </>
        )}

        {review?.decisionNote ? (
          <p className="mt-4 rounded-[18px] bg-ws-card-hover px-4 py-3 text-sm leading-6 text-ws-muted">
            Last note: {review.decisionNote}
          </p>
        ) : null}
      </Panel>
    </div>
  );
}

/* --------------------------------------------------- human interviews --- */

function HumanInterviews({
  applicationId,
  interviews,
}: {
  applicationId: number;
  interviews: HumanInterviewResponse[];
}) {
  const [schedule, { isLoading: isScheduling }] =
    useScheduleHumanInterviewMutation();
  const [complete, { isLoading: isCompleting }] =
    useCompleteHumanInterviewMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelHumanInterviewMutation();

  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

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

  const finish = async (interviewId: number, result: InterviewResult) => {
    try {
      await complete({ interviewId, applicationId, body: { result } }).unwrap();
      toast.success(`Interview marked ${humanizeEnum(result).toLowerCase()}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to complete the interview."));
    }
  };

  const drop = async (interviewId: number) => {
    try {
      await cancel({ interviewId, applicationId }).unwrap();
      toast.success("Interview cancelled.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to cancel the interview."));
    }
  };

  const busy = isCompleting || isCancelling;

  return (
    <Panel>
      <PanelHeader
        title={`Human interviews (${interviews.length})`}
        icon={<Video aria-hidden="true" className="size-5" />}
      />

      {interviews.length > 0 ? (
        <ul className="mb-4 flex flex-col gap-2">
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="rounded-[18px] bg-ws-card-hover px-4 py-3.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-semibold text-ws-fg">
                  {formatDateTime(interview.scheduledAt)}
                </span>
                <InterviewStatusChip status={interview.status} />
                <ResultChip result={interview.result} />
              </div>

              {interview.meetingUrl ? (
                <a
                  href={interview.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate text-xs text-primary hover:underline"
                >
                  {interview.meetingUrl}
                </a>
              ) : null}

              {interview.note ? (
                <p className="mt-2 text-sm leading-6 text-ws-muted">
                  {interview.note}
                </p>
              ) : null}

              {/* Only a live interview can still be finished or called off. */}
              {interview.status === "COMPLETED" ||
              interview.status === "CANCELLED" ? null : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "PASSED")}
                  >
                    Passed
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "NEEDS_REVIEW")}
                  >
                    Needs review
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={() => void finish(interview.id, "FAILED")}
                  >
                    Failed
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => void drop(interview.id)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="rounded-[22px] bg-ws-card-hover p-4">
        <p className="text-xs font-medium text-ws-muted">Schedule an interview</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            When (your local time)
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
        </div>
        <Button
          size="sm"
          className="mt-3"
          disabled={isScheduling}
          onClick={() => void book()}
        >
          <CalendarPlus aria-hidden="true" className="size-4" />
          Schedule
        </Button>
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------- pieces --- */

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-sm font-semibold text-ws-fg">
        {orDash(value)}
      </dd>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tabular-nums text-ws-fg">
        {value ?? "—"}
      </p>
    </div>
  );
}

function Prose({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-[18px] bg-ws-card-hover px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-ws-faint">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ws-muted">
        {orDash(value)}
      </p>
    </div>
  );
}
