"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetProfileOverviewQuery } from "@/redux/api/profileApi";
import { CompanyDocumentsCard } from "./CompanyDocumentsCard";
import { ProfessionalIdentityCard } from "./ProfessionalIdentityCard";
import { ProfileHeroCard } from "./ProfileHeaderCard";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { RecruitmentScoreCard } from "./RecruitmentScoreCard";
import { SecuritySettingsCard } from "./SecuritySettingsCard";

export function ProfileView() {
  const { data, isLoading, isError, refetch } = useGetProfileOverviewQuery();
  const [, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-8">
        <ErrorState
          message="We couldn't load your profile."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    toast("Profile editing is coming in the next release.");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileHeroCard profile={data.profile} onEdit={handleEdit} />
        <RecruitmentScoreCard score={data.score} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfessionalIdentityCard profile={data.profile} />
        <SecuritySettingsCard security={data.security} />
      </div>

      <div className="max-w-3xl">
        <CompanyDocumentsCard documents={data.documents} />
      </div>
    </div>
  );
}
