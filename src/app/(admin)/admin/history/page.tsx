"use client";

import { History, ShieldCheck, Sparkles } from "lucide-react";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Chip, Panel, PanelHeader } from "@/components/workspace/primitives";
import { useGetModeratorCompaniesQuery } from "@/services/adminApi";

export default function AdminHistoryPage() {
  useSetPageHeading("Moderation history");

  const { data, isLoading, isError } = useGetModeratorCompaniesQuery({
    page: 0,
    size: 20,
  });

  const companies = data?.content ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-3">
        <StatCard label="Pending" value={countBy("PENDING_VERIFICATION")} tone="soft" />
        <StatCard label="Approved" value={countBy("APPROVED")} tone="solid" />
        <StatCard label="Rejected" value={countBy("REJECTED")} tone="alert" />
      </div>

      <Panel>
        <PanelHeader
          title="Recent moderation actions"
          icon={<History aria-hidden="true" className="size-5" />}
        />

        {isLoading ? (
          <LoadingState rows={6} />
        ) : isError ? (
          <ErrorState message="Unable to load moderation history." />
        ) : companies.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-ws-line bg-ws-card px-6 py-10 text-center text-sm text-ws-faint">
            No moderation activity recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex flex-col gap-3 rounded-[24px] border border-ws-line bg-ws-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-ws-fg">{company.name}</p>
                  <p className="mt-1 text-sm text-ws-faint">
                    {company.industryName || "Industry not specified"} • {company.contactEmail || "No email"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone={company.verificationStatus === "APPROVED" ? "solid" : company.verificationStatus === "REJECTED" ? "alert" : "soft"}>
                    {humanize(company.verificationStatus)}
                  </Chip>
                  <span className="text-xs text-ws-muted">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );

  function countBy(status: string) {
    return companies.filter((company) => company.verificationStatus === status).length;
  }
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "soft" | "solid" | "alert" }) {
  const map = {
    soft: "bg-chip-soft text-chip-soft-fg",
    solid: "bg-chip-solid text-chip-solid-fg",
    alert: "bg-chip-alert text-chip-alert-fg",
  };

  return (
    <div className={`rounded-[26px] p-5 ${map[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">{label}</p>
          <p className="mt-3 text-4xl font-semibold tabular-nums">{value}</p>
        </div>
        {tone === "soft" ? <Sparkles aria-hidden="true" className="size-5" /> : tone === "solid" ? <ShieldCheck aria-hidden="true" className="size-5" /> : <History aria-hidden="true" className="size-5" />}
      </div>
    </div>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
