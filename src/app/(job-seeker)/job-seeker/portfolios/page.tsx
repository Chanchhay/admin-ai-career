"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderKanban, FolderPlus, Globe2, Layers3 } from "lucide-react";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetPortfoliosQuery } from "@/services/jobSeekerApi";

export default function PortfoliosPage() {
  const query = useGetPortfoliosQuery();
  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError) return <ErrorState message="Unable to load portfolios." />;
  const portfolios = query.data ?? [];
  return <div className="mx-auto max-w-6xl">
    <PageIntro title="My portfolios" description="Curate projects that make your skills easy to understand." />
    <div className="mb-6 flex flex-col gap-4 rounded-[24px] bg-ws-card p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-4"><span className="flex size-12 items-center justify-center rounded-2xl bg-chip-soft text-chip-soft-fg"><FolderKanban className="size-5" /></span><div><h2 className="font-semibold text-ws-fg">Your work, in one place</h2><p className="mt-1 text-sm text-ws-muted">Create tailored collections for different roles or specialties.</p></div></div><Link href="/job-seeker/portfolios/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"><FolderPlus className="size-4" /> New portfolio</Link></div>
    {portfolios.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{portfolios.map((portfolio) => { const cover = portfolio.projects?.find((project) => project.imageUrl)?.imageUrl; return <Link key={portfolio.id} href={`/job-seeker/portfolios/${portfolio.id}`} className="group overflow-hidden rounded-[22px] bg-ws-card transition hover:-translate-y-0.5 hover:bg-ws-card-hover"><div className="relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-primary/15 to-primary/3">{cover ? <Image src={cover} alt={`${portfolio.title} cover`} fill unoptimized className="object-cover transition duration-300 group-hover:scale-[1.03]" /> : <FolderKanban className="size-12 text-primary/70" />}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="truncate text-lg font-semibold text-ws-fg">{portfolio.title}</h2><ArrowUpRight className="size-4 shrink-0 text-ws-faint transition group-hover:text-primary" /></div><p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-ws-muted">{portfolio.summary || "A collection of selected work and projects."}</p><div className="mt-5 flex items-center gap-4 border-t border-ws-line pt-4 text-xs text-ws-muted"><span className="flex items-center gap-1.5"><Layers3 className="size-3.5" /> {portfolio.projects?.length ?? 0} projects</span><span className="flex items-center gap-1.5 capitalize"><Globe2 className="size-3.5" /> {portfolio.visibility?.toLowerCase()}</span></div></div></Link>; })}</div> : <div className="rounded-[24px] bg-ws-card py-16 text-center"><FolderKanban className="mx-auto size-10 text-ws-faint" /><h2 className="mt-4 font-semibold text-ws-fg">Create your first portfolio</h2><p className="mt-2 text-sm text-ws-muted">Bring your strongest projects together in a professional collection.</p><Link href="/job-seeker/portfolios/new" className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Get started</Link></div>}
  </div>;
}
