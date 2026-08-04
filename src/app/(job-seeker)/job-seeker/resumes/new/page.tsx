import { PageIntro, PlainCard } from "@/components/shared/ApiCards";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewResumePage() {
  return (
    <>
      <PageIntro
        eyebrow="POST /api/v1/job-seeker/resumes"
        title="New resume"
        description="ResumeCreateRequest fields: title, resumeFileUrl, and resumeData."
      />
      <PlainCard>
        <form className="grid gap-4">
          <Input placeholder="title" />
          <Input placeholder="resumeFileUrl" />
          <Textarea placeholder="resumeData JSON" />
        </form>
      </PlainCard>
    </>
  );
}
