"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetResumeQuery } from "@/services/jobSeekerApi";

export default function ResumeDetailPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const resumeQuery = useGetResumeQuery(resumeId);
  if (resumeQuery.isLoading) return <LoadingState rows={4} />;
  if (resumeQuery.isError || !resumeQuery.data) return <ErrorState message="Unable to load this resume." />;
  const resume = resumeQuery.data;

  return (
    <>
      <PageIntro
        eyebrow="GET/PATCH/DELETE /api/v1/job-seeker/resumes/{resumeId}"
        title={resume.title}
        description="Publication action uses PATCH /publication with visibility PUBLIC, PRIVATE, or HIDDEN."
      />
      <PlainCard>
        <StatusPill>{resume.visibility}</StatusPill>
        <p className="mt-3 text-sm text-slate-600">{resume.resumeFileUrl}</p>
      </PlainCard>
    </>
  );
}
