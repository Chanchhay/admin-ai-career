"use client";

import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetTalentQuery } from "@/services/recruiterApi";

export default function TalentPage() {
  const talentQuery = useGetTalentQuery({ size: 100 });
  if (talentQuery.isLoading) return <LoadingState rows={5} />;
  if (talentQuery.isError) return <ErrorState message="Unable to load public talent." />;
  const publicTalent = talentQuery.data;

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/talent"
        title="Public talent discovery"
        description="This is separate from private applications. It only shows published job-seeker profile data."
      />
      <div className="grid gap-4">
        {(publicTalent?.content ?? []).map((talent) => (
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
