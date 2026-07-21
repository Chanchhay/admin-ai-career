import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { publicTalent } from "@/mocks/api";

export default function TalentPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/talent"
        title="Public talent discovery"
        description="This is separate from private applications. It only shows published job-seeker profile data."
      />
      <div className="grid gap-4">
        {publicTalent.map((talent) => (
          <Link key={talent.profileId} href={`/recruiter/talent/${talent.publicProfileSlug}`}>
            <PlainCard>
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-heading">{talent.headline}</h2>
                  <p className="mt-1 text-sm text-slate-600">{talent.currentPosition}</p>
                </div>
                <StatusPill>{talent.availabilityStatus}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
