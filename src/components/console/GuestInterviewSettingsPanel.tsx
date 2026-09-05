"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type {
  GuestInterviewSettingsResponse,
  GuestQuestionSource,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useGetGuestInterviewSettingsQuery,
  useUpdateGuestInterviewSettingsMutation,
} from "@/services/interviewConfigApi";

const SOURCES: { value: GuestQuestionSource; label: string; detail: string }[] = [
  {
    value: "FOLLOW_JOB",
    label: "Whatever the job is set to",
    detail:
      "Guests sit the same interview a real candidate for that job would.",
  },
  {
    value: "WRITTEN_ONLY",
    label: "Only questions written by an admin",
    detail:
      "Nothing is generated, so guests cost nothing to prepare. A job with no written questions cannot be practised.",
  },
  {
    value: "ALWAYS_GENERATE",
    label: "Let the AI write them",
    detail:
      "Written questions still come first, then the AI fills the interview out.",
  },
];

/**
 * Whether people who are not signed in may take an AI interview, how many, and
 * out of which questions.
 *
 * <p>Off until an administrator turns it on: every guest interview spends money
 * generating and scoring, and the person spending it has no account.
 */
export function GuestInterviewSettingsPanel() {
  const { data, isLoading } = useGetGuestInterviewSettingsQuery();

  if (isLoading || !data) return null;

  return <Editor key={JSON.stringify(data)} settings={data} />;
}

function Editor({ settings }: { settings: GuestInterviewSettingsResponse }) {
  const [update, { isLoading: isSaving }] =
    useUpdateGuestInterviewSettingsMutation();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [perGuest, setPerGuest] = useState(String(settings.maxAttemptsPerGuest));
  const [perIp, setPerIp] = useState(String(settings.maxAttemptsPerIpPerDay));
  const [source, setSource] = useState<GuestQuestionSource>(
    settings.questionSource,
  );

  async function save() {
    const maxAttemptsPerGuest = Number(perGuest);
    const maxAttemptsPerIpPerDay = Number(perIp);

    if (!Number.isInteger(maxAttemptsPerGuest) || maxAttemptsPerGuest < 0) {
      toast.error("Attempts per guest must be a whole number.");
      return;
    }
    if (!Number.isInteger(maxAttemptsPerIpPerDay) || maxAttemptsPerIpPerDay < 0) {
      toast.error("Attempts per network must be a whole number.");
      return;
    }

    try {
      await update({
        enabled,
        maxAttemptsPerGuest,
        maxAttemptsPerIpPerDay,
        questionSource: source,
      }).unwrap();
      toast.success("Guest interview settings saved.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save these settings."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="Guest interviews"
        icon={<UserRound aria-hidden="true" className="size-5" />}
        action={<GhostChip>{enabled ? "Open" : "Closed"}</GhostChip>}
      />

      <p className="mb-4 text-sm text-ws-muted">
        Lets someone try an AI interview against a published job without signing
        in. Every attempt costs generation and scoring, and a guest has no
        account behind them — so the limits below are the only thing capping it.
      </p>

      <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3">
        <input
          type="checkbox"
          className="mt-1"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        <span>
          <span className="block text-sm font-semibold text-ws-fg">
            Let guests take an interview
          </span>
          <span className="block text-xs text-ws-faint">
            Turning this off stops new guest interviews immediately.
          </span>
        </span>
      </label>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">
            Attempts per guest
          </span>
          <Input
            type="number"
            min="0"
            max="20"
            value={perGuest}
            onChange={(event) => setPerGuest(event.target.value)}
            className="w-32"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ws-muted">
            Attempts per network per day
          </span>
          <Input
            type="number"
            min="0"
            max="500"
            value={perIp}
            onChange={(event) => setPerIp(event.target.value)}
            className="w-40"
          />
        </label>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ws-faint">
        Where guest questions come from
      </p>
      <div className="flex flex-col gap-2">
        {SOURCES.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3"
          >
            <input
              type="radio"
              name="guest-question-source"
              className="mt-1"
              checked={source === option.value}
              onChange={() => setSource(option.value)}
            />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ws-fg">
                {option.label}
              </span>
              <span className="block text-xs text-ws-faint">{option.detail}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex">
        <Button className="ml-auto" disabled={isSaving} onClick={() => void save()}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Panel>
  );
}
