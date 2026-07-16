"use client";

import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "@/components/layout/SectionCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { useGetRequiredDocsQuery } from "@/redux/api/companyApi";

export function RequiredDocsCard() {
  const { data, isLoading, isError, refetch } = useGetRequiredDocsQuery();

  return (
    <SectionCard
      title="Required Docs"
      icon={<FileText aria-hidden="true" className="size-4 text-slate-500" />}
      action={
        <Badge className="border-0 bg-amber-100 text-[10px] uppercase tracking-wider text-amber-700 hover:bg-amber-100">
          Pending
        </Badge>
      }
      bodyClassName="space-y-3 p-4"
    >
      {isLoading ? (
        <>
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </>
      ) : isError || !data ? (
        <ErrorState
          message="Required documents are unavailable."
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <ul className="space-y-2.5">
            {data.map((doc) => (
              <li key={doc.id}>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors duration-200 hover:border-brand/40">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <FileText
                      aria-hidden="true"
                      className="size-4 text-slate-500"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-heading">
                      {doc.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {doc.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Upload ${doc.title}`}
                    onClick={() =>
                      toast(`Upload flow for ${doc.title} is coming soon.`)
                    }
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full text-xs font-semibold"
            onClick={() => toast("Bulk templates will download shortly.")}
          >
            Download Bulk Templates
          </Button>
        </>
      )}
    </SectionCard>
  );
}