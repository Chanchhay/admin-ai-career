import { notFound } from "next/navigation";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { PublicJobDetails } from "@/components/public/PublicJobDetails";
import { publicJobs } from "@/mocks/api";

export function generateStaticParams() {
  return publicJobs.map((job) => ({ jobId: String(job.id) }));
}

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = publicJobs.find((item) => item.id === Number(jobId));

  if (!job) notFound();

  const relatedJobs = publicJobs
    .filter((item) => item.id !== job.id && item.categoryId === job.categoryId)
    .slice(0, 3);

  return (
    <PublicShell>
      <main className="pb-12">
        <PublicJobDetails job={job} relatedJobs={relatedJobs} />
      </main>
      <PublicFooter />
    </PublicShell>
  );
}
