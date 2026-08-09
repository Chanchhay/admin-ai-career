"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  MapPin,
  Search,
  UserCheck,
  UserRound,
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
import { useGetTalentQuery } from "@/services/recruiterApi";

export default function TalentDiscoveryPage() {
  const [keyword, setKeyword] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<string>("ALL");
  const [page, setPage] = useState(0);

  const talentQuery = useGetTalentQuery({
    keyword: keyword.trim() || undefined,
    preferredLocation: preferredLocation.trim() || undefined,
    availabilityStatus: availabilityStatus !== "ALL" ? availabilityStatus : undefined,
    page,
    size: 10,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const clearFilters = () => {
    setKeyword("");
    setPreferredLocation("");
    setAvailabilityStatus("ALL");
    setPage(0);
  };

  const talentPage = talentQuery.data;
  const talents = talentPage?.content ?? [];
  const totalPages = talentPage?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="GET /api/v1/recruiter/talent"
        title="Talent Discovery"
        description="Explore published job-seeker profiles open for recruitment and candidate sourcing."
      />

      {/* Filter and Search Bar */}
      <Card className="border border-border bg-surface shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Keyword Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search headline, skills, position..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-11 rounded-xl pl-10"
                />
              </div>

              {/* Preferred Location */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Location (e.g. Remote, HCMC)..."
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="h-11 rounded-xl pl-10"
                />
              </div>

              {/* Availability Filter */}
              <div>
                <Select
                  value={availabilityStatus}
                  onValueChange={(val) => {
                    setAvailabilityStatus(val ?? "ALL");
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Availability status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Availability Statuses</SelectItem>
                    <SelectItem value="Actively Looking">Actively Looking</SelectItem>
                    <SelectItem value="Open to Offers">Open to Offers</SelectItem>
                    <SelectItem value="Notice Period Required">Serving Notice Period</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-slate-500">
                {talentPage ? `${talentPage.totalElements} candidate(s) found` : "Searching candidates..."}
              </span>
              <div className="flex items-center gap-2">
                {(keyword || preferredLocation || availabilityStatus !== "ALL") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 rounded-lg text-slate-600"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button type="submit" size="sm" className="h-9 rounded-lg bg-brand px-5 text-white">
                  <Filter className="mr-1.5 size-3.5" />
                  Filter Candidates
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Talent List / States */}
      {talentQuery.isLoading ? (
        <LoadingState rows={6} />
      ) : talentQuery.isError ? (
        <ErrorState message="Unable to load public candidate profiles. Please try again." />
      ) : talents.length === 0 ? (
        <EmptyState
          title="No candidates match your criteria"
          description="Try broadening your search keywords or location filters."
        />
      ) : (
        <div className="grid gap-4">
          {talents.map((talent) => (
            <Card
              key={talent.profileId}
              className="group border border-border bg-surface shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold tracking-tight text-heading group-hover:text-brand">
                        {talent.headline || "Published Candidate"}
                      </h3>
                      {talent.availabilityStatus && (
                        <StatusPill>{talent.availabilityStatus}</StatusPill>
                      )}
                    </div>

                    {talent.currentPosition && (
                      <p className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Briefcase className="size-4 text-slate-400" />
                        {talent.currentPosition}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 pt-1">
                      {talent.preferredLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-brand" />
                          {talent.preferredLocation}
                        </span>
                      )}
                      {talent.expectedSalaryMin || talent.expectedSalaryMax ? (
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3.5 text-emerald-600" />
                          {formatSalaryRange(
                            talent.expectedSalaryMin,
                            talent.expectedSalaryMax,
                            talent.expectedSalaryCurrency
                          )}
                        </span>
                      ) : null}
                    </div>

                    {talent.bio && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {talent.bio}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 pt-2 sm:pt-0">
                    <Button
                      render={<Link href={`/recruiter/talent/${talent.publicProfileSlug}`} />}
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-xl px-5 font-medium border-border hover:border-brand hover:text-brand"
                    >
                      <UserRound className="mr-1.5 size-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-slate-500">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-9 rounded-lg"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 rounded-lg"
                >
                  Next
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatSalaryRange(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return null;
  const fmt = new Intl.NumberFormat();
  if (min && max) return `${currency} ${fmt.format(min)} - ${fmt.format(max)}`;
  if (min) return `From ${currency} ${fmt.format(min)}`;
  return `Up to ${currency} ${fmt.format(max!)}`;
}
