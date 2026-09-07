"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Building2, Check, Eye, EyeOff, Search } from "lucide-react";
import { toast } from "sonner";
import { Pager } from "@/components/console/Pager";
import { PageSizeSelect } from "@/components/console/PageSizeSelect";
import { CompanyStatusBadge } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  CompanyVerificationStatus,
  ModeratorCompanyListItem,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { orDash } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DEFAULT_PAGE_SIZE,
  useDecideCompanyMutation,
  useGetCompaniesQuery,
  useSetCompanyIdentityVisibilityMutation,
} from "@/services/moderationApi";

const EMPTY: ModeratorCompanyListItem[] = [];

const TABS = ["All", "Pending", "Approved", "Rejected", "Suspended"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, CompanyVerificationStatus | undefined> = {
  All: undefined,
  Pending: "PENDING_VERIFICATION",
  Approved: "APPROVED",
  Rejected: "REJECTED",
  Suspended: "SUSPENDED",
};

/** The dot beside each count, matching the table's status badges. */
const tabDot: Record<Tab, string> = {
  All: "bg-ws-faint",
  Pending: "bg-warning",
  Approved: "bg-brand",
  Rejected: "bg-error",
  Suspended: "bg-error",
};

/** Shared by the header and the body so the columns cannot drift apart. */
const COLUMNS = [
  { key: "company", label: "Company", className: "w-[26%]" },
  { key: "status", label: "Status", className: "w-[12%]" },
  { key: "jobs", label: "Jobs", className: "w-[12%]" },
  { key: "industry", label: "Industry", className: "w-[13%]" },
  { key: "identity", label: "Candidates see", className: "w-[13%]" },
  { key: "actions", label: "", className: "w-[24%]" },
] as const;

export default function CompaniesPage() {
  useSetPageHeading("Companies");

  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = useState("");

  const { data, isLoading, isError, refetch } = useGetCompaniesQuery({
    verificationStatus: tabStatus[tab],
    page,
    size,
  });

  // A tab switch is a different queue, not a further page of the current one.
  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  // Page 4 of 20-row pages is not page 4 of 100-row pages, so resizing starts
  // the queue over rather than landing on an offset the reader did not choose.
  const selectSize = (next: number) => {
    setSize(next);
    setPage(0);
  };

  // A fresh `[]` each render would re-run the filter every time, so the
  // fallback lives on a stable constant rather than inline.
  const companies = data?.content ?? EMPTY;

  // The list endpoint takes no search term, so this narrows what is already on
  // screen rather than pretending to query the whole table.
  const rows = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return companies;
    return companies.filter((company) =>
      `${company.name} ${company.contactEmail} ${company.industryName}`
        .toLowerCase()
        .includes(needle),
    );
  }, [companies, filter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <StatusSummary active={tab} onSelect={selectTab} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
        <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
          <h2 className="font-semibold text-ws-fg">
            {tab === "All" ? "All companies" : `${tab} companies`}
          </h2>

          <div className="relative ml-auto w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ws-faint"
            />
            <Input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Search this page"
              className="pl-9"
            />
          </div>
        </div>

        {/* The scroller is this pane, not the page: the header stays put and
            the footer stays on the bottom edge however many rows there are. */}
        {/* The scroller is this pane, not the page: the toolbar stays put and
            the footer stays on the bottom edge however many rows there are. */}
        <div className="ws-scroll min-h-0 flex-1 overflow-auto border-t border-ws-line">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    /* The fill and the rule live on the cell, not the row: a
                       collapsed border does not travel with a sticky header,
                       so the divider is drawn as an inset shadow instead. */
                    className={`${column.className} bg-ws-card px-4 py-2.5 text-xs font-semibold text-ws-muted shadow-[inset_0_-1px_0_var(--ws-line)]`}
                  >
                    {column.label || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <FullRow>
                  <LoadingState rows={6} />
                </FullRow>
              ) : isError ? (
                <FullRow>
                  <ErrorState
                    message="Unable to load companies."
                    onRetry={refetch}
                  />
                </FullRow>
              ) : rows.length === 0 ? (
                <FullRow>
                  <EmptyState filtered={companies.length > 0} tab={tab} />
                </FullRow>
              ) : (
                rows.map((company) => (
                  <CompanyRow key={company.id} company={company} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-ws-line px-4 py-2.5">
          <PageSizeSelect value={size} onChange={selectSize} />

          {data ? (
            <div className="ml-auto">
              <Pager page={data} onPageChange={setPage} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- summary --- */

/**
 * How the queue stands, and the filter for it — the same control does both, so
 * a count you want to act on is one click from the rows behind it.
 *
 * Each cell is its own `totalElements` read at `size=1`, which is the cheapest
 * count this API can give: there is no summary endpoint, and the alternative
 * is pulling every page to tally it here. They share the `Companies` cache
 * tag, so a decision refreshes the counts and the table together.
 */
function StatusSummary({
  active,
  onSelect,
}: {
  active: Tab;
  onSelect: (tab: Tab) => void;
}) {
  const counts: Record<Tab, number | undefined> = {
    All: useCount(undefined),
    Pending: useCount("PENDING_VERIFICATION"),
    Approved: useCount("APPROVED"),
    Rejected: useCount("REJECTED"),
    Suspended: useCount("SUSPENDED"),
  };

  return (
    <div className="grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-xl border border-ws-line bg-ws-line sm:grid-cols-3 lg:grid-cols-5">
      {TABS.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            aria-pressed={selected}
            className={cn(
              "flex flex-col gap-1 px-4 py-3 text-left transition-colors",
              selected
                ? "bg-ws-card"
                : "bg-ws-panel hover:bg-ws-card/60",
            )}
          >
            <span className="flex items-center gap-2 text-xs font-medium text-ws-muted">
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${tabDot[tab]}`}
              />
              {tab === "All" ? "All companies" : tab}
            </span>
            <span className="text-2xl font-semibold tabular-nums text-ws-fg">
              {counts[tab] === undefined ? "—" : counts[tab]?.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** One count. `size: 1` because only `totalElements` is read from it. */
function useCount(verificationStatus: CompanyVerificationStatus | undefined) {
  const { data } = useGetCompaniesQuery({ verificationStatus, page: 0, size: 1 });
  return data?.totalElements;
}

/* ---------------------------------------------------------------- rows --- */

/** A state that spans the table rather than sitting in one column. */
function FullRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="p-4 align-top">
        {children}
      </td>
    </tr>
  );
}

function CompanyRow({ company }: { company: ModeratorCompanyListItem }) {
  const [decide, { isLoading: isDeciding }] = useDecideCompanyMutation();
  const [setVisibility, { isLoading: isMasking }] =
    useSetCompanyIdentityVisibilityMutation();

  const masked = company.identityVisibility === "MASKED";
  const approved = company.verificationStatus === "APPROVED";
  const logo = resolveFileUrl(company.logoUrl);

  async function approve() {
    try {
      await decide({ companyId: company.id, decision: "approve" }).unwrap();
      toast.success(`${company.name} approved.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to approve this company."));
    }
  }

  async function toggleMask() {
    try {
      await setVisibility({
        companyId: company.id,
        visibility: masked ? "VISIBLE" : "MASKED",
      }).unwrap();
      toast.success(
        masked
          ? "Candidates can see this company again."
          : "This company is now masked to candidates.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to change this setting."));
    }
  }

  return (
    <tr className="border-b border-ws-line/70 transition-colors hover:bg-ws-card/60">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ws-line bg-ws-card text-sm font-semibold text-ws-muted">
            {logo ? (
              /* Backend object storage is not in next.config's remotePatterns. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="size-full object-cover"
              />
            ) : (
              company.name.trim().charAt(0).toUpperCase() || "?"
            )}
          </span>

          <span className="min-w-0">
            <Link
              href={`/companies/${company.id}`}
              className="block truncate font-semibold text-ws-fg hover:underline"
            >
              {company.name}
            </Link>
            <span className="block truncate text-xs text-ws-faint">
              {orDash(company.contactEmail)}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <CompanyStatusBadge status={company.verificationStatus} />
      </td>

      {/* Live first, because that is the number that matters when deciding
          what suspending this company would actually take down. */}
      <td className="px-4 py-3">
        {company.jobCount === 0 ? (
          <span className="text-xs text-ws-faint">None</span>
        ) : (
          <span className="text-sm text-ws-fg">
            <span className="font-medium tabular-nums">
              {company.publishedJobCount}
            </span>{" "}
            live
            <span className="text-ws-faint">
              {" "}
              of {company.jobCount}
            </span>
          </span>
        )}
      </td>

      <td className="truncate px-4 py-3 text-sm text-ws-muted">
        {orDash(company.industryName)}
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-ws-muted">
          {masked ? (
            <EyeOff aria-hidden="true" className="size-4 shrink-0" />
          ) : (
            <Eye aria-hidden="true" className="size-4 shrink-0" />
          )}
          {masked ? "Confidential" : "Real name"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {approved ? null : (
            <Button size="sm" disabled={isDeciding} onClick={() => void approve()}>
              <Check aria-hidden="true" /> Approve
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            disabled={isMasking}
            onClick={() => void toggleMask()}
          >
            {masked ? "Unmask" : "Mask"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            render={<Link href={`/companies/${company.id}`} />}
          >
            Open
          </Button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ filtered, tab }: { filtered: boolean; tab: Tab }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-16 text-center">
      <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-ws-card text-ws-faint">
        <Building2 aria-hidden="true" className="size-5" />
      </span>
      <p className="font-semibold text-ws-fg">
        {filtered
          ? "No companies match that search"
          : `No ${tab === "All" ? "" : tab.toLowerCase()} companies`}
      </p>
      <p className="text-xs text-ws-faint">
        {filtered
          ? "The search only covers the companies loaded on this page."
          : "Companies appear here once a recruiter submits one for verification."}
      </p>
    </div>
  );
}
