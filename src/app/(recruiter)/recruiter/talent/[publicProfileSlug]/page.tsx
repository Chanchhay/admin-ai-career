"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  FolderGit2,
  Code2,
  Globe,
  MapPin,
  User,
} from "lucide-react";
import { PageIntro, StatusPill } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ResumeDownloadButton } from "@/components/recruiter/ResumeDownloadButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTalentDetailQuery } from "@/services/recruiterApi";

export default function TalentDetailPage() {
  const { publicProfileSlug } = useParams<{ publicProfileSlug: string }>();
  const talentQuery = useGetTalentDetailQuery(publicProfileSlug);

  if (talentQuery.isLoading) return <LoadingState rows={8} />;
  if (talentQuery.isError || !talentQuery.data) {
    return (
      <div className="space-y-4">
        <Button render={<Link href="/recruiter/talent" />} variant="outline" size="sm" className="rounded-lg">
          <ArrowLeft className="mr-1.5 size-4" /> Back to Talent List
        </Button>
        <ErrorState message="Unable to load this public candidate profile." />
      </div>
    );
  }

  const talentDetail = talentQuery.data;
  const { profile: talent, portfolios, resumes } = talentDetail;

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div>
        <Button
          render={<Link href="/recruiter/talent" />}
          variant="outline"
          size="sm"
          className="mb-4 rounded-xl text-slate-600 border-border"
        >
          <ArrowLeft className="mr-1.5 size-4" />
          Back to Talent Discovery
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">Candidate Profile</span>
            <h1 className="text-3xl font-bold tracking-tight text-heading">{talent.headline || "Public Profile"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {talent.availabilityStatus && <StatusPill>{talent.availabilityStatus}</StatusPill>}
            <StatusPill>{talent.salaryVisibility}</StatusPill>
          </div>
        </div>
      </div>

      {/* Candidate Overview Card */}
      <Card className="overflow-hidden border border-border shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 min-w-0">
              {talent.currentPosition && (
                <p className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <Briefcase className="size-4 text-brand" />
                  {talent.currentPosition}
                </p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                {talent.preferredLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-slate-400" />
                    {talent.preferredLocation}
                  </span>
                )}
                {(talent.expectedSalaryMin || talent.expectedSalaryMax) && (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <DollarSign className="size-4" />
                    Expected Salary: {formatSalaryRange(talent.expectedSalaryMin, talent.expectedSalaryMax, talent.expectedSalaryCurrency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {talent.bio && (
            <div className="rounded-xl border border-border/70 bg-surface-muted/40 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">About Candidate</h4>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {talent.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two Column Layout for Resumes & Portfolios */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Published Resumes Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
              <FileText className="size-5 text-brand" />
              Published Resumes ({resumes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {resumes.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No published resumes available for this candidate.</p>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-heading truncate">{resume.title}</h4>
                        {resume.isDefault && (
                          <span className="rounded bg-brand-tint px-2 py-0.5 text-[10px] font-semibold text-brand">
                            Default
                          </span>
                        )}
                      </div>
                      {resume.publishedAt && (
                        <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Calendar className="size-3" />
                          Published {new Date(resume.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      <ResumeDownloadButton
                        slug={publicProfileSlug}
                        resumeId={resume.id}
                        title={resume.title}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Published Portfolios Card */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/40 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
              <FolderGit2 className="size-5 text-brand" />
              Published Portfolios & Projects ({portfolios.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {portfolios.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No published portfolios available for this candidate.</p>
            ) : (
              <div className="space-y-4">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="rounded-xl border border-border bg-surface p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-heading text-base">{portfolio.title}</h4>
                        {portfolio.summary && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{portfolio.summary}</p>
                        )}
                      </div>
                      {portfolio.publicUrl && (
                        <Button
                          render={<a href={portfolio.publicUrl} target="_blank" rel="noopener noreferrer" />}
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 rounded-lg text-brand"
                        >
                          <Globe className="size-3.5" /> Link
                        </Button>
                      )}
                    </div>

                    {/* Portfolio Projects */}
                    {portfolio.projects && portfolio.projects.length > 0 && (
                      <div className="space-y-2.5 border-t border-border pt-3">
                        <h5 className="text-xs font-semibold uppercase text-slate-500">Featured Projects</h5>
                        {portfolio.projects.map((proj) => (
                          <div key={proj.id} className="rounded-lg border border-border/80 bg-surface-muted/30 p-3 text-xs space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-heading">{proj.title}</span>
                              <div className="flex items-center gap-2">
                                {proj.projectUrl && (
                                  <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline flex items-center gap-0.5">
                                    <ExternalLink className="size-3" /> Live
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-0.5">
                                    <Code2 className="size-3" /> Code
                                  </a>
                                )}
                              </div>
                            </div>
                            {proj.description && <p className="text-slate-600 dark:text-slate-400">{proj.description}</p>}
                            {proj.techStack && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {proj.techStack.split(",").map((tech, i) => (
                                  <span key={i} className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {tech.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatSalaryRange(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return "Not specified";
  const fmt = new Intl.NumberFormat();
  if (min && max) return `${currency} ${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `From ${currency} ${fmt.format(min)}`;
  return `Up to ${currency} ${fmt.format(max!)}`;
}
