import { PageIntro, PlainCard } from "@/components/shared/ApiCards";

export default function NewRecruiterJobPage() {
  return (
    <>
      <PageIntro
        eyebrow="POST /api/v1/recruiter/jobs"
        title="Create job draft"
        description="JobPostRequest requires title and description, with optional sections and skills."
      />
      <PlainCard>
        <form className="grid gap-4">
          <input className="h-10 rounded-md border px-3" placeholder="title" />
          <textarea className="min-h-28 rounded-md border px-3 py-2" placeholder="description" />
          <input className="h-10 rounded-md border px-3" placeholder="location" />
        </form>
      </PlainCard>
    </>
  );
}
