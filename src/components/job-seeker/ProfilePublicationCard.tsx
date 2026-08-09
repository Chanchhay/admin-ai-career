"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Globe, Lock, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { JobSeekerProfileResponse, PublicationVisibility } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { useUpdateJobSeekerPublicationMutation } from "@/services/jobSeekerApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/shared/ApiCards";

interface ProfilePublicationCardProps {
  profile: JobSeekerProfileResponse;
}

export function ProfilePublicationCard({ profile }: ProfilePublicationCardProps) {
  const [updatePublication, { isLoading }] = useUpdateJobSeekerPublicationMutation();
  const [copied, setCopied] = useState(false);

  const handleVisibilityChange = async (visibility: PublicationVisibility) => {
    try {
      await updatePublication({ visibility }).unwrap();
      const labels: Record<PublicationVisibility, string> = {
        PUBLIC: "Profile is now public!",
        PRIVATE: "Profile set to private.",
        HIDDEN: "Profile hidden from search.",
      };
      toast.success(labels[visibility]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update profile publication status."));
    }
  };

  const copyPublicLink = () => {
    if (!profile.publicProfileSlug) return;
    const url = `${window.location.origin}/profile/${profile.publicProfileSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Public profile link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPublic = profile.profileVisibility === "PUBLIC";

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardHeader className="bg-surface-muted/50 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
            <Globe className="size-5 text-brand" />
            Profile Visibility & Publishing
          </CardTitle>
          <StatusPill>{profile.profileVisibility}</StatusPill>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleVisibilityChange("PUBLIC")}
            disabled={isLoading}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              profile.profileVisibility === "PUBLIC"
                ? "border-brand bg-brand-tint/40 ring-2 ring-brand/20"
                : "border-border bg-surface hover:border-slate-300"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Globe className="size-4" />
              </span>
              {profile.profileVisibility === "PUBLIC" && (
                <span className="text-xs font-semibold text-brand">Active</span>
              )}
            </div>
            <h4 className="mt-3 font-semibold text-heading">Public</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Visible to all recruiters and employers searching for candidates.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleVisibilityChange("PRIVATE")}
            disabled={isLoading}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              profile.profileVisibility === "PRIVATE"
                ? "border-brand bg-brand-tint/40 ring-2 ring-brand/20"
                : "border-border bg-surface hover:border-slate-300"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Lock className="size-4" />
              </span>
              {profile.profileVisibility === "PRIVATE" && (
                <span className="text-xs font-semibold text-brand">Active</span>
              )}
            </div>
            <h4 className="mt-3 font-semibold text-heading">Private</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Only visible to companies you directly submit job applications to.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleVisibilityChange("HIDDEN")}
            disabled={isLoading}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              profile.profileVisibility === "HIDDEN"
                ? "border-brand bg-brand-tint/40 ring-2 ring-brand/20"
                : "border-border bg-surface hover:border-slate-300"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <EyeOff className="size-4" />
              </span>
              {profile.profileVisibility === "HIDDEN" && (
                <span className="text-xs font-semibold text-brand">Active</span>
              )}
            </div>
            <h4 className="mt-3 font-semibold text-heading">Hidden</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Completely hidden from search results and recruiter candidate lists.
            </p>
          </button>
        </div>

        {!isPublic ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand/20 bg-brand-tint/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-heading">Ready to publish your profile?</h4>
                <p className="text-xs text-slate-600">
                  Publishing makes your profile visible to top recruiters looking for candidates like you.
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleVisibilityChange("PUBLIC")}
              disabled={isLoading}
              className="h-10 rounded-lg px-5 bg-brand hover:bg-brand/90 text-white font-medium shadow-sm"
            >
              {isLoading ? "Publishing…" : "Publish Profile Now"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Your profile is live and published!
                </h4>
              </div>
              {profile.publishedAt && (
                <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                  Published on {new Date(profile.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyPublicLink}
                className="h-9 gap-1.5 rounded-lg border-emerald-200 hover:bg-emerald-100/50 dark:border-emerald-800"
              >
                {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                render={<Link href="/profile" target="_blank" />}
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-lg border-emerald-200 hover:bg-emerald-100/50 dark:border-emerald-800"
              >
                <ExternalLink className="size-3.5" />
                View Public Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
