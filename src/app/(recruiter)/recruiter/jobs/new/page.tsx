"use client";

import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { JobForm } from "@/components/recruiter/JobForm";

export default function NewRecruiterJobPage() {
  return (
    <>
      <PageIntro
        title="Create job"
        description="New posts start as a draft. Publish it once the details are right."
      />
      <PlainCard>
        <JobForm />
      </PlainCard>
    </>
  );
}
