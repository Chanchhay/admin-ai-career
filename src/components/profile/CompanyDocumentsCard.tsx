"use client";

import {
  CheckCircle2,
  Clock,
  Download,
  Landmark,
  Receipt,
  ScrollText,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "@/components/layout/SectionCard";
import { cn } from "@/lib/utils";
import type {
  CompanyDocument,
  CompanyDocumentIcon,
  CompanyDocumentStatus,
} from "@/types/profile";

const ICON_MAP: Record<
  CompanyDocumentIcon,
  { icon: typeof ScrollText; tile: string; tint: string }
> = {
  incorporation: {
    icon: ScrollText,
    tile: "bg-rose-50",
    tint: "text-rose-500",
  },
  tax: { icon: Receipt, tile: "bg-slate-100", tint: "text-slate-500" },
  insurance: { icon: Shield, tile: "bg-indigo-50", tint: "text-indigo-500" },
};

function StatusIcon({ status }: { status: CompanyDocumentStatus }) {
  if (status === "EXPIRING") {
    return (
      <Clock
        aria-label="Expiring soon"
        className="size-4.5 shrink-0 text-amber-500"
      />
    );
  }

  if (status === "PENDING") {
    return (
      <Clock
        aria-label="Pending review"
        className="size-4.5 shrink-0 text-slate-400"
      />
    );
  }

  return (
    <CheckCircle2
      aria-label="Verified"
      className="size-4.5 shrink-0 text-brand"
    />
  );
}

export function CompanyDocumentsCard({
  documents,
}: {
  documents: CompanyDocument[];
}) {
  return (
    <SectionCard
      title="Company Documents"
      icon={<Landmark aria-hidden="true" className="size-4 text-brand" />}
      bodyClassName="p-4 sm:p-5"
    >
      <ul className="space-y-2.5">
        {documents.map((doc) => {
          const { icon: Icon, tile, tint } = ICON_MAP[doc.icon];

          return (
            <li key={doc.id}>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors duration-200 hover:border-brand/40">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    tile,
                  )}
                >
                  <Icon aria-hidden="true" className={cn("size-4", tint)} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-heading">
                    {doc.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {doc.subtitle}
                  </p>
                </div>

                <StatusIcon status={doc.status} />

                <button
                  type="button"
                  aria-label={`Download ${doc.title}`}
                  onClick={() => toast(`Downloading ${doc.title}...`)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <Download className="size-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}