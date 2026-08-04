"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageIntro } from "@/components/shared/ApiCards";
import { AiInterviewRunner } from "@/components/job-seeker/AiInterviewRunner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetAiInterviewQuery } from "@/services/jobSeekerApi";

export default function InterviewSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const interviewQuery = useGetAiInterviewQuery(sessionId);
  const interview = interviewQuery.data;

  // Question generation happens server-side. A second subscription to the same
  // cache entry polls it, and only while generation is actually running.
  useGetAiInterviewQuery(sessionId, {
    pollingInterval: 3000,
    skipPollingIfUnfocused: true,
    skip: interview?.status !== "PREPARING",
  });

  if (interviewQuery.isLoading) return <LoadingState rows={5} />;
  if (interviewQuery.isError || !interview)
    return (
      <ErrorState
        message="Unable to load this interview."
        onRetry={() => interviewQuery.refetch()}
      />
    );

  return (
    <>
      <PageIntro
        title={interview.jobTitle}
        description="Answer each question, then submit the interview for AI scoring."
        action={
          interview.status === "COMPLETED" ? (
            <Link
              className="text-sm font-semibold text-brand"
              href={`/job-seeker/interviews/${interview.id}/result`}
            >
              View result
            </Link>
          ) : null
        }
      />
      <AiInterviewRunner session={interview} />
    </>
  );
}
