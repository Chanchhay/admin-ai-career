import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { aiInterviewResult } from "@/mocks/api";

export default function InterviewResultPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/ai-interviews/{sessionId}/result"
        title={`${aiInterviewResult.session.jobTitle} result`}
      />
      <PlainCard>
        <StatusPill>{aiInterviewResult.feedback.result}</StatusPill>
        <p className="mt-3 text-sm text-slate-600">
          Overall score: {aiInterviewResult.feedback.overallScore}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {aiInterviewResult.feedback.recommendation}
        </p>
      </PlainCard>
    </>
  );
}
