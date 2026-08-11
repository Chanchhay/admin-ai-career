"use client";

import Link from "next/link";
import { FileText, FolderGit2, Sparkles, UserCheck } from "lucide-react";
import { PageIntro, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ProfileForm } from "@/components/job-seeker/ProfileForm";
import { ProfileHeaderCard } from "@/components/job-seeker/ProfileHeaderCard";
import { ProfilePublicationCard } from "@/components/job-seeker/ProfilePublicationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetJobSeekerProfileQuery } from "@/services/jobSeekerApi";

export default function JobSeekerProfilePage() {
  const profileQuery = useGetJobSeekerProfileQuery();

  if (profileQuery.isLoading) return <LoadingState rows={6} />;
  if (profileQuery.isError || !profileQuery.data) {
    return <ErrorState message="Unable to load your job seeker profile. Please try refreshing." />;
  }

  const profile = profileQuery.data;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageIntro
            eyebrow="Job Seeker Workspace"
            title="Profile & Visibility"
            description="Keep your profile up-to-date and manage how recruiters discover you."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill>{profile.verificationStatus}</StatusPill>
          <StatusPill>{profile.status}</StatusPill>
        </div>
      </div>

      {/* Avatar, identity chips & profile strength */}
      <ProfileHeaderCard profile={profile} />

      {/* Quick shortcuts to Resumes & Portfolios */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border border-border bg-surface shadow-sm transition-all hover:border-brand/30">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <FileText className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">Resumes & CVs</h3>
                <p className="text-xs text-slate-500">Manage uploaded resumes for job applications</p>
              </div>
            </div>
            <Button
              render={<Link href="/job-seeker/resumes" />}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              Manage Resumes
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border bg-surface shadow-sm transition-all hover:border-brand/30">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <FolderGit2 className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-heading">Portfolios & Projects</h3>
                <p className="text-xs text-slate-500">Showcase your featured projects and work</p>
              </div>
            </div>
            <Button
              render={<Link href="/job-seeker/portfolios" />}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              Manage Portfolios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Publication & Visibility Card */}
      <ProfilePublicationCard profile={profile} />

      {/* Profile Edit Form */}
      <ProfileForm profile={profile} />
    </div>
  );
}
