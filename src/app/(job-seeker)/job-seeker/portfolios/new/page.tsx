"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PortfolioForm } from "@/components/job-seeker/PortfolioForms";
import { PageIntro } from "@/components/shared/ApiCards";
import { useCreatePortfolioMutation } from "@/services/jobSeekerApi";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [createPortfolio, state] = useCreatePortfolioMutation();
  return <div className="mx-auto max-w-4xl">
    <PageIntro title="Create portfolio" description="Build a focused collection that shows employers what you can do." />
    <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg"><ArrowLeft className="size-4" /> Back to portfolios</button>
    <div className="grid overflow-hidden rounded-[24px] bg-ws-card lg:grid-cols-[0.65fr_1.35fr]">
      <aside className="bg-primary p-7 text-primary-foreground lg:p-9"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><FolderPlus className="size-6" /></span><h2 className="mt-7 text-2xl font-semibold">Show your best work.</h2><p className="mt-3 text-sm leading-6 text-white/75">Start with the portfolio story, then add individual projects with images, links, and technologies.</p><div className="mt-8 flex gap-3 rounded-2xl bg-black/10 p-4 text-sm text-white/85"><Sparkles className="mt-0.5 size-4 shrink-0" /> You can update every detail later.</div></aside>
      <div className="bg-ws-panel p-6 lg:p-9"><PortfolioForm submitLabel="Create portfolio" isSubmitting={state.isLoading} onCancel={() => router.back()} onSubmit={async (body) => { try { const portfolio = await createPortfolio(body).unwrap(); toast.success("Portfolio created"); router.push(`/job-seeker/portfolios/${portfolio.id}`); } catch { toast.error("Could not create portfolio."); } }} /></div>
    </div>
  </div>;
}
