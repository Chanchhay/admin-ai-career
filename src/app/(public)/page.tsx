import Link from "next/link";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import {
  MetricCard,
  PageIntro,
  PlainCard,
  PrimaryLink,
  StatusPill,
} from "@/components/shared/ApiCards";
import {
  publicIndustries,
  publicJobCategories,
  publicJobs,
  publicSkills,
} from "@/mocks/api";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
            <div>
              <PageIntro
                eyebrow="Public jobs"
                title="Find published jobs and prepare stronger applications."
                description="Browse OpenAPI-shaped static jobs, publish job-seeker materials, and let recruiters discover only the profile, resume, and portfolio details you choose to make public."
                action={<PrimaryLink href="/jobs">Browse jobs</PrimaryLink>}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="Published jobs" value={publicJobs.length} />
                <MetricCard label="Categories" value={publicJobCategories.length} />
                <MetricCard label="Skills" value={publicSkills.length} />
              </div>
            </div>
            <PlainCard>
              <p className="text-sm font-semibold text-heading">Newest jobs</p>
              <div className="mt-4 space-y-3">
                {publicJobs.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block rounded-md border border-slate-200 p-3 hover:border-brand"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-heading">{job.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {job.companyName} - {job.location}
                        </p>
                      </div>
                      <StatusPill>{job.workMode}</StatusPill>
                    </div>
                  </Link>
                ))}
              </div>
            </PlainCard>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <PlainCard>
            <h2 className="font-semibold text-heading">For job seekers</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage your profile, resumes, portfolios, applications, and AI
              interviews. Publication controls use `PUBLIC`, `PRIVATE`, and
              `HIDDEN`.
            </p>
            <div className="mt-4">
              <PrimaryLink href="/job-seeker/dashboard">Open workspace</PrimaryLink>
            </div>
          </PlainCard>
          <PlainCard>
            <h2 className="font-semibold text-heading">For recruiters</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage company verification, company jobs, public talent
              discovery, and forwarded applications only.
            </p>
            <div className="mt-4">
              <PrimaryLink href="/recruiter/dashboard">Open recruiter tools</PrimaryLink>
            </div>
          </PlainCard>
          <PlainCard>
            <h2 className="font-semibold text-heading">Industries</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {publicIndustries.map((industry) => (
                <StatusPill key={industry.id}>{industry.name}</StatusPill>
              ))}
            </div>
          </PlainCard>
        </section>
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
