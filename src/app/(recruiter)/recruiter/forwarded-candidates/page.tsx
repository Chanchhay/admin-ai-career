import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { forwardedApplications } from "@/mocks/api";

export default function ForwardedCandidatesPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/forwarded-applications"
        title="Forwarded candidates"
        description="Recruiters see private application data only after moderator forwarding."
      />
      <div className="grid gap-4">
        {forwardedApplications.map((item) => (
          <Link
            key={item.application.id}
            href={`/recruiter/forwarded-candidates/${item.application.id}`}
          >
            <PlainCard>
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-heading">
                    {item.candidate.headline}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.application.jobTitle}
                  </p>
                </div>
                <StatusPill>{item.application.status}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
