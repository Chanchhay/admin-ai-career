"use client";

import { useState } from "react";
import { Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useGetApplicationSettingsQuery,
  useUpdateApplicationSettingsMutation,
} from "@/services/moderationApi";

/**
 * How long a rejected candidate must wait before applying to the same job
 * again.
 *
 * <p>Zero switches it off, which is the shipped default — a rule that decides
 * who may apply should be turned on deliberately rather than arrive already
 * enforcing something nobody chose.
 */
export function ReapplyCooldownPanel() {
  const { data, isLoading } = useGetApplicationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateApplicationSettingsMutation();
  const [draft, setDraft] = useState<string | null>(null);

  if (isLoading || !data) return null;

  const value = draft ?? String(data.reapplyCooldownDays);
  const changed = value !== String(data.reapplyCooldownDays);

  async function save() {
    const days = Number(value);

    if (!Number.isInteger(days) || days < 0 || days > 365) {
      toast.error("Enter a whole number of days between 0 and 365.");
      return;
    }

    try {
      await updateSettings({ reapplyCooldownDays: days }).unwrap();
      toast.success(
        days === 0
          ? "Re-apply cooldown switched off."
          : `Rejected candidates must now wait ${days} day${days === 1 ? "" : "s"}.`,
      );
      setDraft(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save the setting."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="Re-apply cooldown"
        icon={<Timer aria-hidden="true" className="size-4" />}
      />

      <p className="mb-4 text-sm text-ws-muted">
        How long a rejected candidate waits before applying to the same job
        again. Set 0 to allow it immediately. Withdrawing is not affected — that
        is the candidate&apos;s own decision, so it never starts the clock.
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">Days</span>
          <Input
            type="number"
            min="0"
            max="365"
            value={value}
            onChange={(event) => setDraft(event.target.value)}
            className="w-28"
          />
        </label>

        <Button disabled={!changed || isSaving} onClick={() => void save()}>
          {isSaving ? "Saving…" : "Save"}
        </Button>

        {data.reapplyCooldownDays === 0 ? (
          <span className="text-xs text-ws-faint">
            Currently off — rejected candidates can re-apply straight away.
          </span>
        ) : null}
      </div>
    </Panel>
  );
}
