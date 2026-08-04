"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetForwardedApplicationQuery } from "@/services/recruiterApi";

export default function ForwardedCandidateDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const forwardedQuery = useGetForwardedApplicationQuery(applicationId);
  if (forwardedQuery.isLoading) return <LoadingState rows={5} />;
  if (forwardedQuery.isError || !forwardedQuery.data) return <ErrorState message="Unable to load this forwarded candidate." />;
  const forwarded = forwardedQuery.data;

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/forwarded-applications/{applicationId}"
        title={forwarded.candidate.headline}
        description="This forwarded detail may include submitted resume and AI result because forwarding has happened."
      />
      <PlainCard>
        <StatusPill>{forwarded.application.status}</StatusPill>
        <p className="mt-3 text-sm text-slate-600">
          Resume: {forwarded.submittedResume.title}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          AI result: {forwarded.aiResult.feedback.result}, score{" "}
          {forwarded.aiResult.feedback.overallScore}
        </p>
      </PlainCard>
    </>
  );
}
