import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { jobSeekerProfile } from "@/mocks/api";

export default function JobSeekerProfilePage() {
  return (
    <>
      <PageIntro
        eyebrow="GET/PATCH /api/v1/job-seeker/profile"
        title="Profile"
        description="Only the job seeker manages this profile and its publication state."
      />
      <PlainCard>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-heading">
              {jobSeekerProfile.headline}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {jobSeekerProfile.bio}
            </p>
          </div>
          <StatusPill>{jobSeekerProfile.profileVisibility}</StatusPill>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-heading">Current position</dt>
            <dd className="text-slate-600">{jobSeekerProfile.currentPosition}</dd>
          </div>
          <div>
            <dt className="font-medium text-heading">Salary visibility</dt>
            <dd className="text-slate-600">{jobSeekerProfile.salaryVisibility}</dd>
          </div>
        </dl>
      </PlainCard>
    </>
  );
}
