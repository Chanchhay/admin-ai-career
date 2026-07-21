import Link from "next/link";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import {
  publicIndustries,
  publicJobCategories,
  publicJobsResponse,
  publicSkills,
} from "@/mocks/api";

export default function PublicJobsPage() {
  const jobs = publicJobsResponse.data.content;

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="GET /api/v1/public/jobs"
          title="Published jobs"
          description="Static mock data follows PublicJobResponse and public lookup endpoints for categories, skills, and industries."
        />
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <PlainCard>
              <p className="text-sm font-semibold text-heading">Categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publicJobCategories.map((category) => (
                  <StatusPill key={category.id}>{category.name}</StatusPill>
                ))}
              </div>
            </PlainCard>
            <PlainCard>
              <p className="text-sm font-semibold text-heading">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publicSkills.map((skill) => (
                  <StatusPill key={skill.id}>{skill.name}</StatusPill>
                ))}
              </div>
            </PlainCard>
            <PlainCard>
              <p className="text-sm font-semibold text-heading">Industries</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {publicIndustries.map((industry) => (
                  <StatusPill key={industry.id}>{industry.name}</StatusPill>
                ))}
              </div>
            </PlainCard>
          </aside>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <PlainCard>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-heading">
                        {job.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {job.companyName} - {job.location}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <StatusPill>{job.jobType}</StatusPill>
                      <StatusPill>{job.workMode}</StatusPill>
                      <StatusPill>{job.experienceLevel}</StatusPill>
                    </div>
                  </div>
                </PlainCard>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
