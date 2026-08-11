"use client";

import { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Camera, Eye, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import type { JobSeekerProfileResponse } from "@/contracts";
import { authClient } from "@/lib/auth-client";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderCardProps {
  profile: JobSeekerProfileResponse;
}

/** Fields that count toward the profile strength meter. */
const STRENGTH_FIELDS = [
  "headline",
  "bio",
  "currentPosition",
  "preferredLocation",
  "availabilityStatus",
  "expectedSalaryMin",
  "expectedSalaryMax",
] as const satisfies readonly (keyof JobSeekerProfileResponse)[];

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const { data: session } = authClient.useSession();
  const [photoUrl, setPhotoUrl] = useState(session?.user.image ?? "");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const name = session?.user.name || session?.user.email || "Job seeker";

  const completedCount = STRENGTH_FIELDS.filter((field) => {
    const value = profile[field];
    return value !== undefined && value !== null && value !== "";
  }).length;
  const completion = Math.round((completedCount / STRENGTH_FIELDS.length) * 100);

  const updatePhoto = async (url: string) => {
    setIsSaving(true);
    try {
      const result = await authClient.updateUser({ image: url || null });
      if (result.error) throw new Error(result.error.message);
      setPhotoUrl(url);
      setIsEditorOpen(false);
      toast.success(url ? "Profile photo updated" : "Profile photo removed");
    } catch {
      toast.error("Could not update your profile photo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-brand/15 via-brand/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div
                className="flex size-20 items-center justify-center rounded-full bg-surface-muted bg-cover bg-center text-xl font-bold text-brand ring-4 ring-white/50"
                style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
              >
                {photoUrl ? <span className="sr-only">Profile photo</span> : initials(name)}
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                aria-label="Change profile photo"
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-brand text-white shadow-md ring-2 ring-surface hover:bg-brand/90"
              >
                <Camera className="size-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-heading">{name}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand">
                  <BadgeCheck className="size-3" />
                  {humanize(profile.verificationStatus)}
                </span>
              </div>
              <p className="mt-1 font-medium text-brand">
                {profile.headline || "Add your professional headline"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip icon={MapPin}>{profile.preferredLocation || "Location not set"}</Chip>
                <Chip icon={BriefcaseBusiness}>
                  {humanize(profile.availabilityStatus || "OPEN_TO_WORK")}
                </Chip>
                <Chip icon={Eye}>{humanize(profile.profileVisibility)} profile</Chip>
              </div>
            </div>

            <div className="w-full rounded-2xl bg-surface/80 p-4 sm:w-48">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-heading">Profile strength</span>
                <span className="text-brand">{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Complete details to stand out.</p>
            </div>
          </div>

          {isEditorOpen ? (
            <div className="mt-6 rounded-2xl bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-heading">Update profile photo</h3>
                  <p className="mt-1 text-xs text-slate-500">Choose a clear square portrait.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-surface-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
              <FileDropzone
                value={photoUrl}
                onChange={(url) => void updatePhoto(url)}
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                hint={isSaving ? "Saving profile photo…" : "PNG, JPG or WebP up to 5 MB."}
              />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Chip({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs text-slate-600">
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}
