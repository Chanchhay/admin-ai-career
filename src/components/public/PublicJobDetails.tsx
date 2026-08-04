import Link from "next/link";
import type { ReactNode } from "react";
import { Building2, CalendarDays, MapPin, WalletCards } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/shared/Markdown";
import { ApplyJobDialog } from "./ApplyJobDialog";
import { formatDate, formatEnum, formatSalary } from "./PublicJobCard";

type PublicJobDetailsProps = {
  job: PublicJobResponse;
  relatedJobs: PublicJobResponse[];
};

export function PublicJobDetails({ job, relatedJobs }: PublicJobDetailsProps) {
  const salary = formatSalary(job);
  const sections = job.sections
    .filter((section) => section.contentMarkdown || section.contentText)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-8">
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-brand-tint px-2.5 py-1 text-xs font-semibold text-brand">
                  {job.categoryName}
                </span>
                {[job.jobType, job.workMode].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-body"
                  >
                    {formatEnum(tag)}
                  </span>
                ))}
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 aria-hidden="true" className="size-4 text-brand" />
                  <Link
                    href={`/companies/${job.companyId}`}
                    className="hover:text-brand"
                  >
                    {job.companyName}
                  </Link>
                </span>
                {job.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4 text-muted-fg" />
                    {job.location}
                  </span>
                ) : null}
                {salary ? (
                  <span className="inline-flex items-center gap-1.5">
                    <WalletCards
                      aria-hidden="true"
                      className="size-4 text-muted-fg"
                    />
                    {salary}
                  </span>
                ) : null}
              </div>
            </div>

            <Card>
              <CardContent className="space-y-4 p-5">
                <ApplyJobDialog jobId={job.id} jobTitle={job.title} />
                <dl className="space-y-3 text-sm">
                  <MetaRow label="Published" value={formatDate(job.publishedAt)} />
                  <MetaRow label="Expires" value={formatDate(job.expiredAt)} />
                  <MetaRow
                    label="Experience"
                    value={formatEnum(job.experienceLevel)}
                  />
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0 space-y-5">
          {job.description ? (
            <ContentCard title="Job description">
              <Markdown content={job.description} />
            </ContentCard>
          ) : null}

          {sections.map((section) => (
            <ContentCard key={section.id} title={section.title}>
              {/* Authored as markdown; contentText is only a plain-text mirror. */}
              <Markdown
                content={section.contentMarkdown || section.contentText}
              />
            </ContentCard>
          ))}
        </div>

        <aside className="space-y-5">
          {job.skills.length > 0 ? (
            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold text-heading">Required skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-body"
                    >
                      {skill.skillName}
                      {skill.requiredLevel
                        ? ` · ${formatEnum(skill.requiredLevel)}`
                        : null}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-heading">Related jobs</h2>
              {relatedJobs.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {relatedJobs.map((relatedJob) => (
                    <Link
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.id}`}
                      className="block rounded-md border border-border p-3 text-sm transition hover:border-brand"
                    >
                      <span className="font-medium text-heading">
                        {relatedJob.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-body">
                        <CalendarDays aria-hidden="true" className="size-4" />
                        Expires {formatDate(relatedJob.expiredAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-body">
                  No other openings in this category right now.
                </p>
              )}
              <Button
                render={<Link href="/jobs" />}
                variant="outline"
                className="mt-4 w-full"
              >
                Back to jobs
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-heading">{title}</h2>
        <div className="mt-3">{children}</div>
      </CardContent>
    </Card>
  );
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-fg">{label}</dt>
      <dd className="font-medium text-heading">{value}</dd>
    </div>
  );
}
