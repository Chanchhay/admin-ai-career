"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type {
  AiInterviewQuestionResponse,
  AiInterviewSessionResponse,
} from "@/contracts";
import { PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCompleteAiInterviewMutation,
  useStartAiInterviewMutation,
  useSubmitAiInterviewAnswerMutation,
} from "@/services/jobSeekerApi";

type AiInterviewRunnerProps = {
  session: AiInterviewSessionResponse;
};

const questionTypeLabels: Record<string, string> = {
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SITUATIONAL: "Situational",
  COMMUNICATION: "Communication",
  PROBLEM_SOLVING: "Problem solving",
  GENERAL: "General",
};

function AnswerForm({
  sessionId,
  question,
}: {
  sessionId: number;
  question: AiInterviewQuestionResponse;
}) {
  const [answerText, setAnswerText] = useState("");
  const [submitAnswer, submission] = useSubmitAiInterviewAnswerMutation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answerText.trim()) return;
    try {
      await submitAnswer({
        sessionId,
        questionId: question.id,
        body: { answerText: answerText.trim() },
      }).unwrap();
    } catch {
      toast.error("Unable to save that answer. Try again.");
    }
  };

  return (
    <PlainCard>
      <StatusPill>
        {questionTypeLabels[question.questionType] ?? question.questionType}
      </StatusPill>
      <h2 className="mt-3 text-lg font-semibold leading-7 text-heading">
        {question.questionText}
      </h2>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <label className="block text-sm font-medium text-heading">
          Your answer
          <Textarea
            className="mt-1 min-h-40"
            value={answerText}
            onChange={(event) => setAnswerText(event.target.value)}
            placeholder="Talk through your reasoning, the actions you took, and the outcome."
            required
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-fg">
            Worth up to {question.maxScore} points.
          </p>
          <Button type="submit" disabled={submission.isLoading || !answerText.trim()}>
            {submission.isLoading ? "Saving…" : "Submit answer"}
          </Button>
        </div>
      </form>
    </PlainCard>
  );
}

export function AiInterviewRunner({ session }: AiInterviewRunnerProps) {
  const router = useRouter();
  const [start, starting] = useStartAiInterviewMutation();
  const [complete, completion] = useCompleteAiInterviewMutation();

  const questions = useMemo(
    () => [...(session.questions ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [session.questions],
  );
  const currentQuestion = questions.find((question) => !question.answered);
  const answeredCount = questions.filter((question) => question.answered).length;
  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  if (session.status === "COMPLETED") {
    return (
      <PlainCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 aria-hidden="true" className="size-8 text-brand" />
          <h2 className="text-lg font-semibold text-heading">Interview completed</h2>
          <p className="max-w-md text-sm leading-6 text-body">
            Your answers have been scored. Open the result to see the feedback
            breakdown.
          </p>
          <Button
            type="button"
            onClick={() => router.push(`/job-seeker/interviews/${session.id}/result`)}
          >
            View result
          </Button>
        </div>
      </PlainCard>
    );
  }

  if (session.status === "PREPARING") {
    return (
      <PlainCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Loader2 aria-hidden="true" className="size-8 animate-spin text-brand" />
          <h2 className="text-lg font-semibold text-heading">
            Generating your questions
          </h2>
          <p className="max-w-md text-sm leading-6 text-body">
            The AI is writing interview questions for {session.jobTitle}. This page
            refreshes on its own.
          </p>
        </div>
      </PlainCard>
    );
  }

  if (session.status === "FAILED" || session.status === "CANCELLED") {
    return (
      <PlainCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <StatusPill>{session.status}</StatusPill>
          <p className="max-w-md text-sm leading-6 text-body">
            This interview can no longer be taken. Start a new one from the job
            posting.
          </p>
        </div>
      </PlainCard>
    );
  }

  // READY / PENDING — questions exist but the clock hasn't started.
  if (session.status !== "IN_PROGRESS") {
    return (
      <PlainCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Sparkles aria-hidden="true" className="size-8 text-brand" />
          <h2 className="text-lg font-semibold text-heading">
            {questions.length} questions ready
          </h2>
          <p className="max-w-md text-sm leading-6 text-body">
            Answer each question in your own words. You can take as long as you
            need, and the AI scores everything once you finish.
          </p>
          <Button
            type="button"
            disabled={starting.isLoading}
            onClick={async () => {
              try {
                await start(session.id).unwrap();
              } catch {
                toast.error("Unable to start this interview.");
              }
            }}
          >
            {starting.isLoading ? "Starting…" : "Start interview"}
          </Button>
        </div>
      </PlainCard>
    );
  }

  const finish = async () => {
    try {
      await complete(session.id).unwrap();
      toast.success("Interview submitted for scoring.");
      router.push(`/job-seeker/interviews/${session.id}/result`);
    } catch {
      toast.error("Unable to submit this interview.");
    }
  };

  return (
    <div className="space-y-4">
      <PlainCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-heading">
            Question {Math.min(answeredCount + 1, questions.length)} of{" "}
            {questions.length}
          </p>
          <StatusPill>{progress}% answered</StatusPill>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Interview progress"
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-muted"
        >
          <span
            className="block h-full rounded-full bg-brand transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </PlainCard>

      {currentQuestion ? (
        // Keyed so the draft answer resets when the next question arrives.
        <AnswerForm
          key={currentQuestion.id}
          sessionId={session.id}
          question={currentQuestion}
        />
      ) : (
        <PlainCard>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 aria-hidden="true" className="size-8 text-brand" />
            <h2 className="text-lg font-semibold text-heading">
              All questions answered
            </h2>
            <p className="max-w-md text-sm leading-6 text-body">
              Submit the interview to have the AI score your answers and write
              your feedback.
            </p>
            <Button type="button" onClick={finish} disabled={completion.isLoading}>
              {completion.isLoading ? "Scoring…" : "Finish and get feedback"}
            </Button>
          </div>
        </PlainCard>
      )}

      {answeredCount > 0 ? (
        <PlainCard>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-fg">
            Answered
          </h3>
          <ul className="mt-3 space-y-3">
            {questions
              .filter((question) => question.answered)
              .map((question) => (
                <li key={question.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <p className="text-sm font-medium text-heading">
                    {question.questionText}
                  </p>
                  {question.answer?.answerText ? (
                    <p className="mt-1 text-sm leading-6 text-body">
                      {question.answer.answerText}
                    </p>
                  ) : null}
                </li>
              ))}
          </ul>
        </PlainCard>
      ) : null}
    </div>
  );
}
