import Link from "next/link";
import { PageIntro, PlainCard, PrimaryLink, StatusPill } from "@/components/shared/ApiCards";
import { recruiterJobs } from "@/mocks/api";

export default function RecruiterJobsPage() {
  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/recruiter/jobs"
        title="Company jobs"
        description="Recruiters manage their company job posts and can publish, pause, resume, and close supported statuses."
        action={<PrimaryLink href="/recruiter/jobs/new">Create job</PrimaryLink>}
      />
      <div className="grid gap-4">
        {recruiterJobs.map((job) => (
          <Link key={job.id} href={`/recruiter/jobs/${job.id}`}>
            <PlainCard>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-heading">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{job.categoryName}</p>
                </div>
                <StatusPill>{job.status}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
