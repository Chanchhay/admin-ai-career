import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { aiInterviews } from "@/mocks/api";

export default function InterviewsPage() {
  return (
    <>
      <PageIntro eyebrow="GET /api/v1/job-seeker/ai-interviews" title="AI interviews" />
      <div className="grid gap-4">
        {aiInterviews.map((interview) => (
          <Link key={interview.id} href={`/job-seeker/interviews/${interview.id}`}>
            <PlainCard>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-heading">{interview.jobTitle}</h2>
                <StatusPill>{interview.status}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
