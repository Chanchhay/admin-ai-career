"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ApplyJobDialogProps = {
  jobTitle: string;
};

export function ApplyJobDialog({ jobTitle }: ApplyJobDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-2">
        <Button type="button" onClick={() => setOpen(true)}>
          Apply as seeker demo
        </Button>
        <Button render={<Link href="/login" />} variant="outline">
          Login to apply
        </Button>
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
                  Static application preview
                </h2>
                <p className="mt-1 text-sm text-body">{jobTitle}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close application preview"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            <form className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-heading">
                Resume ID
                <Input className="mt-1" inputMode="numeric" placeholder="Optional resumeId" />
              </label>
              <label className="block text-sm font-medium text-heading">
                Cover letter
                <Textarea className="mt-1" maxLength={5000} placeholder="Optional coverLetter" />
              </label>
              <div className="rounded-md bg-brand-tint p-3 text-sm text-body">
                <FileText aria-hidden="true" className="mr-2 inline size-4 text-brand" />
                This dialog mirrors `JobApplicationCreateRequest` only. It does not
                submit to a backend.
              </div>
              <Button type="button" className="w-full" disabled>
                Static submit disabled
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
