"use client";

import Link from "next/link";
import { PageIntro, PlainCard, PrimaryLink, StatusPill } from "@/components/shared/ApiCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetAiInterviewsQuery } from "@/services/jobSeekerApi";

const continueLabels: Record<string, string> = {
  PREPARING: "Preparing questions…",
  READY: "Ready to start",
  PENDING: "Ready to start",
  IN_PROGRESS: "Continue interview",
  COMPLETED: "View result",
  FAILED: "Interview failed",
  CANCELLED: "Interview cancelled",
};

export default function InterviewsPage() {
  const interviewsQuery = useGetAiInterviewsQuery();
  if (interviewsQuery.isLoading) return <LoadingState rows={5} />;
  if (interviewsQuery.isError)
    return (
      <ErrorState
        message="Unable to load AI interviews."
        onRetry={() => interviewsQuery.refetch()}
      />
    );
  const aiInterviews = interviewsQuery.data ?? [];

  return (
    <>
      <PageIntro
        title="AI interviews"
        description="Practice interviews generated from the jobs you are interested in."
      />
      {aiInterviews.length === 0 ? (
        <EmptyState
          title="No AI interviews yet"
          description="Open a job posting and start a practice interview to see it here."
          action={<PrimaryLink href="/jobs">Browse jobs</PrimaryLink>}
        />
      ) : (
        <div className="grid gap-4">
          {aiInterviews.map((interview) => {
            const href =
              interview.status === "COMPLETED"
                ? `/job-seeker/interviews/${interview.id}/result`
                : `/job-seeker/interviews/${interview.id}`;

            return (
              <Link key={interview.id} href={href} className="block">
                <PlainCard>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold text-heading">{interview.jobTitle}</h2>
                    <StatusPill>{interview.status}</StatusPill>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body">
                    <span>
                      {interview.answeredCount ?? 0} of {interview.questionCount ?? 0}{" "}
                      questions answered
                    </span>
                    {interview.status === "COMPLETED" ? (
                      <span className="font-semibold text-heading">
                        Score {interview.totalScore}
                      </span>
                    ) : null}
                    <span className="font-semibold text-brand">
                      {continueLabels[interview.status] ?? interview.status}
                    </span>
                  </div>
                </PlainCard>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
