"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Pause, Play, X } from "lucide-react";
import { toast } from "sonner";
import { jobTone } from "@/components/console/CompanyJobsPanel";
import { JobInterviewQuestionsPanel } from "@/components/console/JobInterviewQuestionsPanel";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Chip,
  GhostChip,
  Panel,
  PanelHeader,
} from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum, orDash } from "@/lib/format";
import { isUuid } from "@/lib/uuid";
import {
  useGetJobQuery,
  useModerateJobMutation,
} from "@/services/moderationApi";

export default function CompanyJobDetailPage() {
  const { companyId, jobId } = useParams<{
    companyId: string;
    jobId: string;
  }>();

  const { data: job, isLoading, isError, refetch } = useGetJobQuery(jobId, {
    skip: !isUuid(jobId),
  });

  useSetPageHeading(job?.title ?? "Job");

  if (isLoading) return <LoadingState rows={6} />;
  if (isError || !job) {
    return <ErrorState message="Unable to load this job." onRetry={refetch} />;
  }

  const sections = [...(job.sections ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/companies/${companyId}`}
          aria-label="Back to the company"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-ws-faint transition-colors hover:bg-ws-card hover:text-ws-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>

        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ws-card text-ws-muted">
          <BriefcaseBusiness aria-hidden="true" className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-3xl font-semibold tracking-tight text-ws-fg">
            {orDash(job.title)}
          </h2>
          <p className="truncate text-base text-ws-faint">
            {orDash(job.companyName)} · {orDash(job.categoryName)}
          </p>
        </div>

        <Chip tone={jobTone[job.status]}>{humanizeEnum(job.status)}</Chip>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-4">
          <JobStatusPanel
            jobId={job.id}
            companyId={companyId}
            status={job.status}
          />

          <Panel variant="outlined">
            <PanelHeader title="Description" />
            <p className="text-base leading-6 whitespace-pre-wrap text-ws-muted">
              {orDash(job.description)}
            </p>
          </Panel>

          {sections.map((section) => (
            <Panel variant="outlined" key={section.id}>
              <PanelHeader
                title={section.title || humanizeEnum(section.sectionType)}
              />
              <p className="text-base leading-6 whitespace-pre-wrap text-ws-muted">
                {section.contentText || section.contentMarkdown}
              </p>
            </Panel>
          ))}

          {/* The interview this job puts candidates through — the questions
              asked before anything the AI writes, and how many of each. */}
          <JobInterviewQuestionsPanel jobId={job.id} />
        </div>

        <aside className="flex flex-col gap-4">
          <Panel variant="outlined">
            <PanelHeader title="Details" />
            <dl className="divide-y divide-ws-line">
              <Row label="Location" value={job.location} />
              <Row label="Work mode" value={humanizeEnum(job.workMode)} />
              <Row label="Job type" value={humanizeEnum(job.jobType)} />
              <Row
                label="Experience"
                value={humanizeEnum(job.experienceLevel)}
              />
              <Row
                label="Published"
                value={job.publishedAt ? formatDateTime(job.publishedAt) : ""}
              />
              <Row
                label="Expires"
                value={job.expiredAt ? formatDateTime(job.expiredAt) : ""}
              />
            </dl>
          </Panel>

          {job.skills.length > 0 ? (
            <Panel variant="outlined">
              <PanelHeader title={`Skills (${job.skills.length})`} />
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <GhostChip key={skill.id}>{skill.skillName}</GhostChip>
                ))}
              </div>
            </Panel>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/**
 * Whether this posting is in front of candidates, and the two moves a
 * moderator has over that.
 *
 * Drafting, editing and publishing stay recruiter-owned; this is only the
 * power to take a live posting down and to put it back, which is why there is
 * nothing here that creates or edits a job.
 */
function JobStatusPanel({
  jobId,
  companyId,
  status,
}: {
  jobId: string;
  companyId: string;
  status: string;
}) {
  const [moderate, { isLoading: busy }] = useModerateJobMutation();
  const [panel, setPanel] = useState<"pause" | "close" | null>(null);
  const [note, setNote] = useState("");

  const live = status === "PUBLISHED";
  const paused = status === "PAUSED";
  const closed = status === "CLOSED" || status === "EXPIRED";

  const run = async (
    action: "pause" | "resume" | "close",
    success: string,
    failure: string,
  ) => {
    // Taking something down owes the recruiter a reason; putting it back does
    // not, which is the rule the company decisions follow too.
    if (action !== "resume" && !note.trim()) {
      toast.error("Explain the decision in the note first.");
      return;
    }

    try {
      await moderate({
        jobId,
        companyId,
        action,
        body: note.trim() ? { decisionNote: note.trim() } : undefined,
      }).unwrap();
      setNote("");
      setPanel(null);
      toast.success(success);
    } catch (error) {
      toast.error(getApiErrorMessage(error, failure));
    }
  };

  return (
    <Panel variant="outlined">
      <PanelHeader title="Visibility to candidates" />

      <p className="text-base leading-6 text-ws-muted">
        {live
          ? "Published — candidates can find and apply to this job."
          : paused
            ? "Paused — candidates cannot see this job. Resuming puts it back."
            : closed
              ? "Closed — this job is finished. Only the recruiter can post a replacement."
              : "Not published. The recruiter publishes their own jobs; there is nothing to take down yet."}
      </p>

      {live || paused || !closed ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {live ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => setPanel(panel === "pause" ? null : "pause")}
            >
              <Pause aria-hidden="true" /> Pause
            </Button>
          ) : paused ? (
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                void run("resume", "Job is live again.", "Unable to resume this job.")
              }
            >
              <Play aria-hidden="true" /> Resume
            </Button>
          ) : null}

          {closed ? null : (
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => setPanel(panel === "close" ? null : "close")}
            >
              <X aria-hidden="true" /> Close
            </Button>
          )}
        </div>
      ) : null}

      {panel ? (
        <div className="mt-3 border-t border-ws-line pt-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ws-muted">
            {panel === "pause"
              ? "Why is this job being taken down?"
              : "Why is this job being closed?"}
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="The recruiter sees this."
            />
          </label>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() =>
                void run(
                  panel,
                  panel === "pause" ? "Job paused." : "Job closed.",
                  panel === "pause"
                    ? "Unable to pause this job."
                    : "Unable to close this job.",
                )
              }
            >
              {panel === "pause" ? "Pause job" : "Close job"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel(null)}>
              Cancel
            </Button>
            {panel === "close" ? (
              <span className="text-sm text-ws-faint">
                Closing cannot be undone from the console.
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <dt className="text-sm text-ws-faint">{label}</dt>
      <dd className="mt-0.5 truncate text-base font-medium text-ws-fg">
        {orDash(value)}
      </dd>
    </div>
  );
}
