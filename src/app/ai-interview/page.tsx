"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GuestInterviewSettingsPanel } from "@/components/console/GuestInterviewSettingsPanel";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type { AiInterviewConfigResponse } from "@/contracts";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum } from "@/lib/format";
import {
  useGetAiInterviewConfigQuery,
  useUpdateAiInterviewConfigMutation,
} from "@/services/interviewConfigApi";

/** Matches the backend's bounds, so a rejected save is the exception. */
const MAX_QUESTIONS = 30;
const MAX_SCORE_CEILING = 100;

/** Counts per type, keyed by the enum name the API uses. */
type Counts = Record<string, number>;

type Form = {
  counts: Counts;
  maxScorePerQuestion: string;
  additionalInstructions: string;
};

function toForm(config: AiInterviewConfigResponse): Form {
  const counts: Counts = {};
  // Every known type gets a row, not just the ones currently in use — the
  // editor is how a type is brought into use in the first place.
  for (const type of config.availableTypes) counts[type] = 0;
  for (const allocation of config.typeDistribution) {
    counts[allocation.type] = allocation.count;
  }

  return {
    counts,
    maxScorePerQuestion: String(config.maxScorePerQuestion),
    additionalInstructions: config.additionalInstructions ?? "",
  };
}

export default function AiInterviewConfigPage() {
  const tx = useWorkspaceTranslation();
  useSetPageHeading(tx("AI interview"));

  const { data, isError, refetch } = useGetAiInterviewConfigQuery();
  const [save, saveState] = useUpdateAiInterviewConfigMutation();
  const [form, setForm] = useState<Form | null>(null);
  const [seededFrom, setSeededFrom] = useState<AiInterviewConfigResponse | null>(
    null,
  );

  // Seeded during render rather than from an effect: the form is derived from
  // the last response, so re-deriving it the moment a new one arrives avoids a
  // pass where the two disagree. Runs when the query first resolves and again
  // after a save returns the stored settings.
  if (data && data !== seededFrom) {
    setSeededFrom(data);
    setForm(toForm(data));
  }

  const total = useMemo(
    () =>
      form
        ? Object.values(form.counts).reduce((sum, count) => sum + count, 0)
        : 0,
    [form],
  );

  // Errors are checked first: a failed request never seeds `form`, so testing
  // for the form before the error would render the skeleton forever instead of
  // showing what went wrong.
  if (isError) {
    return (
      <ErrorState
        message={tx("Unable to load the AI interview settings.")}
        onRetry={refetch}
      />
    );
  }

  if (!data || !form) {
    return <LoadingState rows={6} />;
  }

  const setCount = (type: string, value: number) =>
    setForm((current) =>
      current
        ? {
            ...current,
            counts: {
              ...current.counts,
              [type]: Math.max(0, Math.min(MAX_QUESTIONS, value)),
            },
          }
        : current,
    );

  const maxScore = Number(form.maxScorePerQuestion);

  const submit = async () => {
    if (total < 1) {
      toast.error(tx("Give at least one question type a question."));
      return;
    }
    if (total > MAX_QUESTIONS) {
      toast.error(tx("An interview may not exceed {max} questions.", { max: MAX_QUESTIONS }));
      return;
    }
    if (!Number.isInteger(maxScore) || maxScore < 1 || maxScore > MAX_SCORE_CEILING) {
      toast.error(
        tx("Max score must be a whole number between 1 and {max}.", {
          max: MAX_SCORE_CEILING,
        }),
      );
      return;
    }

    try {
      await save({
        // Sent, not inferred: the backend checks it against the distribution and
        // rejects a mismatch, which catches a miscounted form rather than
        // quietly generating the wrong interview.
        questionCount: total,
        maxScorePerQuestion: maxScore,
        typeDistribution: Object.entries(form.counts)
          .filter(([, count]) => count > 0)
          .map(([type, count]) => ({ type, count })),
        additionalInstructions: form.additionalInstructions.trim() || null,
      }).unwrap();
      toast.success(tx("AI interview settings saved."));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to save these settings.")));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">
          {tx(
            "What every AI interview generated from now on will look like. Existing interviews keep the shape they were generated with — a candidate part way through one is not affected by a change here.",
          )}
        </p>
      </Panel>

      <Panel>
        <PanelHeader
          title="Question mix"
          action={
            <GhostChip>
              {tx("{count} {unit} total", {
                count: total,
                unit: total === 1 ? tx("question") : tx("questions"),
              })}
            </GhostChip>
          }
        />

        <p className="mb-4 text-sm text-ws-muted">
          {tx(
            "How many questions of each type to ask. A type set to zero is left out of the interview entirely, and the total is what the interview length becomes.",
          )}
        </p>

        <ul className="flex flex-col gap-2">
          {data.availableTypes.map((type) => {
            const count = form.counts[type] ?? 0;
            return (
              <li
                key={type}
                className="flex items-center gap-3 max-sm:flex-wrap rounded-[18px] bg-ws-card-hover px-4 py-3"
              >
                <p className="min-w-0 flex-1 max-sm:basis-full truncate text-sm font-semibold text-ws-fg">
                  {humanizeEnum(type)}
                </p>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={tx("One fewer {type} question", { type: humanizeEnum(type) })}
                  disabled={count === 0}
                  onClick={() => setCount(type, count - 1)}
                >
                  <Minus aria-hidden="true" className="size-4" />
                </Button>

                <Input
                  type="number"
                  min={0}
                  max={MAX_QUESTIONS}
                  inputMode="numeric"
                  aria-label={tx("{type} questions", { type: humanizeEnum(type) })}
                  value={String(count)}
                  onChange={(event) =>
                    setCount(type, Math.trunc(Number(event.target.value) || 0))
                  }
                  className="h-9 w-16 text-center"
                />

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={tx("One more {type} question", { type: humanizeEnum(type) })}
                  disabled={total >= MAX_QUESTIONS}
                  onClick={() => setCount(type, count + 1)}
                >
                  <Plus aria-hidden="true" className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader title="Scoring and prompt" />

        <div className="flex flex-col gap-4">
          <label className="flex max-w-xs flex-col gap-1.5 text-xs font-medium text-ws-muted">
            {tx("Max score per question")}
            <Input
              type="number"
              min={1}
              max={MAX_SCORE_CEILING}
              inputMode="numeric"
              value={form.maxScorePerQuestion}
              onChange={(event) =>
                setForm({ ...form, maxScorePerQuestion: event.target.value })
              }
            />
            <span className="font-normal text-ws-faint">
              {tx("A whole interview is worth {points} points at this setting.", {
                points: total * (maxScore || 0),
              })}
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted">
            {tx("Extra instructions for the interviewer (optional)")}
            <Textarea
              value={form.additionalInstructions}
              onChange={(event) =>
                setForm({ ...form, additionalInstructions: event.target.value })
              }
              placeholder={tx(
                "e.g. Favour practical scenarios over textbook definitions, and never ask about salary.",
              )}
              className="min-h-28"
            />
            <span className="font-normal text-ws-faint">
              {tx(
                "Appended to the prompt that generates the questions. Keep it to rules about the questions themselves — it is read by the model, not by the candidate.",
              )}
            </span>
          </label>
        </div>
      </Panel>

      <GuestInterviewSettingsPanel />


      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => void submit()} disabled={saveState.isLoading}>
          {saveState.isLoading ? tx("Saving…") : tx("Save settings")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setForm(toForm(data))}
          disabled={saveState.isLoading}
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          {tx("Reset")}
        </Button>
        <p className="text-xs text-ws-faint">
          {data.updatedAt
            ? data.updatedBy
              ? tx("Last changed {date} by {user}.", {
                  date: formatDateTime(data.updatedAt),
                  user: data.updatedBy,
                })
              : tx("Last changed {date}.", { date: formatDateTime(data.updatedAt) })
            : tx("Never changed — running on the platform defaults.")}
        </p>
      </div>
    </div>
  );
}
