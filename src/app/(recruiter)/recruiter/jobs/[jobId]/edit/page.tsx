import { PageIntro, PlainCard } from "@/components/shared/ApiCards";

export default function EditRecruiterJobPage() {
  return (
    <>
      <PageIntro
        eyebrow="PUT /api/v1/recruiter/jobs/{id}"
        title="Edit job"
        description="Static edit form for JobPostRequest."
      />
      <PlainCard>
        <form className="grid gap-4">
          <input className="h-10 rounded-md border px-3" placeholder="title" />
          <textarea className="min-h-28 rounded-md border px-3 py-2" placeholder="description" />
        </form>
      </PlainCard>
    </>
  );
}
