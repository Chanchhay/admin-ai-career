"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateAiInterviewForJobMutation } from "@/services/jobSeekerApi";

type StartAiInterviewButtonProps = {
  jobId: number;
};

/**
 * Creates an AI interview session for a posted job and hands the seeker off to
 * the session runner. The backend generates the questions, so the session may
 * still be PREPARING when we arrive — the runner polls from there.
 */
export function StartAiInterviewButton({ jobId }: StartAiInterviewButtonProps) {
  const router = useRouter();
  const [createInterview, creation] = useCreateAiInterviewForJobMutation();

  const start = async () => {
    try {
      const session = await createInterview(jobId).unwrap();
      router.push(`/job-seeker/interviews/${session.id}`);
    } catch {
      toast.error(
        "Unable to start an AI interview. Sign in as a job seeker and try again.",
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={start}
      disabled={creation.isLoading}
    >
      <Sparkles aria-hidden="true" className="size-4" />
      {creation.isLoading ? "Preparing interview…" : "Practice AI interview"}
    </Button>
  );
}
