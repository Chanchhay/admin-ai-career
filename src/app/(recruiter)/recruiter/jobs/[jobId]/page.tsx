"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Markdown } from "@/components/shared/Markdown";
import { JobStatusActions } from "@/components/recruiter/JobStatusActions";
import { useGetRecruiterJobQuery } from "@/services/recruiterApi";

export default function RecruiterJobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const jobQuery = useGetRecruiterJobQuery(jobId);

  if (jobQuery.isLoading) return <LoadingState rows={4} />;
  if (jobQuery.isError || !jobQuery.data) {
    return <ErrorState message="Unable to load this job." />;
  }

  const job = jobQuery.data;

  return (
    <>
      <PageIntro
        title={job.title}
        description={[job.companyName, job.location].filter(Boolean).join(" · ")}
        action={
          <Link
            href={`/recruiter/jobs/${job.id}/edit`}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-body transition-colors hover:border-brand/30 hover:text-brand"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit
          </Link>
        }
      />
      <div className="grid gap-6">
        <PlainCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <StatusPill>{job.status}</StatusPill>
            <JobStatusActions job={job} />
          </div>
          <Markdown className="mt-5" content={job.description} />
        </PlainCard>

        {job.sections
          ?.slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((section) => (
            <PlainCard key={section.id}>
              <h2 className="font-semibold text-heading">{section.title}</h2>
              <Markdown
                className="mt-3"
                content={section.contentMarkdown || section.contentText}
              />
            </PlainCard>
          ))}

        <PlainCard>
          <dl className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Category" value={job.categoryName} />
            <Detail label="Job type" value={job.jobType} />
            <Detail label="Work mode" value={job.workMode} />
            <Detail label="Experience level" value={job.experienceLevel} />
            <Detail
              label="Salary range"
              value={
                job.salaryMin || job.salaryMax
                  ? `${job.salaryMin ?? "—"} – ${job.salaryMax ?? "—"}`
                  : undefined
              }
            />
            <Detail label="Expires on" value={job.expiredAt?.slice(0, 10)} />
          </dl>
        </PlainCard>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-fg">
        {label}
      </dt>
      <dd className="mt-1 text-heading">{value || "—"}</dd>
    </div>
  );
}
