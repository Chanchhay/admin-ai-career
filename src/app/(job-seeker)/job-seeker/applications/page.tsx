"use client";

import Link from "next/link";
import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetApplicationsQuery } from "@/services/jobSeekerApi";

export default function ApplicationsPage() {
  const applicationsQuery = useGetApplicationsQuery();
  if (applicationsQuery.isLoading) return <LoadingState rows={5} />;
  if (applicationsQuery.isError) return <ErrorState message="Unable to load applications." />;
  const applications = applicationsQuery.data ?? [];

  return (
    <>
      <PageIntro
        eyebrow="GET /api/v1/job-seeker/applications"
        title="Applications"
        description="Job seekers see only their own applications."
      />
      <div className="grid gap-4">
        {applications.map((application) => (
          <Link
            key={application.id}
            href={`/job-seeker/applications/${application.id}`}
          >
            <PlainCard>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-heading">
                  {application.jobTitle}
                </h2>
                <StatusPill>{application.status}</StatusPill>
              </div>
            </PlainCard>
          </Link>
        ))}
      </div>
    </>
  );
}
