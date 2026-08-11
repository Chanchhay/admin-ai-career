"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { BriefcaseBusiness, FileText, GraduationCap, Loader2, Save, Sparkles, UserRound } from "lucide-react";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ResumeDetails = {
  profilePhotoUrl: string;
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
};

type ResumeFormProps = {
  mode?: "upload" | "builder" | "all";
  initialTitle?: string;
  initialFileUrl?: string;
  initialResumeData?: Record<string, unknown> | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: { title: string; resumeFileUrl?: string; resumeData: ResumeDetails }) => Promise<void>;
  onCancel?: () => void;
};

export function ResumeForm({
  mode = "all",
  initialTitle = "",
  initialFileUrl = "",
  initialResumeData = {},
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: ResumeFormProps) {
  const savedDetails = initialResumeData ?? {};
  const [title, setTitle] = useState(initialTitle);
  const [resumeFileUrl, setResumeFileUrl] = useState(initialFileUrl);
  const [details, setDetails] = useState<ResumeDetails>({
    profilePhotoUrl: textValue(savedDetails.profilePhotoUrl),
    fullName: textValue(savedDetails.fullName),
    professionalTitle: textValue(savedDetails.professionalTitle),
    email: textValue(savedDetails.email),
    phone: textValue(savedDetails.phone),
    location: textValue(savedDetails.location),
    summary: textValue(savedDetails.summary),
    skills: textValue(savedDetails.skills),
    experience: textValue(savedDetails.experience),
    education: textValue(savedDetails.education),
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Give your resume a name so you can find it later.");
      return;
    }
    if (mode === "upload" && !resumeFileUrl) {
      setError("Upload a PDF resume before continuing.");
      return;
    }

    setError(null);
    await onSubmit({ title: cleanTitle, resumeFileUrl, resumeData: details });
  }

  const updateDetail = (field: keyof ResumeDetails, value: string) =>
    setDetails((current) => ({ ...current, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <FormSection icon={FileText} title={mode === "builder" ? "Resume name" : "Resume document"} description={mode === "builder" ? "Give this resume a clear name so you can find it later." : "Name this version and attach the PDF employers will receive."}>
      <div>
        <label htmlFor="resume-title" className="mb-2 block text-sm font-semibold text-ws-fg">
          Resume name
        </label>
        <div className="relative">
          <FileText aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ws-faint" />
          <Input
            id="resume-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Product Designer — 2026"
            className="h-12 rounded-xl border-ws-line bg-ws-card pl-10 text-ws-fg"
            autoFocus
          />
        </div>
        <p className="mt-2 text-xs text-ws-muted">Use a clear name tailored to the roles you are applying for.</p>
      </div>

      {mode !== "builder" ? <div>
        <p className="mb-2 text-sm font-semibold text-ws-fg">Resume file</p>
        <FileDropzone
          value={resumeFileUrl}
          onChange={setResumeFileUrl}
          accept=".pdf,application/pdf"
          hint="PDF only, up to 5 MB. Your file stays private until you share it."
        />
      </div> : null}
      </FormSection>

      {mode !== "upload" ? <>
      <FormSection icon={UserRound} title="Personal information" description="Help recruiters know who you are and how to reach you.">
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-ws-fg">Profile photo</p>
          <FileDropzone
            value={details.profilePhotoUrl}
            onChange={(url) => updateDetail("profilePhotoUrl", url)}
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            hint="PNG, JPG or WebP up to 5 MB. Use a clear, professional portrait."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required><Input value={details.fullName} onChange={(e) => updateDetail("fullName", e.target.value)} placeholder="Your full name" required /></Field>
          <Field label="Professional title"><Input value={details.professionalTitle} onChange={(e) => updateDetail("professionalTitle", e.target.value)} placeholder="e.g. Frontend Developer" /></Field>
          <Field label="Email address" required><Input type="email" value={details.email} onChange={(e) => updateDetail("email", e.target.value)} placeholder="you@example.com" required /></Field>
          <Field label="Phone number"><Input type="tel" value={details.phone} onChange={(e) => updateDetail("phone", e.target.value)} placeholder="+855 12 345 678" /></Field>
          <Field label="Location" className="sm:col-span-2"><Input value={details.location} onChange={(e) => updateDetail("location", e.target.value)} placeholder="City, country" /></Field>
        </div>
      </FormSection>

      <FormSection icon={Sparkles} title="Professional summary" description="Write a short introduction focused on your value and goals.">
        <Field label="Summary"><Textarea value={details.summary} onChange={(e) => updateDetail("summary", e.target.value)} placeholder="Describe your experience, strengths, and the opportunity you are looking for…" className="min-h-32" maxLength={800} /></Field>
        <p className="mt-2 text-right text-xs text-ws-faint">{details.summary.length}/800</p>
      </FormSection>

      <FormSection icon={BriefcaseBusiness} title="Skills & experience" description="Add the details most relevant to the jobs you want.">
        <div className="space-y-4">
          <Field label="Key skills"><Input value={details.skills} onChange={(e) => updateDetail("skills", e.target.value)} placeholder="React, TypeScript, UI design, communication" /></Field>
          <Field label="Work experience"><Textarea value={details.experience} onChange={(e) => updateDetail("experience", e.target.value)} placeholder="Role, company, dates, and your most important achievements…" className="min-h-36" /></Field>
        </div>
      </FormSection>

      <FormSection icon={GraduationCap} title="Education" description="Include your most relevant degree, course, or certification.">
        <Field label="Education and certifications"><Textarea value={details.education} onChange={(e) => updateDetail("education", e.target.value)} placeholder="Qualification, school, graduation year…" className="min-h-28" /></Field>
      </FormSection>
      </> : null}

      {error ? <p role="alert" className="text-sm font-medium text-destructive">{error}</p> : null}

      <div className="flex flex-col-reverse gap-3 border-t border-ws-line pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl px-5">
          {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ icon: Icon, title, description, children }: { icon: typeof FileText; title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><Icon className="size-4.5" /></span>
        <div><h3 className="font-semibold text-ws-fg">{title}</h3><p className="mt-0.5 text-xs leading-5 text-ws-muted">{description}</p></div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return <label className={className}><span className="mb-2 block text-sm font-medium text-ws-fg">{label}{required ? <span className="ml-1 text-primary">*</span> : null}</span>{children}</label>;
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}
