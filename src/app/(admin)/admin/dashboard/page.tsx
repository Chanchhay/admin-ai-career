"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronRight, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Panel, PanelHeader, Chip, PillTabs } from "@/components/workspace/primitives";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import {
  useApproveCompanyMutation,
  useGetModeratorCompaniesQuery,
  useRejectCompanyMutation,
} from "@/services/adminApi";

const STATUS_FILTERS = [
  { label: "Pending", value: "PENDING_VERIFICATION" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

const statusMap: Record<StatusFilter, string> = {
  PENDING_VERIFICATION: "Pending verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

const chipTone: Record<StatusFilter, "solid" | "soft" | "quiet" | "alert"> = {
  PENDING_VERIFICATION: "soft",
  APPROVED: "solid",
  REJECTED: "alert",
  SUSPENDED: "quiet",
};

function humanizeStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminDashboardPage() {
  useSetPageHeading("Verification queue");

  const [status, setStatus] = useState<StatusFilter>("PENDING_VERIFICATION");
  const { data, isLoading, isError, refetch } = useGetModeratorCompaniesQuery({
    status,
    page: 0,
    size: 12,
  });
  const [approveCompany, { isLoading: isApproving }] = useApproveCompanyMutation();
  const [rejectCompany, { isLoading: isRejecting }] = useRejectCompanyMutation();

  const companies = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;

  const statusSummary = useMemo(
    () => ({
      total: totalCount,
      visible: companies.length,
    }),
    [companies.length, totalCount],
  );

  const handleCompany = async (
    companyId: number,
    action: "approve" | "reject",
  ) => {
    try {
      if (action === "approve") {
        await approveCompany(companyId).unwrap();
        toast.success("Company approved.");
      } else {
        await rejectCompany(companyId).unwrap();
        toast.success("Company rejected.");
      }
      await refetch();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update verification status.";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <Panel tone="soft">
          <PanelHeader
            title="Admin overview"
            icon={<Sparkles aria-hidden="true" className="size-5" />}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Refresh
              </Button>
            }
          />
          <p className="max-w-2xl text-sm leading-6 text-ws-faint">
            Review new verification requests, approve trusted businesses, and keep the employer marketplace safe.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[26px] bg-ws-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ws-faint">
                Current queue
              </p>
              <p className="mt-3 text-4xl font-semibold text-ws-fg">
                {statusSummary.total}
              </p>
              <p className="mt-2 text-sm text-ws-muted">
                {statusMap[status]} companies in the queue.
              </p>
            </div>

            <div className="rounded-[26px] bg-ws-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ws-faint">
                Visible results
              </p>
              <p className="mt-3 text-4xl font-semibold text-ws-fg">
                {statusSummary.visible}
              </p>
              <p className="mt-2 text-sm text-ws-muted">
                Showing {companies.length} of {totalCount} companies.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Filter by status"
            icon={<ShieldCheck aria-hidden="true" className="size-5" />}
          />
          <PillTabs
            tabs={STATUS_FILTERS.map((item) => item.value)}
            value={status}
            onChange={setStatus}
          />
          <div className="mt-4 text-sm text-ws-faint">
            Select a status to review the related verification requests.
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title={statusMap[status]}
          icon={<ShieldCheck aria-hidden="true" className="size-5" />}
        />

        {isLoading ? (
          <LoadingState rows={6} />
        ) : isError ? (
          <ErrorState message="Unable to load verification requests." />
        ) : companies.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-ws-line bg-ws-card px-6 py-10 text-center text-sm text-ws-faint">
            No companies match this status.
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="grid gap-4 rounded-[28px] border border-ws-line bg-ws-card p-5 shadow-sm sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-heading">
                      {company.name}
                    </p>
                    <Chip tone={chipTone[company.verificationStatus] ?? "quiet"}>
                      {humanizeStatus(company.verificationStatus)}
                    </Chip>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ws-faint line-clamp-3">
                    {company.description || "No description provided."}
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-ws-muted">
                        Industry
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ws-fg">
                        {company.industryName || "Unspecified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-ws-muted">
                        Contact
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ws-fg">
                        {company.contactEmail || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={company.verificationStatus === "APPROVED" || isApproving}
                      onClick={() => void handleCompany(company.id, "approve")}
                    >
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={company.verificationStatus === "REJECTED" || isRejecting}
                      onClick={() => void handleCompany(company.id, "reject")}
                    >
                      <XCircle aria-hidden="true" className="size-4" />
                      Reject
                    </Button>
                  </div>

                  <div className="rounded-3xl border border-ws-line bg-ws-card-hover px-3 py-2 text-xs text-ws-muted">
                    <p className="font-semibold text-ws-fg">Details</p>
                    <p className="mt-1 text-xs">
                      {company.websiteUrl || company.address || "No additional details."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
