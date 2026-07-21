import Link from "next/link";
import { Building2 } from "lucide-react";
import type { PublicJobResponse } from "@/contracts";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicJobCard } from "./PublicJobCard";

type PublicCompanySummaryProps = {
  companyId: number;
  jobs: PublicJobResponse[];
};

export function PublicCompanySummary({ companyId, jobs }: PublicCompanySummaryProps) {
  const companyName = jobs[0]?.companyName ?? `Company ${companyId}`;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-border bg-canvas p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Building2 aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-heading">{companyName}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-body">
          There is no dedicated public company detail endpoint. This page only
          shows the company ID, company name, and jobs exposed through public job
          responses.
        </p>
      </section>
      <Card>
        <CardContent className="p-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-fg">Company ID</dt>
              <dd className="mt-1 font-semibold text-heading">{companyId}</dd>
            </div>
            <div>
              <dt className="text-muted-fg">Public jobs found</dt>
              <dd className="mt-1 font-semibold text-heading">{jobs.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <section>
        <SectionHeader
          title="Published jobs from this company"
          description="Only jobs available in public mocks are shown here."
          action={
            <Button render={<Link href="/jobs" />} variant="outline">
              Browse all jobs
            </Button>
          }
        />
        <div className="mt-6 grid gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => <PublicJobCard key={job.id} job={job} compact />)
          ) : (
            <EmptyState
              title="No public jobs for this company"
              description="The company exists only when it appears in PublicJobResponse mock data."
            />
          )}
        </div>
      </section>
    </div>
  );
}
