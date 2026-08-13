"use client";

import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Chip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { useGetModeratorCompaniesQuery } from "@/services/adminApi";

export default function AdminApprovalsPage() {
  useSetPageHeading("Approved companies");

  const { data, isLoading, isError } = useGetModeratorCompaniesQuery({
    status: "APPROVED",
    page: 0,
    size: 20,
  });

  const companies = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <PanelHeader
          title="Approval log"
          icon={<ShieldCheck aria-hidden="true" className="size-5" />}
        />
        <p className="text-sm leading-6 text-ws-faint">
          Companies that have completed moderator review and are now trusted to post jobs on the platform.
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title="Approved companies"
          icon={<CheckCircle2 aria-hidden="true" className="size-5" />}
        />

        {isLoading ? (
          <LoadingState rows={6} />
        ) : isError ? (
          <ErrorState message="Unable to load approved companies." />
        ) : companies.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-ws-line bg-ws-card px-6 py-10 text-center text-sm text-ws-faint">
            No approved companies yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="rounded-[28px] border border-ws-line bg-ws-card p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ws-fg">{company.name}</h3>
                    <p className="mt-1 text-sm text-ws-faint">{company.industryName || "Industry not specified"}</p>
                  </div>
                  <Chip tone="solid">Approved</Chip>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <InfoTile label="Contact" value={company.contactEmail || "Not available"} />
                  <InfoTile label="Website" value={company.websiteUrl || "Not provided"} />
                  <InfoTile label="Address" value={company.address || "Not provided"} />
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
