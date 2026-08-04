"use client";

import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { CircleSlash, Pause, Play, Send } from "lucide-react";
import type { JobPostResponse, JobPostStatus } from "@/contracts";
import { Button } from "@/components/ui/button";
import {
  useCloseJobMutation,
  usePauseJobMutation,
  usePublishJobMutation,
  useResumeJobMutation,
} from "@/services/recruiterApi";

/**
 * Which transitions to offer per status. The backend is the authority — this
 * only hides actions that are obviously unavailable, and surfaces any rejection
 * as a toast.
 */
const allowedFrom: Record<"publish" | "pause" | "resume" | "close", JobPostStatus[]> =
  {
    publish: ["DRAFT", "APPROVED"],
    pause: ["PUBLISHED"],
    resume: ["PAUSED"],
    close: ["PUBLISHED", "PAUSED", "DRAFT", "APPROVED"],
  };

export function JobStatusActions({ job }: { job: JobPostResponse }) {
  const [publishJob, publishing] = usePublishJobMutation();
  const [pauseJob, pausing] = usePauseJobMutation();
  const [resumeJob, resuming] = useResumeJobMutation();
  const [closeJob, closing] = useCloseJobMutation();

  const isBusy =
    publishing.isLoading ||
    pausing.isLoading ||
    resuming.isLoading ||
    closing.isLoading;

  const run = async (
    action: "publish" | "pause" | "resume" | "close",
    trigger: (id: number) => { unwrap: () => Promise<JobPostResponse> },
    message: string,
  ) => {
    try {
      await trigger(job.id).unwrap();
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, `Unable to ${action} this job.`));
    }
  };

  const actions = [
    {
      key: "publish" as const,
      label: "Publish",
      icon: Send,
      run: () => run("publish", publishJob, "Job published."),
    },
    {
      key: "pause" as const,
      label: "Pause",
      icon: Pause,
      run: () => run("pause", pauseJob, "Job paused."),
    },
    {
      key: "resume" as const,
      label: "Resume",
      icon: Play,
      run: () => run("resume", resumeJob, "Job resumed."),
    },
    {
      key: "close" as const,
      label: "Close",
      icon: CircleSlash,
      run: () => run("close", closeJob, "Job closed."),
    },
  ].filter((action) => allowedFrom[action.key].includes(job.status));

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.key}
          type="button"
          variant={action.key === "publish" ? "default" : "outline"}
          className="h-11 rounded-lg px-5"
          disabled={isBusy}
          onClick={action.run}
        >
          <action.icon aria-hidden="true" className="size-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
