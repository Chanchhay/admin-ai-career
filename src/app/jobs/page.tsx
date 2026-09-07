"use client";

import Link from "next/link";
import { useState } from "react";
import { BriefcaseBusiness, ChevronRight, MapPin, Search } from "lucide-react";
import { Pager } from "@/components/console/Pager";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { humanizeEnum, orDash } from "@/lib/format";
import { useGetPublicJobsQuery } from "@/services/jobsApi";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";

export default function JobsPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("Published jobs"));
  const [draftKeyword, setDraftKeyword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, isFetching, isError, refetch } = useGetPublicJobsQuery({
    keyword: keyword || undefined,
    location: location || undefined,
    workMode: workMode || undefined,
    page,
    size: 10,
  });

  const applySearch = () => {
    setKeyword(draftKeyword.trim());
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          {tx(
            "This is the live public catalogue. It shows only jobs candidates can currently discover; job drafting and publishing remain recruiter-owned.",
          )}
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title={tx("{count} published jobs", { count: data?.totalElements ?? 0 })}
          icon={<BriefcaseBusiness aria-hidden="true" className="size-5" />}
        />

        <form
          className="mb-4 grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(160px,.45fr)_160px_auto]"
          onSubmit={(event) => { event.preventDefault(); applySearch(); }}
        >
          <Input
            value={draftKeyword}
            onChange={(event) => setDraftKeyword(event.target.value)}
            placeholder={tx("Search title, company, or description")}
            aria-label={tx("Search jobs")}
          />
          <Input
            value={location}
            onChange={(event) => { setLocation(event.target.value); setPage(0); }}
            placeholder={tx("Location")}
            aria-label={tx("Filter by location")}
          />
          <select
            value={workMode}
            onChange={(event) => { setWorkMode(event.target.value); setPage(0); }}
            aria-label={tx("Filter by work mode")}
            className="h-11 rounded-md border border-input bg-surface px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <option value="">{tx("All work modes")}</option>
            <option value="ONSITE">{tx("Onsite")}</option>
            <option value="REMOTE">{tx("Remote")}</option>
            <option value="HYBRID">{tx("Hybrid")}</option>
          </select>
          <Button type="submit" disabled={isFetching}>
            <Search aria-hidden="true" className="size-4" /> {tx("Search")}
          </Button>
        </form>

        {isLoading ? <LoadingState rows={6} /> : isError ? (
          <ErrorState message={tx("Unable to load published jobs.")} onRetry={refetch} />
        ) : !data?.content.length ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            {tx("No published jobs match these filters.")}
          </p>
        ) : (
          <ul className={isFetching ? "flex flex-col gap-2 opacity-60" : "flex flex-col gap-2"}>
            {data.content.map((job) => (
              <li key={job.id}>
                <Link href={`/jobs/${job.id}`} className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">{job.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-ws-faint">
                      {orDash(job.companyName)} · {orDash(job.categoryName)}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      <GhostChip><MapPin aria-hidden="true" className="size-3" />{orDash(job.location)}</GhostChip>
                      {job.workMode ? <GhostChip>{tx(humanizeEnum(job.workMode))}</GhostChip> : null}
                      {job.jobType ? <GhostChip>{tx(humanizeEnum(job.jobType))}</GhostChip> : null}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ws-faint" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {data ? <Pager page={data} onPageChange={setPage} /> : null}
      </Panel>
    </div>
  );
}
