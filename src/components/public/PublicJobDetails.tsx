import Link from "next/link";
import { Building2, CalendarDays, MapPin, WalletCards } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApplyJobDialog } from "./ApplyJobDialog";
import { formatDate, formatEnum, formatSalary } from "./PublicJobCard";

type PublicJobDetailsProps = {
  job: PublicJobResponse;
  relatedJobs: PublicJobResponse[];
};

export function PublicJobDetails({ job, relatedJobs }: PublicJobDetailsProps) {
  const salary = formatSalary(job);

  return (
    <div className="space-y-8">
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand">
                  {job.categoryName}
                </span>
                <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-body">
                  {formatEnum(job.jobType)}
                </span>
                <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-body">
                  {formatEnum(job.workMode)}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 aria-hidden="true" className="size-4 text-brand" />
                  <Link href={`/companies/${job.companyId}`} className="hover:text-brand">
                    {job.companyName}
                  </Link>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-4 text-muted-fg" />
                  {job.location}
                </span>
                {salary ? (
                  <span className="inline-flex items-center gap-1.5">
                    <WalletCards aria-hidden="true" className="size-4 text-muted-fg" />
                    {salary}
                  </span>
                ) : null}
              </div>
            </div>
            <Card>
              <CardContent className="space-y-4 p-5">
                <ApplyJobDialog jobTitle={job.title} />
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-fg">Published</dt>
                    <dd className="font-medium text-heading">{formatDate(job.publishedAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-fg">Expires</dt>
                    <dd className="font-medium text-heading">{formatDate(job.expiredAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-fg">Experience</dt>
                    <dd className="font-medium text-heading">{formatEnum(job.experienceLevel)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-heading">Job description</h2>
              <p className="mt-3 leading-7 text-body">{job.description}</p>
            </CardContent>
          </Card>
          {job.sections
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((section) => (
              <Card key={section.id}>
                <CardContent className="p-6">
                  <p className="text-xs font-semibold uppercase text-brand">
                    {formatEnum(section.sectionType)}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-heading">{section.title}</h2>
                  <p className="mt-3 leading-7 text-body">{section.contentText}</p>
                </CardContent>
              </Card>
            ))}
        </div>
        <aside className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-heading">Required skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md border border-border px-2.5 py-1 text-xs text-body"
                  >
                    {skill.skillName} · {formatEnum(skill.requiredLevel)}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-heading">Related jobs</h2>
              <div className="mt-4 space-y-3">
                {relatedJobs.map((relatedJob) => (
                  <Link
                    key={relatedJob.id}
                    href={`/jobs/${relatedJob.id}`}
                    className="block rounded-md border border-border p-3 text-sm transition hover:border-brand"
                  >
                    <span className="font-medium text-heading">{relatedJob.title}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-body">
                      <CalendarDays aria-hidden="true" className="size-4" />
                      Expires {formatDate(relatedJob.expiredAt)}
                    </span>
                  </Link>
                ))}
              </div>
              <Button render={<Link href="/jobs" />} variant="outline" className="mt-4 w-full">
                Back to jobs
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
