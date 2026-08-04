"use client";

import { useParams } from "next/navigation";
import { MetricCard, PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetAiInterviewResultQuery } from "@/services/jobSeekerApi";

export default function InterviewResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const resultQuery = useGetAiInterviewResultQuery(sessionId);
  if (resultQuery.isLoading) return <LoadingState rows={4} />;
  if (resultQuery.isError || !resultQuery.data)
    return (
      <ErrorState
        message="Unable to load this interview result."
        onRetry={() => resultQuery.refetch()}
      />
    );
  const { session, feedback } = resultQuery.data;

  return (
    <>
      <PageIntro
        title={`${session.jobTitle} result`}
        description="How the AI scored your answers, and what to work on next."
      />
      <div className="space-y-4">
        <PlainCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusPill>{feedback.result}</StatusPill>
            <p className="text-sm text-body">
              Overall score{" "}
              <span className="text-lg font-bold text-heading">
                {feedback.overallScore}
              </span>
            </p>
          </div>
          {feedback.recommendation ? (
            <p className="mt-3 text-sm leading-6 text-body">{feedback.recommendation}</p>
          ) : null}
        </PlainCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Technical" value={feedback.technicalScore} />
          <MetricCard label="Communication" value={feedback.communicationScore} />
          <MetricCard label="Problem solving" value={feedback.problemSolvingScore} />
          <MetricCard label="Confidence" value={feedback.confidenceScore} />
        </div>

        {feedback.strengths || feedback.weaknesses ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {feedback.strengths ? (
              <PlainCard>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
                  Strengths
                </h2>
                <p className="mt-2 text-sm leading-6 text-body">{feedback.strengths}</p>
              </PlainCard>
            ) : null}
            {feedback.weaknesses ? (
              <PlainCard>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
                  To improve
                </h2>
                <p className="mt-2 text-sm leading-6 text-body">{feedback.weaknesses}</p>
              </PlainCard>
            ) : null}
          </div>
        ) : null}

        <PlainCard>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
            Answers
          </h2>
          <ul className="mt-3 space-y-4">
            {[...(session.questions ?? [])]
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((question) => (
                <li
                  key={question.id}
                  className="border-t border-border pt-4 first:border-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-heading">
                      {question.questionText}
                    </p>
                    {question.answer ? (
                      <StatusPill>
                        {question.answer.score} / {question.maxScore}
                      </StatusPill>
                    ) : null}
                  </div>
                  {question.answer?.answerText ? (
                    <p className="mt-2 text-sm leading-6 text-body">
                      {question.answer.answerText}
                    </p>
                  ) : null}
                  {question.answer?.feedback ? (
                    <p className="mt-2 rounded-lg bg-surface-muted p-3 text-sm leading-6 text-body">
                      {question.answer.feedback}
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        </PlainCard>
      </div>
    </>
  );
}
