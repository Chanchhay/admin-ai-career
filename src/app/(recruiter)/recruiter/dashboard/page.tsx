"use client";

import { RecruiterWorkspace } from "@/components/recruiter/workspace/RecruiterWorkspace";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";
import {
  useGetCompanyDocumentsQuery,
  useGetForwardedApplicationsQuery,
  useGetRecruiterCompanyQuery,
  useGetRecruiterJobsQuery,
} from "@/services/recruiterApi";

export default function RecruiterOverviewPage() {
  const currentUserQuery = useGetCurrentUserQuery();
  const companyQuery = useGetRecruiterCompanyQuery();
  const jobsQuery = useGetRecruiterJobsQuery();
  const forwardedQuery = useGetForwardedApplicationsQuery();
  const documentsQuery = useGetCompanyDocumentsQuery(companyQuery.data?.id ?? 0, {
    skip: !companyQuery.data,
  });

  const queries = [
    currentUserQuery,
    companyQuery,
    jobsQuery,
    forwardedQuery,
    documentsQuery,
  ];

  if (queries.some((query) => query.isLoading)) return <LoadingState rows={8} />;
  if (queries.some((query) => query.isError) || !companyQuery.data) {
    return <ErrorState message="Unable to load your workspace." />;
  }

  return (
    <RecruiterWorkspace
      user={currentUserQuery.data}
      company={companyQuery.data}
      jobs={jobsQuery.data ?? []}
      candidates={forwardedQuery.data ?? []}
      documents={documentsQuery.data ?? []}
    />
  );
}
