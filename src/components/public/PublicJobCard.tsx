import Link from "next/link";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PublicJobCardProps = {
  job: PublicJobResponse;
  compact?: boolean;
  className?: string;
};

function formatEnum(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatSalary(job: PublicJobResponse) {
  if (!job.salaryMin && !job.salaryMax) return null;
  return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
}

export function PublicJobCard({ job, compact = false, className }: PublicJobCardProps) {
  const salary = formatSalary(job);

  return (
    <Card
      className={cn(
        "group border-border transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-dropdown)]",
        className,
      )}
    >
      <CardContent className={cn("p-5", compact ? "space-y-3" : "space-y-4")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Link
              href={`/jobs/${job.id}`}
              className="text-lg font-semibold text-heading outline-none transition hover:text-brand focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
            >
              {job.title}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-body">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness aria-hidden="true" className="size-4 text-brand" />
                {job.companyName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 text-muted-fg" />
                {job.location}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <span className="rounded-md bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand">
              {formatEnum(job.jobType)}
            </span>
            <span className="rounded-md bg-surface-muted px-2.5 py-1 text-xs font-medium text-body">
              {formatEnum(job.workMode)}
            </span>
          </div>
        </div>

        {!compact ? (
          <p className="line-clamp-2 text-sm leading-6 text-body">{job.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-border px-2.5 py-1 text-xs text-body">
            {job.categoryName}
          </span>
          {job.skills.slice(0, compact ? 2 : 4).map((skill) => (
            <span
              key={skill.id}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-body"
            >
              {skill.skillName}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-body sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {salary ? <span className="font-semibold text-heading">{salary}</span> : null}
            <span>{formatEnum(job.experienceLevel)}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4 text-muted-fg" />
              Expires {formatDate(job.expiredAt)}
            </span>
          </div>
          <Button render={<Link href={`/jobs/${job.id}`} />} variant="outline" size="sm">
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { formatDate, formatEnum, formatSalary };
