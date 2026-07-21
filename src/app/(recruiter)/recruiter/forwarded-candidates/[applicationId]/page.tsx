import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { forwardedApplications } from "@/mocks/api";

export function generateStaticParams() {
  return forwardedApplications.map((item) => ({
    applicationId: String(item.application.id),
  }));
}

export default async function ForwardedCandidateDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const forwarded = forwardedApplications.find(
    (item) => item.application.id === Number(applicationId),
  );
  if (!forwarded) notFound();

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
