"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, ChevronRight } from "lucide-react";
import { Pager } from "@/components/console/Pager";
import { CompanyStatusChip } from "@/components/console/StatusChip";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import type { CompanyVerificationStatus } from "@/contracts";
import { orDash } from "@/lib/format";
import { useGetCompaniesQuery } from "@/services/moderationApi";

const TABS = ["Pending", "Approved", "Rejected", "Suspended"] as const;
type Tab = (typeof TABS)[number];

const tabStatus: Record<Tab, CompanyVerificationStatus> = {
  Pending: "PENDING_VERIFICATION",
  Approved: "APPROVED",
  Rejected: "REJECTED",
  Suspended: "SUSPENDED",
};

export default function CompaniesPage() {
  useSetPageHeading("Companies");

  const [tab, setTab] = useState<Tab>("Pending");
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useGetCompaniesQuery({
    verificationStatus: tabStatus[tab],
    page,
  });

  // A tab switch is a different queue, not a different page of the same one.
  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  const companies = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          A recruiter cannot publish a job until their company is approved.
          Open a company to read its registration details and documents before
          deciding.
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title="Verification queue"
          icon={<Building2 aria-hidden="true" className="size-5" />}
        />

        <PillTabs
          tabs={TABS}
          value={tab}
          onChange={selectTab}
          className="mb-4 rounded-full bg-ws-card-hover p-1"
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load companies." onRetry={refetch} />
        ) : companies.length === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            No {tab.toLowerCase()} companies.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {companies.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/companies/${company.id}`}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3.5 transition-colors hover:bg-ws-panel"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ws-fg">
                      {company.name}
                    </span>
                    <span className="block truncate text-xs text-ws-faint">
                      {orDash(company.industryName)} ·{" "}
                      {orDash(company.contactEmail)}
                    </span>
                  </span>

                  <CompanyStatusChip status={company.verificationStatus} />
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ws-faint"
                  />
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
