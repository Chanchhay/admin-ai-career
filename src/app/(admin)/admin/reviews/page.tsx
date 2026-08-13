"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FileText, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Chip, Panel, PanelHeader, PillTabs } from "@/components/workspace/primitives";
import {
  useApproveCompanyMutation,
  useGetModeratorCompaniesQuery,
  useRejectCompanyMutation,
} from "@/services/adminApi";
import type { CompanyVerificationStatus } from "@/contracts/api/common";

const FILTERS = [
  { label: "Pending", value: "PENDING_VERIFICATION" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
] as const;

const statusMap: Record<CompanyVerificationStatus, string> = {
  PENDING_VERIFICATION: "Pending verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export default function AdminReviewsPage() {
  useSetPageHeading("Verification reviews");

  const [status, setStatus] = useState<CompanyVerificationStatus>("PENDING_VERIFICATION");
  const { data, isLoading, isError, refetch } = useGetModeratorCompaniesQuery({
    status,
    page: 0,
    size: 20,
  });
  const [approveCompany, { isLoading: isApproving }] = useApproveCompanyMutation();
  const [rejectCompany, { isLoading: isRejecting }] = useRejectCompanyMutation();

  const companies = data?.content ?? [];

  const handleDecision = async (companyId: number, action: "approve" | "reject") => {
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
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Panel tone="soft">
          <PanelHeader
            title="Review queue"
            icon={<ShieldCheck aria-hidden="true" className="size-5" />}
            action={
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                Refresh
              </Button>
            }
          />
          <p className="text-sm leading-6 text-ws-faint">
            Review each company application, assess trust signals, and decide whether the business should be approved or rejected.
          </p>
        </Panel>

        <Panel>
          <PanelHeader
            title="Filter by status"
            icon={<Sparkles aria-hidden="true" className="size-5" />}
          />
          <PillTabs
            tabs={FILTERS.map((item) => item.value)}
            value={status}
            onChange={setStatus}
          />
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title={statusMap[status]}
          icon={<FileText aria-hidden="true" className="size-5" />}
        />

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message="Unable to load verification queue." />
        ) : companies.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-ws-line bg-ws-card px-6 py-10 text-center text-sm text-ws-faint">
            No companies match this filter.
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="grid gap-5 rounded-[28px] border border-ws-line bg-ws-card p-5 shadow-sm lg:grid-cols-[minmax(0,1.3fr)_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-ws-fg">{company.name}</h3>
                    <Chip tone={company.verificationStatus === "APPROVED" ? "solid" : company.verificationStatus === "REJECTED" ? "alert" : "soft"}>
                      {humanize(company.verificationStatus)}
                    </Chip>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-ws-faint">
                    {company.description || "No company description provided."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoTile label="Industry" value={company.industryName || "Unspecified"} />
                    <InfoTile label="Email" value={company.contactEmail || "Not available"} />
                    <InfoTile label="Phone" value={company.contactPhone || "Not available"} />
                    <InfoTile label="Website" value={company.websiteUrl || "Not provided"} />
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3">
                  <div className="rounded-3xl border border-ws-line bg-ws-card-hover px-3 py-2 text-xs text-ws-muted">
                    <p className="font-semibold text-ws-fg">Review notes</p>
                    <p className="mt-1 text-xs">
                      {company.address || company.websiteUrl || "No additional details provided."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => void handleDecision(company.id, "approve")}
                      disabled={company.verificationStatus === "APPROVED" || isApproving}
                    >
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void handleDecision(company.id, "reject")}
                      disabled={company.verificationStatus === "REJECTED" || isRejecting}
                    >
                      <XCircle aria-hidden="true" className="size-4" />
                      Reject
                    </Button>
                    <Link href="/admin/approvals" className="inline-flex items-center justify-center rounded-md border border-ws-line px-3 py-2 text-sm font-medium text-ws-fg hover:bg-ws-card-hover">
                      View approvals
                    </Link>
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

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-ws-card p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-ws-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-ws-fg break-words">{value}</p>
    </div>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
