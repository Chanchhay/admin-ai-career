"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { StartApplicationInterviewButton } from "@/components/job-seeker/StartApplicationInterviewButton";
import { useGetApplicationQuery } from "@/services/jobSeekerApi";

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const applicationQuery = useGetApplicationQuery(applicationId);
  if (applicationQuery.isLoading) return <LoadingState rows={4} />;
  if (applicationQuery.isError || !applicationQuery.data) return <ErrorState message="Unable to load this application." />;
  const application = applicationQuery.data;

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/applications/{applicationId}"
        title={application.jobTitle}
        description="Withdrawal is POST /api/v1/job-seeker/applications/{applicationId}/withdraw."
        action={<StartApplicationInterviewButton applicationId={applicationId} />}
      />
      <PlainCard>
        <StatusPill>{application.status}</StatusPill>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {application.coverLetter}
        </p>
      </PlainCard>
    </>
  );
}
