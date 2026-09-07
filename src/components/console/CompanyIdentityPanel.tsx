"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Building2, Eye, EyeOff, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import type { CompanyIdentityVisibility } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { resolveFileUrl } from "@/lib/file-url";
import { uploadFile, validateImage } from "@/lib/upload-file";
import { cn } from "@/lib/utils";
import {
  useSetCompanyIdentityVisibilityMutation,
  useSetCompanyMaskedProfileMutation,
} from "@/services/moderationApi";

/**
 * Shows or hides a company's identity from candidates.
 *
 * <p>Takes effect immediately across every listing that company has — nothing
 * is copied onto the job posts, so there is no half-masked state to wait out.
 *
 * <p>Built for a sidebar: the two states are a segmented control rather than
 * two buttons, so the current one is legible without reading the prose.
 */
export function CompanyIdentityPanel({
  companyId,
  companyName,
  visibility,
  maskedLogoUrl,
}: {
  companyId: string;
  companyName: string;
  visibility: CompanyIdentityVisibility;
  maskedLogoUrl: string | null;
}) {
  const [setVisibility, { isLoading }] =
    useSetCompanyIdentityVisibilityMutation();
  const [setMaskedProfile, { isLoading: isSavingProfile }] =
    useSetCompanyMaskedProfileMutation();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isUploading, setUploading] = useState(false);

  const masked = visibility === "MASKED";
  const standIn = resolveFileUrl(maskedLogoUrl);
  const busy = isUploading || isSavingProfile;

  async function pick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Cleared here rather than after the upload, so picking the same file
    // again still fires a change event if the first attempt failed.
    event.target.value = "";
    if (!file) return;

    const problem = validateImage(file);
    if (problem) {
      toast.error(problem);
      return;
    }

    setUploading(true);
    try {
      // PUBLIC: a candidate's browser loads this directly, and a private
      // object would redirect to a presigned URL that expires.
      const url = await uploadFile(file, "PUBLIC");
      await setMaskedProfile({ companyId, maskedLogoUrl: url }).unwrap();
      toast.success("Stand-in logo set.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to upload that image."));
    } finally {
      setUploading(false);
    }
  }

  async function clearStandIn() {
    try {
      await setMaskedProfile({ companyId, maskedLogoUrl: null }).unwrap();
      toast.success("Stand-in logo removed.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to remove the image."));
    }
  }

  async function apply(next: CompanyIdentityVisibility) {
    if (next === visibility) return;

    try {
      await setVisibility({ companyId, visibility: next }).unwrap();
      toast.success(
        next === "MASKED"
          ? "Candidates will no longer see this company's name."
          : "Candidates can see this company's name again.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to change this setting."));
    }
  }

  return (
    <Panel variant="outlined">
      <PanelHeader
        title="Candidates see"
        icon={
          masked ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )
        }
      />

      <div className="flex rounded-lg bg-ws-card p-1">
        <Segment
          selected={!masked}
          disabled={isLoading}
          onClick={() => void apply("VISIBLE")}
        >
          <Eye aria-hidden="true" className="size-3.5" />
          Real name
        </Segment>
        <Segment
          selected={masked}
          disabled={isLoading}
          onClick={() => void apply("MASKED")}
        >
          <EyeOff aria-hidden="true" className="size-3.5" />
          Confidential
        </Segment>
      </div>

      <p className="mt-2.5 text-sm text-ws-muted">
        {masked ? (
          <>
            Jobs show{" "}
            <strong className="font-medium">Confidential company</strong> with
            no link back, and searching {companyName} does not find them.
          </>
        ) : (
          <>
            Jobs show <strong className="font-medium">{companyName}</strong> and
            candidates can find them by that name.
          </>
        )}
      </p>

      {/*
       * The stand-in a masked company shows instead of its own logo. Offered
       * whether or not the company is masked right now, so it can be put in
       * place first and masking stays a single act.
       */}
      <div className="mt-3 border-t border-ws-line pt-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ws-line bg-ws-card">
            {standIn ? (
              /* Backend object storage is not in next.config's remotePatterns. */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={standIn}
                alt=""
                aria-hidden="true"
                className="size-full object-contain p-1"
              />
            ) : (
              <Building2 aria-hidden="true" className="size-4 text-ws-faint" />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ws-fg">Stand-in logo</p>
            <p className="text-xs text-ws-faint">
              {standIn ? "Shown while masked" : "None set"}
            </p>
          </div>
        </div>

        {/* Below the row rather than beside it: two labelled controls do not
            fit next to a thumbnail once the text is 18px. */}
        <div className="mt-2.5 flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(event) => void pick(event)}
          />

          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            <Upload aria-hidden="true" />
            {isUploading ? "Uploading…" : standIn ? "Replace" : "Upload"}
          </Button>

          {standIn ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => void clearStandIn()}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

function Segment({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        selected
          ? "bg-ws-panel text-ws-fg shadow-(--shadow-card)"
          : "text-ws-muted hover:text-ws-fg",
      )}
    >
      {children}
    </button>
  );
}
