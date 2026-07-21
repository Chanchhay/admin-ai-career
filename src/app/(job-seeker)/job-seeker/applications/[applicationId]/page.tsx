import { notFound } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { applications } from "@/mocks/api";

export function generateStaticParams() {
  return applications.map((application) => ({
    applicationId: String(application.id),
  }));
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = applications.find((item) => item.id === Number(applicationId));
  if (!application) notFound();

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/applications/{applicationId}"
        title={application.jobTitle}
        description="Withdrawal is POST /api/v1/job-seeker/applications/{applicationId}/withdraw."
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
