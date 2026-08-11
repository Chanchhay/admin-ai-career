"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, Code2 as Github, ExternalLink, Globe2, Layers3, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioProjectResponse } from "@/contracts";
import { PortfolioForm, ProjectForm } from "@/components/job-seeker/PortfolioForms";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { useCreatePortfolioProjectMutation, useDeletePortfolioMutation, useDeletePortfolioProjectMutation, useGetPortfolioQuery, useUpdatePortfolioMutation, useUpdatePortfolioProjectMutation } from "@/services/jobSeekerApi";

export default function PortfolioDetailPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const router = useRouter();
  const query = useGetPortfolioQuery(portfolioId);
  const [editingPortfolio, setEditingPortfolio] = useState(false);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProjectResponse | null>(null);
  const [updatePortfolio, updatePortfolioState] = useUpdatePortfolioMutation();
  const [deletePortfolio, deletePortfolioState] = useDeletePortfolioMutation();
  const [createProject, createProjectState] = useCreatePortfolioProjectMutation();
  const [updateProject, updateProjectState] = useUpdatePortfolioProjectMutation();
  const [deleteProject] = useDeletePortfolioProjectMutation();

  if (query.isLoading) return <LoadingState rows={5} />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load this portfolio." />;
  const portfolio = query.data;
  const projects = [...(portfolio.projects ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  async function removePortfolio() {
    if (!window.confirm(`Delete “${portfolio.title}” and all its projects?`)) return;
    try { await deletePortfolio(portfolioId).unwrap(); toast.success("Portfolio deleted"); router.replace("/job-seeker/portfolios"); } catch { toast.error("Could not delete portfolio."); }
  }

  return <div className="mx-auto max-w-6xl">
    <PageIntro title={portfolio.title} description={portfolio.summary || "Manage your portfolio and projects."} />
    <Link href="/job-seeker/portfolios" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-ws-fg"><ArrowLeft className="size-4" /> All portfolios</Link>

    {editingPortfolio ? <Panel title="Edit portfolio" onClose={() => setEditingPortfolio(false)}><PortfolioForm initial={portfolio} submitLabel="Save changes" isSubmitting={updatePortfolioState.isLoading} onCancel={() => setEditingPortfolio(false)} onSubmit={async (body) => { try { await updatePortfolio({ portfolioId, body }).unwrap(); toast.success("Portfolio updated"); setEditingPortfolio(false); } catch { toast.error("Could not update portfolio."); } }} /></Panel> : null}
    {projectFormOpen || editingProject ? <Panel title={editingProject ? "Edit project" : "Add a project"} onClose={() => { setProjectFormOpen(false); setEditingProject(null); }}><ProjectForm initial={editingProject ?? {}} submitLabel={editingProject ? "Save project" : "Add project"} isSubmitting={createProjectState.isLoading || updateProjectState.isLoading} onCancel={() => { setProjectFormOpen(false); setEditingProject(null); }} onSubmit={async (body) => { try { if (editingProject) await updateProject({ portfolioId, projectId: editingProject.id, body }).unwrap(); else await createProject({ portfolioId, body }).unwrap(); toast.success(editingProject ? "Project updated" : "Project added"); setProjectFormOpen(false); setEditingProject(null); } catch { toast.error("Could not save project."); } }} /></Panel> : null}

    <section className="mb-6 overflow-hidden rounded-[24px] bg-ws-card">
      <div className="bg-linear-to-br from-primary/18 via-primary/8 to-transparent p-7 sm:p-9"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-ws-panel px-3 py-1 text-xs font-semibold capitalize text-ws-muted"><Globe2 className="size-3.5" /> {portfolio.visibility?.toLowerCase()}</span><h2 className="mt-5 text-3xl font-semibold tracking-tight text-ws-fg">{portfolio.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ws-muted">{portfolio.summary || "Add a summary to introduce this collection."}</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => setEditingPortfolio(true)} className="rounded-xl"><Pencil /> Edit</Button>{portfolio.publicUrl ? <Button render={<a href={portfolio.publicUrl} target="_blank" rel="noreferrer" />} className="rounded-xl"><ExternalLink /> Visit website</Button> : null}</div></div></div>
    </section>

    <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-ws-fg">Projects</h2><p className="mt-1 text-sm text-ws-muted">{projects.length} {projects.length === 1 ? "project" : "projects"} in this portfolio</p></div><Button onClick={() => setProjectFormOpen(true)} className="rounded-xl"><Plus /> Add project</Button></div>

    {projects.length ? <div className="grid gap-5 md:grid-cols-2">{projects.map((project) => <article key={project.id} className="group overflow-hidden rounded-[22px] bg-ws-card"><div className="relative flex aspect-video items-center justify-center overflow-hidden bg-ws-card-hover">{project.imageUrl ? <Image src={project.imageUrl} alt="" fill unoptimized className="object-cover transition duration-300 group-hover:scale-[1.02]" /> : <Layers3 className="size-10 text-ws-faint" />}</div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-ws-fg">{project.title}</h3>{project.techStack ? <p className="mt-1 text-xs font-medium text-primary">{project.techStack}</p> : null}</div><div className="flex"><button onClick={() => setEditingProject(project)} aria-label={`Edit ${project.title}`} className="flex size-9 items-center justify-center rounded-lg text-ws-muted hover:bg-ws-panel hover:text-ws-fg"><Pencil className="size-4" /></button><button onClick={async () => { if (!window.confirm(`Delete “${project.title}”?`)) return; try { await deleteProject({ portfolioId, projectId: project.id }).unwrap(); toast.success("Project deleted"); } catch { toast.error("Could not delete project."); } }} aria-label={`Delete ${project.title}`} className="flex size-9 items-center justify-center rounded-lg text-ws-muted hover:bg-chip-alert hover:text-chip-alert-fg"><Trash2 className="size-4" /></button></div></div><p className="mt-3 line-clamp-3 text-sm leading-6 text-ws-muted">{project.description || "No project description yet."}</p><div className="mt-5 flex gap-4 border-t border-ws-line pt-4 text-sm font-semibold">{project.projectUrl ? <a href={project.projectUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary"><ExternalLink className="size-4" /> Live project</a> : null}{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-ws-muted hover:text-ws-fg"><Github className="size-4" /> Source</a> : null}</div></div></article>)}</div> : <div className="rounded-[24px] bg-ws-card px-6 py-14 text-center"><Layers3 className="mx-auto size-10 text-ws-faint" /><h3 className="mt-4 font-semibold text-ws-fg">Add your first project</h3><p className="mt-2 text-sm text-ws-muted">Show the problem, your process, and the result.</p><Button onClick={() => setProjectFormOpen(true)} className="mt-5 rounded-xl"><Plus /> Add project</Button></div>}

    <div className="mt-8 flex justify-end border-t border-ws-line pt-6"><Button variant="destructive" onClick={removePortfolio} disabled={deletePortfolioState.isLoading}><Trash2 /> Delete portfolio</Button></div>
  </div>;
}

function Panel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) { return <section className="mb-6 rounded-[24px] bg-ws-card p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-semibold text-ws-fg">{title}</h2><button onClick={onClose} className="text-sm font-medium text-ws-muted hover:text-ws-fg">Close</button></div>{children}</section>; }
