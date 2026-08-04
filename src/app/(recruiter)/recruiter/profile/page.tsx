"use client";

import { PageIntro, PlainCard, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { RecruiterProfileForm } from "@/components/recruiter/RecruiterProfileForm";
import { useGetCurrentUserQuery } from "@/services/authApi";

export default function RecruiterProfilePage() {
  const currentUserQuery = useGetCurrentUserQuery();

  if (currentUserQuery.isLoading) return <LoadingState rows={4} />;
  if (currentUserQuery.isError || !currentUserQuery.data) {
    return <ErrorState message="Unable to load your account." />;
  }

  const currentUser = currentUserQuery.data;

  return (
    <>
      <PageIntro
        title="Recruiter profile"
        description="Manage the personal details of the business owner."
      />
      <div className="grid gap-6">
        <PlainCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-heading">
                {currentUser.fullName}
              </h2>
              <p className="mt-1 text-sm text-body">{currentUser.email}</p>
            </div>
            <StatusPill>{currentUser.roles.join(", ")}</StatusPill>
          </div>
        </PlainCard>

        <PlainCard>
          <h2 className="font-semibold text-heading">Recruiter details</h2>
          <p className="mt-1 mb-5 text-sm leading-6 text-body">
            The API has no endpoint to read these back, so the fields start blank
            and saving overwrites whatever is stored.
          </p>
          <RecruiterProfileForm />
        </PlainCard>
      </div>
    </>
  );
}
