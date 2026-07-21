import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { recruiterProfile } from "@/mocks/api";

export default function RecruiterProfilePage() {
  return (
    <>
      <PageIntro
        eyebrow="PATCH /api/v1/recruiter/profile"
        title="Recruiter profile"
        description="RecruiterProfileUpdateRequest supports position and linkedinUrl."
      />
      <PlainCard>
        <div className="flex justify-between gap-3">
          <div>
            <h2 className="font-semibold text-heading">{recruiterProfile.position}</h2>
            <p className="mt-1 text-sm text-slate-600">{recruiterProfile.linkedinUrl}</p>
          </div>
          <StatusPill>{recruiterProfile.status}</StatusPill>
        </div>
      </PlainCard>
    </>
  );
}
