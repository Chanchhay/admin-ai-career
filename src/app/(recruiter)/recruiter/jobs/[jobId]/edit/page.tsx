"use client";

import { useParams } from "next/navigation";
import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { JobForm } from "@/components/recruiter/JobForm";
import { useGetRecruiterJobQuery } from "@/services/recruiterApi";

export default function EditRecruiterJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const jobQuery = useGetRecruiterJobQuery(jobId);

  if (jobQuery.isLoading) return <LoadingState rows={6} />;
  if (jobQuery.isError || !jobQuery.data) {
    return <ErrorState message="Unable to load this job." />;
  }

  return (
    <>
      <PageIntro
        title={`Edit ${jobQuery.data.title}`}
        description="Changes apply immediately, including to published posts."
      />
      <PlainCard>
        <JobForm job={jobQuery.data} />
      </PlainCard>
    </>
  );
}
