"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, Camera, CheckCircle2, Eye, Loader2, MapPin, Save, ShieldCheck, UserRound, WalletCards, X } from "lucide-react";
import { toast } from "sonner";
import type { JobSeekerProfileResponse, JobSeekerProfileUpdateRequest, SalaryVisibility } from "@/contracts";
import { authClient } from "@/lib/auth-client";
import { PageIntro } from "@/components/shared/ApiCards";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetJobSeekerProfileQuery, useUpdateJobSeekerProfileMutation } from "@/services/jobSeekerApi";

export default function JobSeekerProfilePage() {
  const query = useGetJobSeekerProfileQuery();
  const { data: session } = authClient.useSession();
  if (query.isLoading) return <LoadingState rows={6} />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load your profile." />;
  return <ProfileEditor key={query.data.updatedAt} profile={query.data} name={session?.user.name || session?.user.email || "Job seeker"} image={session?.user.image} />;
}

function ProfileEditor({ profile, name, image }: { profile: JobSeekerProfileResponse; name: string; image?: string | null }) {
  const [values, setValues] = useState<JobSeekerProfileUpdateRequest>({
    headline: profile.headline ?? "", bio: profile.bio ?? "", currentPosition: profile.currentPosition ?? "", expectedSalaryMin: profile.expectedSalaryMin, expectedSalaryMax: profile.expectedSalaryMax, expectedSalaryCurrency: profile.expectedSalaryCurrency || "USD", salaryVisibility: profile.salaryVisibility || "PRIVATE", preferredLocation: profile.preferredLocation ?? "", availabilityStatus: profile.availabilityStatus || "OPEN_TO_WORK",
  });
  const [photoUrl, setPhotoUrl] = useState(image ?? "");
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [updateProfile, state] = useUpdateJobSeekerProfileMutation();
  const set = <K extends keyof JobSeekerProfileUpdateRequest>(key: K, value: JobSeekerProfileUpdateRequest[K]) => setValues((current) => ({ ...current, [key]: value }));
  const completed = [values.headline, values.bio, values.currentPosition, values.preferredLocation, values.availabilityStatus, values.expectedSalaryMin, values.expectedSalaryMax].filter((value) => value !== undefined && value !== "").length;
  const completion = Math.round((completed / 7) * 100);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (values.expectedSalaryMin !== undefined && values.expectedSalaryMax !== undefined && values.expectedSalaryMin > values.expectedSalaryMax) { toast.error("Minimum salary cannot exceed maximum salary."); return; }
    try { await updateProfile(values).unwrap(); toast.success("Profile updated"); } catch { toast.error("Could not update your profile."); }
  }

  async function updatePhoto(url: string) {
    setPhotoSaving(true);
    try {
      const result = await authClient.updateUser({ image: url || null });
      if (result.error) throw new Error(result.error.message);
      setPhotoUrl(url);
      setPhotoEditorOpen(false);
      toast.success(url ? "Profile photo updated" : "Profile photo removed");
    } catch {
      toast.error("Could not update your profile photo.");
    } finally {
      setPhotoSaving(false);
    }
  }

  return <div className="mx-auto max-w-6xl">
    <PageIntro title="My profile" description="Keep your career preferences current so recruiters see the right information." />
    <section className="mb-5 overflow-hidden rounded-[24px] bg-ws-card">
      <div>
      <div className="bg-linear-to-br from-primary/18 via-primary/7 to-transparent p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative shrink-0"><div className="flex size-20 items-center justify-center rounded-full bg-ws-panel bg-cover bg-center text-xl font-bold text-primary ring-4 ring-white/50" style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}>{photoUrl ? <span className="sr-only">Profile photo</span> : initials(name)}</div><button type="button" onClick={() => setPhotoEditorOpen(true)} aria-label="Change profile photo" className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-ws-panel hover:bg-brand-hover"><Camera className="size-4" /></button></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold tracking-tight text-ws-fg">{name}</h2><span className="inline-flex items-center gap-1 rounded-full bg-chip-soft px-2.5 py-1 text-[11px] font-semibold text-chip-soft-fg"><BadgeCheck className="size-3" /> {humanize(profile.verificationStatus)}</span></div><p className="mt-1 font-medium text-primary">{values.headline || "Add your professional headline"}</p><div className="mt-3 flex flex-wrap gap-2"><Chip icon={MapPin}>{values.preferredLocation || "Location not set"}</Chip><Chip icon={BriefcaseBusiness}>{humanize(values.availabilityStatus || "OPEN_TO_WORK")}</Chip><Chip icon={Eye}>{humanize(profile.profileVisibility)} profile</Chip></div></div><div className="w-full rounded-2xl bg-ws-panel/80 p-4 sm:w-48"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-ws-fg">Profile strength</span><span className="text-primary">{completion}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-ws-line"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} /></div><p className="mt-2 text-[11px] text-ws-muted">Complete details to stand out.</p></div></div></div>{photoEditorOpen ? <div className="mt-6 rounded-2xl bg-ws-panel p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-ws-fg">Update profile photo</h3><p className="mt-1 text-xs text-ws-muted">Choose a clear square portrait.</p></div><button type="button" onClick={() => setPhotoEditorOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-ws-muted hover:bg-ws-card"><X className="size-4" /></button></div><FileDropzone value={photoUrl} onChange={(url) => void updatePhoto(url)} accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" hint={photoSaving ? "Saving profile photo…" : "PNG, JPG or WebP up to 5 MB."} /></div> : null}</div>
    </section>

    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-5">
        <FormCard icon={UserRound} title="Professional introduction" description="The first information recruiters see on your profile.">
          <div className="space-y-4"><Field label="Professional headline"><Input value={values.headline} onChange={(e) => set("headline", e.target.value)} placeholder="e.g. Full-stack developer building reliable web products" maxLength={255} /></Field><Field label="About you"><Textarea value={values.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Describe your experience, strengths, and career goals…" maxLength={5000} className="min-h-40" /><p className="mt-1.5 text-right text-xs text-ws-faint">{values.bio?.length ?? 0}/5000</p></Field></div>
        </FormCard>
        <FormCard icon={BriefcaseBusiness} title="Career preferences" description="Help us match you with relevant opportunities.">
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Current position"><Input value={values.currentPosition} onChange={(e) => set("currentPosition", e.target.value)} placeholder="e.g. Software Engineer" maxLength={150} /></Field><Field label="Preferred location"><Input value={values.preferredLocation} onChange={(e) => set("preferredLocation", e.target.value)} placeholder="e.g. Phnom Penh or Remote" maxLength={150} /></Field><Field label="Availability"><NativeSelect value={values.availabilityStatus} onChange={(value) => set("availabilityStatus", value)} options={["OPEN_TO_WORK", "ACTIVELY_LOOKING", "AVAILABLE_SOON", "NOT_LOOKING"]} /></Field></div>
        </FormCard>
      </div>
      <aside className="space-y-5">
        <FormCard icon={WalletCards} title="Salary expectations" description="Set a range and control who can see it.">
          <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="Minimum"><Input type="number" min={0} value={values.expectedSalaryMin ?? ""} onChange={(e) => set("expectedSalaryMin", e.target.value ? Number(e.target.value) : undefined)} placeholder="800" /></Field><Field label="Maximum"><Input type="number" min={0} value={values.expectedSalaryMax ?? ""} onChange={(e) => set("expectedSalaryMax", e.target.value ? Number(e.target.value) : undefined)} placeholder="1500" /></Field></div><Field label="Currency"><Input value={values.expectedSalaryCurrency} onChange={(e) => set("expectedSalaryCurrency", e.target.value.toUpperCase())} placeholder="USD" maxLength={10} /></Field><Field label="Salary visibility"><NativeSelect value={values.salaryVisibility} onChange={(value) => set("salaryVisibility", value as SalaryVisibility)} options={["PRIVATE", "RECRUITERS_ONLY", "PUBLIC"]} /></Field></div>
        </FormCard>
        <section className="rounded-[22px] bg-ws-card p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 text-primary" /><div><h2 className="text-sm font-semibold text-ws-fg">Profile status</h2><p className="mt-1 text-xs leading-5 text-ws-muted">Your profile is {humanize(profile.profileVisibility).toLowerCase()} and {humanize(profile.status).toLowerCase()}.</p></div></div><div className="mt-4 flex items-center gap-2 rounded-xl bg-ws-panel p-3 text-xs text-ws-muted"><CheckCircle2 className="size-4 text-primary" /> Last updated {formatDate(profile.updatedAt)}</div></section>
        <Button type="submit" disabled={state.isLoading} className="h-12 w-full rounded-xl">{state.isLoading ? <Loader2 className="animate-spin" /> : <Save />}{state.isLoading ? "Saving changes…" : "Save profile"}</Button>
      </aside>
    </form>
  </div>;
}

function FormCard({ icon: Icon, title, description, children }: { icon: typeof UserRound; title: string; description: string; children: ReactNode }) { return <section className="rounded-[22px] bg-ws-card p-5 sm:p-6"><div className="mb-5 flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-chip-soft text-chip-soft-fg"><Icon className="size-4.5" /></span><div><h2 className="font-semibold text-ws-fg">{title}</h2><p className="mt-0.5 text-xs leading-5 text-ws-muted">{description}</p></div></div>{children}</section>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label><span className="mb-2 block text-sm font-medium text-ws-fg">{label}</span>{children}</label>; }
function NativeSelect({ value, onChange, options }: { value?: string; onChange: (value: string) => void; options: string[] }) { return <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-md border border-input bg-surface px-3 text-sm text-ws-fg outline-none focus:border-primary focus:ring-3 focus:ring-primary/20">{options.map((option) => <option key={option} value={option}>{humanize(option)}</option>)}</select>; }
function Chip({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) { return <span className="inline-flex items-center gap-1.5 rounded-full bg-ws-panel px-2.5 py-1 text-xs text-ws-muted"><Icon className="size-3.5" />{children}</span>; }
function humanize(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "U"; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "recently" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date); }
