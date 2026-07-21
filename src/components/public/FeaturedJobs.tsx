import Link from "next/link";
import type { PublicJobResponse } from "@/contracts";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { PublicJobCard } from "./PublicJobCard";

type FeaturedJobsProps = {
  jobs: PublicJobResponse[];
};

export function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  return (
    <section className="bg-canvas py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Recent public jobs"
          description="Every card is rendered from PublicJobResponse fields."
          action={
            <Button render={<Link href="/jobs" />} variant="outline">
              See all jobs
            </Button>
          }
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {jobs.slice(0, 4).map((job) => (
            <PublicJobCard key={job.id} job={job} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
