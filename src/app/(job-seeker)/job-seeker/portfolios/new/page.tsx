import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewPortfolioPage() {
  return (
    <>
      <PageIntro
        eyebrow="POST /api/v1/job-seeker/portfolios"
        title="New portfolio"
        description="PortfolioCreateRequest fields."
      />
      <PlainCard>
        <form className="grid gap-4">
          <Input placeholder="title" />
          <Textarea placeholder="summary" />
          <Input placeholder="publicUrl" />
        </form>
      </PlainCard>
    </>
  );
}
