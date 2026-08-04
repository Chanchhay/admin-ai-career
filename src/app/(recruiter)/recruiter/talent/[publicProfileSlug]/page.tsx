"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ResumeDownloadButton } from "@/components/recruiter/ResumeDownloadButton";
import { useGetTalentDetailQuery } from "@/services/recruiterApi";

export default function TalentDetailPage() {
  const { publicProfileSlug } = useParams<{ publicProfileSlug: string }>();
  const talentQuery = useGetTalentDetailQuery(publicProfileSlug);
  if (talentQuery.isLoading) return <LoadingState rows={5} />;
  if (talentQuery.isError || !talentQuery.data) return <ErrorState message="Unable to load this public profile." />;
  const talentDetail = talentQuery.data;
  const { profile: talent, portfolios, resumes } = talentDetail;

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/talent/{publicProfileSlug}"
        title={talent.headline}
        description="Only public profile, published resumes, and published portfolios are shown here."
      />
      <PlainCard>
        <StatusPill>{talent.salaryVisibility}</StatusPill>
        <p className="mt-3 text-sm leading-6 text-slate-600">{talent.bio}</p>
      </PlainCard>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <PlainCard>
          <h2 className="font-semibold text-heading">Published resumes</h2>
          <ul className="mt-3 space-y-3 text-sm text-body">
            {resumes.map((resume) => (
              <li
                key={resume.id}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">{resume.title}</span>
                <ResumeDownloadButton
                  slug={publicProfileSlug}
                  resumeId={resume.id}
                  title={resume.title}
                />
              </li>
            ))}
          </ul>
        </PlainCard>
        <PlainCard>
          <h2 className="font-semibold text-heading">Published portfolios</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {portfolios.map((portfolio) => (
              <li key={portfolio.id}>{portfolio.title}</li>
            ))}
          </ul>
        </PlainCard>
      </div>
    </>
  );
}
