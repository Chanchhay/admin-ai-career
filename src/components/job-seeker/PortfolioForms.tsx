"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Code2, ExternalLink, FolderKanban, ImageIcon, Layers3, Loader2, Save } from "lucide-react";
import type { PortfolioCreateRequest, PortfolioProjectRequest } from "@/contracts";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PortfolioForm({ initial = {}, isSubmitting, submitLabel, onSubmit, onCancel }: { initial?: Partial<PortfolioCreateRequest>; isSubmitting?: boolean; submitLabel: string; onSubmit: (body: PortfolioCreateRequest) => Promise<void>; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [summary, setSummary] = useState(initial.summary ?? "");
  const [publicUrl, setPublicUrl] = useState(initial.publicUrl ?? "");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title: title.trim(), summary: summary.trim(), publicUrl: publicUrl.trim() });
  }

  return <form onSubmit={submit} className="space-y-5">
    <Field label="Portfolio title" required><IconInput icon={FolderKanban}><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Product design portfolio" maxLength={150} required /></IconInput></Field>
    <Field label="About this portfolio"><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tell visitors what you do and what this collection represents…" maxLength={5000} className="min-h-32" /></Field>
    <Field label="Public website"><IconInput icon={ExternalLink}><Input type="url" value={publicUrl} onChange={(e) => setPublicUrl(e.target.value)} placeholder="https://yourportfolio.com" maxLength={500} /></IconInput></Field>
    <FormActions isSubmitting={isSubmitting} submitLabel={submitLabel} onCancel={onCancel} />
  </form>;
}

export function ProjectForm({ initial = {}, isSubmitting, submitLabel, onSubmit, onCancel }: { initial?: Partial<PortfolioProjectRequest>; isSubmitting?: boolean; submitLabel: string; onSubmit: (body: PortfolioProjectRequest) => Promise<void>; onCancel?: () => void }) {
  const [values, setValues] = useState<PortfolioProjectRequest>({ title: initial.title ?? "", description: initial.description ?? "", projectUrl: initial.projectUrl ?? "", githubUrl: initial.githubUrl ?? "", imageUrl: initial.imageUrl ?? "", techStack: initial.techStack ?? "", displayOrder: initial.displayOrder ?? 0 });
  const set = <K extends keyof PortfolioProjectRequest>(key: K, value: PortfolioProjectRequest[K]) => setValues((current) => ({ ...current, [key]: value }));

  return <form onSubmit={async (e) => { e.preventDefault(); if (values.title.trim()) await onSubmit({ ...values, title: values.title.trim() }); }} className="space-y-5">
    <Field label="Project cover"><FileDropzone value={values.imageUrl} onChange={(url) => set("imageUrl", url)} accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" hint="PNG, JPG or WebP up to 5 MB." /></Field>
    <Field label="Project title" required><IconInput icon={Layers3}><Input value={values.title} onChange={(e) => set("title", e.target.value)} placeholder="Project name" maxLength={150} required /></IconInput></Field>
    <Field label="Description"><Textarea value={values.description} onChange={(e) => set("description", e.target.value)} placeholder="Explain the problem, your approach, and the outcome…" maxLength={5000} className="min-h-32" /></Field>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Live project URL"><IconInput icon={ExternalLink}><Input type="url" value={values.projectUrl} onChange={(e) => set("projectUrl", e.target.value)} placeholder="https://project.com" /></IconInput></Field>
      <Field label="GitHub URL"><IconInput icon={Code2}><Input type="url" value={values.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" /></IconInput></Field>
    </div>
    <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
      <Field label="Tech stack"><IconInput icon={ImageIcon}><Input value={values.techStack} onChange={(e) => set("techStack", e.target.value)} placeholder="Next.js, TypeScript, PostgreSQL" /></IconInput></Field>
      <Field label="Display order"><Input type="number" min={0} value={values.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} /></Field>
    </div>
    <FormActions isSubmitting={isSubmitting} submitLabel={submitLabel} onCancel={onCancel} />
  </form>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) { return <label><span className="mb-2 block text-sm font-semibold text-ws-fg">{label}{required ? <span className="ml-1 text-primary">*</span> : null}</span>{children}</label>; }
function IconInput({ icon: Icon, children }: { icon: typeof FolderKanban; children: ReactNode }) { return <div className="relative [&_input]:pl-10"><Icon className="absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-ws-faint" />{children}</div>; }
function FormActions({ isSubmitting, submitLabel, onCancel }: { isSubmitting?: boolean; submitLabel: string; onCancel?: () => void }) { return <div className="flex justify-end gap-2 border-t border-ws-line pt-5">{onCancel ? <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button> : null}<Button type="submit" disabled={isSubmitting} className="rounded-xl">{isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}{isSubmitting ? "Saving…" : submitLabel}</Button></div>; }
