"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, FileText, FileUp, PencilLine, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ResumeForm } from "@/components/job-seeker/ResumeForm";
import { PageIntro } from "@/components/shared/ApiCards";
import { useCreateResumeMutation } from "@/services/jobSeekerApi";

export default function NewResumePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"upload" | "builder">("upload");
  const [createResume, createState] = useCreateResumeMutation();

  return (
    <div className="mx-auto max-w-5xl">
      <PageIntro
        title="Add a resume"
        description="Upload a polished PDF and keep it ready for your next application."
      />

      <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg">
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to resumes
      </button>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <ChoiceCard
          active={mode === "upload"}
          icon={FileUp}
          title="Upload a resume"
          description="Use a PDF resume you already have."
          onClick={() => setMode("upload")}
        />
        <ChoiceCard
          active={mode === "builder"}
          icon={PencilLine}
          title="Create a resume"
          description="Complete your information using our default format."
          onClick={() => setMode("builder")}
        />
      </div>

      <div className="grid overflow-hidden rounded-[24px] bg-ws-card lg:grid-cols-[0.52fr_1.48fr]">
        <aside className="bg-primary p-7 text-primary-foreground lg:p-9">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15">{mode === "upload" ? <FileUp className="size-6" /> : <FileText className="size-6" />}</span>
          <h2 className="mt-7 text-2xl font-semibold tracking-tight">{mode === "upload" ? "Upload your finished resume." : "Build your default resume."}</h2>
          <p className="mt-3 text-sm leading-6 text-white/75">{mode === "upload" ? "Add a ready-to-send PDF and use it in job applications." : "Complete each section and we’ll save the information as your resume profile."}</p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-black/10 p-4 text-sm text-white/85">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            <p>PDF files are private by default and only attached when you choose them.</p>
          </div>
        </aside>
        <div className="bg-ws-panel p-6 lg:p-9">
          <ResumeForm
            key={mode}
            mode={mode}
            submitLabel="Add resume"
            isSubmitting={createState.isLoading}
            onCancel={() => router.back()}
            onSubmit={async (values) => {
              try {
                const resume = await createResume(values).unwrap();
                toast.success("Resume added");
                router.push(`/job-seeker/resumes/${resume.id}`);
              } catch {
                toast.error("Could not add your resume. Please try again.");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({ active, icon: Icon, title, description, onClick }: { active: boolean; icon: typeof FileUp; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${active ? "border-primary bg-chip-soft ring-2 ring-primary/10" : "border-ws-line bg-ws-card hover:bg-ws-card-hover"}`}>
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-ws-panel text-ws-muted"}`}><Icon className="size-5" /></span>
      <span className="min-w-0"><span className="block font-semibold text-ws-fg">{title}</span><span className="mt-0.5 block text-xs leading-5 text-ws-muted">{description}</span></span>
      {active ? <Check className="ml-auto size-5 shrink-0 text-primary" /> : null}
    </button>
  );
}
