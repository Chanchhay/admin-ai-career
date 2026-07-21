import type { PublicJobResponse } from "@/contracts";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PublicJobCard } from "./PublicJobCard";

type PublicJobListProps = {
  jobs: PublicJobResponse[];
  state?: "populated" | "empty" | "loading" | "error";
};

export function PublicJobList({ jobs, state = "populated" }: PublicJobListProps) {
  if (state === "loading") return <LoadingState rows={4} />;

  if (state === "error") {
    return <ErrorState message="Static public job data could not be displayed." />;
  }

  if (state === "empty" || jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        description="Adjust keyword, location, category, skill, work mode, or job type filters."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <PublicJobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
