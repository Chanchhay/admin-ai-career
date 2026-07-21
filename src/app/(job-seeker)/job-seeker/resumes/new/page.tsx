import { PageIntro, PlainCard } from "@/components/shared/ApiCards";

export default function NewResumePage() {
  return (
    <>
      <PageIntro
        eyebrow="POST /api/v1/job-seeker/resumes"
        title="New resume"
        description="Static form for ResumeCreateRequest: title, resumeFileUrl, and resumeData."
      />
      <PlainCard>
        <form className="grid gap-4">
          <input className="h-10 rounded-md border px-3" placeholder="title" />
          <input className="h-10 rounded-md border px-3" placeholder="resumeFileUrl" />
          <textarea className="min-h-28 rounded-md border px-3 py-2" placeholder="resumeData JSON" />
        </form>
      </PlainCard>
    </>
  );
}
