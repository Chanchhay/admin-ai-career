"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Bot,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  MapPin,
  Search,
  Sparkles,
  User,
  UsersRound,
} from "lucide-react";
import { PageIntro, StatusPill } from "@/components/shared/ApiCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetForwardedApplicationsQuery } from "@/services/recruiterApi";
import type { JobApplicationStatus } from "@/contracts";

export default function ForwardedCandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const applicationsQuery = useGetForwardedApplicationsQuery();

  if (applicationsQuery.isLoading) return <LoadingState rows={6} />;
  if (applicationsQuery.isError) {
    return <ErrorState message="Unable to load forwarded candidates. Please try again." />;
  }

  const forwardedApplications = applicationsQuery.data ?? [];

  const filteredCandidates = forwardedApplications.filter((item) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.candidate.headline?.toLowerCase().includes(query) ||
      item.candidate.currentPosition?.toLowerCase().includes(query) ||
      item.application.jobTitle?.toLowerCase().includes(query) ||
      item.candidate.preferredLocation?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "ALL" || item.application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="GET /api/v1/recruiter/forwarded-applications"
        title="Forwarded Candidates"
        description="Qualified candidates reviewed and forwarded by moderators after AI evaluation."
      />

      {/* Filter and Search Bar */}
      <Card className="border border-border bg-surface shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search candidates, job title, position, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl pl-10"
              />
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val ?? "ALL")}
              >
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Application status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="AI_INTERVIEW_PASSED">AI Interview Passed</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="HUMAN_INTERVIEW_SCHEDULED">Human Interview Scheduled</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="HIRED">Hired</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-slate-500">
            <span>
              Showing {filteredCandidates.length} of {forwardedApplications.length} candidate(s)
            </span>
            {(search || statusFilter !== "ALL") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="h-7 text-xs text-slate-600"
              >
                Reset filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Candidate List */}
      {filteredCandidates.length === 0 ? (
        <EmptyState
          title="No forwarded candidates found"
          description={
            forwardedApplications.length === 0
              ? "Candidates who pass AI screening and moderator review will appear here."
              : "No candidates match your search filters."
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredCandidates.map((item) => {
            const aiScore = item.aiResult?.feedback?.overallScore;
            const aiResult = item.aiResult?.feedback?.result;

            return (
              <Card
                key={item.application.id}
                className="group border border-border bg-surface shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-lg font-bold tracking-tight text-heading group-hover:text-brand">
                          {item.candidate.headline || "Candidate Profile"}
                        </h3>
                        <StatusPill>{item.application.status}</StatusPill>
                        {item.candidate.availabilityStatus && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.candidate.availabilityStatus}
                          </span>
                        )}
                      </div>

                      {/* Position & Job Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                        {item.candidate.currentPosition && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <User className="size-4 text-slate-400" />
                            {item.candidate.currentPosition}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-brand font-medium">
                          <Briefcase className="size-4" />
                          Applied: {item.application.jobTitle}
                        </span>
                      </div>

                      {/* AI Interview & Resume Highlights */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-slate-500">
                        {item.candidate.preferredLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-slate-400" />
                            {item.candidate.preferredLocation}
                          </span>
                        )}
                        {item.submittedResume?.title && (
                          <span className="flex items-center gap-1">
                            <FileText className="size-3.5 text-brand" />
                            Resume: {item.submittedResume.title}
                          </span>
                        )}
                        {aiScore !== undefined && (
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                            <Sparkles className="size-3.5" />
                            AI Score: {aiScore}/100 ({aiResult || "PASSED"})
                          </span>
                        )}
                        {item.forwardedAt && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="size-3.5" />
                            Forwarded: {new Date(item.forwardedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0">
                      <Button
                        render={
                          <Link
                            href={`/recruiter/forwarded-candidates/${item.application.id}`}
                          />
                        }
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl px-5 font-medium border-border hover:border-brand hover:text-brand"
                      >
                        View Full Details
                        <ChevronRight className="ml-1.5 size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
