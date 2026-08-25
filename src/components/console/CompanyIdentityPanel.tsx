"use client";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type { CompanyIdentityVisibility } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSetCompanyIdentityVisibilityMutation } from "@/services/moderationApi";

/**
 * Shows or hides a company's identity from candidates.
 *
 * <p>Takes effect immediately across every listing that company has — nothing
 * is copied onto the job posts, so there is no half-masked state to wait out.
 */
export function CompanyIdentityPanel({
  companyId,
  companyName,
  visibility,
}: {
  companyId: number;
  companyName: string;
  visibility: CompanyIdentityVisibility;
}) {
  const [setVisibility, { isLoading }] =
    useSetCompanyIdentityVisibilityMutation();

  const masked = visibility === "MASKED";

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
    <Panel>
      <PanelHeader
        title="Identity to candidates"
        icon={
          masked ? (
            <EyeOff aria-hidden="true" className="size-5" />
          ) : (
            <Eye aria-hidden="true" className="size-5" />
          )
        }
        action={<GhostChip>{masked ? "Masked" : "Visible"}</GhostChip>}
      />

      <p className="mb-4 text-sm text-ws-muted">
        {masked ? (
          <>
            Candidates see <strong>Confidential company</strong> on every job
            this company posts, with no link back to it, and searching{" "}
            <strong>{companyName}</strong> does not find those jobs. Recruiters,
            moderators and finance are unaffected.
          </>
        ) : (
          <>
            Candidates see <strong>{companyName}</strong> on its job listings and
            can find them by searching that name.
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={masked ? "outline" : "default"}
          disabled={isLoading || !masked}
          onClick={() => void apply("VISIBLE")}
        >
          <Eye aria-hidden="true" /> Show the company
        </Button>

        <Button
          variant={masked ? "default" : "outline"}
          disabled={isLoading || masked}
          onClick={() => void apply("MASKED")}
        >
          <EyeOff aria-hidden="true" /> Mask the company
        </Button>
      </div>
    </Panel>
  );
}
