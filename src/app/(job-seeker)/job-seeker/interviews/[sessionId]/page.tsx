import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { aiInterviews } from "@/mocks/api";

export function generateStaticParams() {
  return aiInterviews.map((interview) => ({ sessionId: String(interview.id) }));
}

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const interview = aiInterviews.find((item) => item.id === Number(sessionId));
  if (!interview) notFound();

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/ai-interviews/{sessionId}"
        title={interview.jobTitle}
        description="Start, answer, and complete actions are static previews here."
        action={<Link className="text-sm font-semibold text-brand" href={`/job-seeker/interviews/${interview.id}/result`}>View result</Link>}
      />
      <div className="grid gap-4">
        {interview.questions.map((question) => (
          <PlainCard key={question.id}>
            <div className="flex justify-between gap-3">
              <h2 className="font-semibold text-heading">{question.questionText}</h2>
              <StatusPill>{question.questionType}</StatusPill>
            </div>
          </PlainCard>
        ))}
      </div>
    </>
  );
}
