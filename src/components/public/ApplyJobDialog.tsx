"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApplyToJobMutation } from "@/services/jobSeekerApi";
import { KeycloakLoginButton } from "@/components/auth/AuthActions";
import { StartAiInterviewButton } from "./StartAiInterviewButton";

type ApplyJobDialogProps = {
  jobId: number;
  jobTitle: string;
};

export function ApplyJobDialog({ jobId, jobTitle }: ApplyJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [apply, application] = useApplyToJobMutation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await apply({
        jobId,
        body: {
          resumeId: resumeId ? Number(resumeId) : undefined,
          coverLetter: coverLetter || undefined,
        },
      }).unwrap();
      toast.success("Application submitted.");
      setOpen(false);
    } catch {
      toast.error("Unable to submit the application. Sign in as a job seeker and try again.");
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <Button type="button" onClick={() => setOpen(true)}>
          Apply as job seeker
        </Button>
        <StartAiInterviewButton jobId={jobId} />
        <KeycloakLoginButton variant="ghost">Sign in to apply</KeycloakLoginButton>
      </div>
      {open ? (
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="apply-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-dropdown)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="apply-dialog-title" className="text-lg font-semibold text-heading">
                  Apply for this position
                </h2>
                <p className="mt-1 text-sm text-body">{jobTitle}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close application dialog"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            <form className="mt-5 space-y-4" onSubmit={submit}>
              <label className="block text-sm font-medium text-heading">
                Resume ID
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  value={resumeId}
                  onChange={(event) => setResumeId(event.target.value)}
                  placeholder="Optional resume ID"
                />
              </label>
              <label className="block text-sm font-medium text-heading">
                Cover letter
                <Textarea
                  className="mt-1"
                  maxLength={5000}
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Optional cover letter"
                />
              </label>
              <Button type="submit" className="w-full" disabled={application.isLoading}>
                {application.isLoading ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
