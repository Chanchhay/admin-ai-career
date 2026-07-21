import { PageIntro, PlainCard } from "@/components/shared/ApiCards";

export default function NewPortfolioPage() {
  return (
    <>
      <PageIntro
        eyebrow="POST /api/v1/job-seeker/portfolios"
        title="New portfolio"
        description="Static form for PortfolioCreateRequest."
      />
      <PlainCard>
        <form className="grid gap-4">
          <input className="h-10 rounded-md border px-3" placeholder="title" />
          <textarea className="min-h-28 rounded-md border px-3 py-2" placeholder="summary" />
          <input className="h-10 rounded-md border px-3" placeholder="publicUrl" />
        </form>
      </PlainCard>
    </>
  );
}
