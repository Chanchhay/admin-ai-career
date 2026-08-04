"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLazyGetTalentResumeDownloadQuery } from "@/services/recruiterApi";

/** Resolves a short-lived download URL on click, then opens it. */
export function ResumeDownloadButton({
  slug,
  resumeId,
  title,
}: {
  slug: string;
  resumeId: number;
  title: string;
}) {
  const [getDownload, download] = useLazyGetTalentResumeDownloadQuery();

  const onDownload = async () => {
    try {
      const { downloadUrl } = await getDownload({ slug, resumeId }).unwrap();
      if (!downloadUrl) throw new Error("No download URL returned.");
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Unable to download this resume.");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 rounded-lg px-4"
      aria-label={`Download ${title}`}
      disabled={download.isLoading}
      onClick={onDownload}
    >
      <Download aria-hidden="true" className="size-4" />
      {download.isLoading ? "Preparing…" : "Download"}
    </Button>
  );
}
