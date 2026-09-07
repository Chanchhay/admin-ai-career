"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ListChecks, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type {
  InterviewQuestionType,
  JobInterviewQuestionSetResponse,
  ManualQuestionMode,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { humanizeEnum } from "@/lib/format";
import {
  useGetJobInterviewQuestionsQuery,
  useSaveJobInterviewQuestionsMutation,
} from "@/services/interviewConfigApi";

/**
 * Writing a job's interview questions by hand.
 *
 * <p>Candidates are asked these in the order shown, ahead of anything the AI
 * writes. The panel keeps the whole set in local state and saves it in one
 * request, because that is how the list is edited: add, reword, reorder, drop,
 * then save.
 */
export function JobInterviewQuestionsPanel({ jobId }: { jobId: string }) {
  const { data, isLoading, isError } = useGetJobInterviewQuestionsQuery(jobId);

  if (isLoading || isError || !data) return null;

  /*
   * Remounting on the saved set rather than syncing it into state with an
   * effect: a fresh server copy should replace the draft, and an effect that
   * calls setState during render is exactly what the lint rule forbids.
   */
  return (
    <QuestionEditor
      key={`${data.mode}:${data.questions.map((question) => question.id).join(",")}`}
      set={data}
    />
  );
}

/** One question while it is being edited. `id` is null until it is first saved. */
type Draft = {
  key: string;
  id: string | null;
  questionText: string;
  questionType: InterviewQuestionType;
  expectedAnswer: string;
  maxScore: string;
};

function QuestionEditor({ set }: { set: JobInterviewQuestionSetResponse }) {
  const [save, { isLoading: isSaving }] = useSaveJobInterviewQuestionsMutation();

  const [mode, setMode] = useState<ManualQuestionMode>(set.mode);
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    set.questions.map((question) => ({
      key: `saved-${question.id}`,
      id: question.id,
      questionText: question.questionText,
      questionType: question.questionType,
      expectedAnswer: question.expectedAnswer ?? "",
      maxScore: String(question.maxScore),
    })),
  );

  // Keys for rows that have no id yet. A counter, because reading the clock
  // during render is not idempotent.
  const nextKey = useRef(0);

  const written = drafts.length;
  const generated = generatedCount(mode, written, set.targetQuestionCount);
  const fallbackType = set.availableTypes[0] ?? "GENERAL";

  const update = (key: string, patch: Partial<Draft>) =>
    setDrafts((current) =>
      current.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );

  const add = () =>
    setDrafts((current) => [
      ...current,
      {
        key: `new-${(nextKey.current += 1)}`,
        id: null,
        questionText: "",
        questionType: fallbackType,
        expectedAnswer: "",
        maxScore: String(set.defaultMaxScore),
      },
    ]);

  const remove = (key: string) =>
    setDrafts((current) => current.filter((draft) => draft.key !== key));

  const move = (index: number, delta: number) =>
    setDrafts((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  async function submit() {
    if (drafts.some((draft) => !draft.questionText.trim())) {
      toast.error("Every question needs text, or remove the empty one.");
      return;
    }

    try {
      await save({
        jobId: set.jobId,
        body: {
          mode,
          questions: drafts.map((draft) => ({
            id: draft.id,
            questionText: draft.questionText.trim(),
            questionType: draft.questionType,
            expectedAnswer: draft.expectedAnswer.trim() || undefined,
            maxScore: Number(draft.maxScore) || set.defaultMaxScore,
          })),
        },
      }).unwrap();

      toast.success("Interview questions saved.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save these questions."));
    }
  }

  return (
    <Panel>
      <PanelHeader
        title="Interview questions"
        icon={<ListChecks aria-hidden="true" className="size-4" />}
        action={
          <GhostChip>
            {written === 0
              ? `${set.targetQuestionCount} generated`
              : generated === 0
                ? `${written} written`
                : `${written} written + ${generated} generated`}
          </GhostChip>
        }
      />

      <p className="mb-4 text-sm text-ws-muted">
        Candidates are asked these first, in this order. Questions already asked
        are sent to the AI so it does not repeat them.
      </p>

      <div className="mb-4 flex flex-col gap-2">
        <ModeOption
          checked={mode === "MANUAL_PLUS_AI"}
          onSelect={() => setMode("MANUAL_PLUS_AI")}
          title="Written questions, then AI fills the rest"
          detail={`Tops the interview up to ${set.targetQuestionCount} questions.`}
        />
        <ModeOption
          checked={mode === "MANUAL_ONLY"}
          onSelect={() => setMode("MANUAL_ONLY")}
          title="Only these questions"
          detail="The AI writes nothing for this job."
        />
      </div>

      {drafts.length === 0 ? (
        <p className="rounded-xl bg-ws-card-hover px-4 py-6 text-center text-sm text-ws-faint">
          Nothing written yet — every question is generated. Add one to ask it of
          every candidate for this job.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {drafts.map((draft, index) => (
            <li
              key={draft.key}
              className="flex flex-col gap-4 rounded-xl bg-ws-card-hover px-4 py-4"
            >
              <div className="flex flex-wrap items-end gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ws-card text-sm font-bold text-ws-muted shadow-sm">
                  {index + 1}
                </span>

                <label className="flex min-w-44 flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ws-muted">Type</span>
                  <Select
                    value={draft.questionType}
                    onChange={(questionType) =>
                      update(draft.key, { questionType })
                    }
                    options={set.availableTypes.map((type) => ({
                      value: type,
                      label: humanizeEnum(type),
                    }))}
                    className="w-full"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ws-muted">Points</span>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={draft.maxScore}
                    onChange={(event) =>
                      update(draft.key, { maxScore: event.target.value })
                    }
                    className="w-24 dark:border-input dark:bg-surface"
                  />
                </label>

                <div className="ml-auto flex shrink-0 items-center gap-1 self-end">
                  <IconButton
                    label={`Move question ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ChevronUp aria-hidden="true" className="size-4" />
                  </IconButton>
                  <IconButton
                    label={`Move question ${index + 1} down`}
                    disabled={index === drafts.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronDown aria-hidden="true" className="size-4" />
                  </IconButton>
                  <IconButton
                    label={`Remove question ${index + 1}`}
                    onClick={() => remove(draft.key)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </IconButton>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ws-muted">Question</span>
                <Textarea
                  value={draft.questionText}
                  onChange={(event) =>
                    update(draft.key, { questionText: event.target.value })
                  }
                  maxLength={2000}
                  placeholder="What should the candidate be asked?"
                  className="min-h-20 dark:border-input dark:bg-surface"
                  aria-label={`Question ${index + 1}`}
                />
              </label>

              <div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-ws-muted">
                    What a good answer covers (optional)
                  </span>
                  <Input
                    value={draft.expectedAnswer}
                    onChange={(event) =>
                      update(draft.key, { expectedAnswer: event.target.value })
                    }
                    maxLength={2000}
                    placeholder="Used as the scoring rubric"
                    className="dark:border-input dark:bg-surface"
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={add}
          className="dark:border-input dark:bg-surface dark:hover:bg-surface/80"
        >
          <Plus aria-hidden="true" /> Add question
        </Button>

        <Button className="ml-auto" disabled={isSaving} onClick={() => void submit()}>
          {isSaving ? "Saving…" : "Save questions"}
        </Button>
      </div>
    </Panel>
  );
}

function ModeOption({
  checked,
  onSelect,
  title,
  detail,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-ws-card-hover px-4 py-3">
      <input
        type="radio"
        name="manual-question-mode"
        className="mt-1"
        checked={checked}
        onChange={onSelect}
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ws-fg">{title}</span>
        <span className="block text-xs text-ws-faint">{detail}</span>
      </span>
    </label>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-lg text-ws-faint transition hover:text-ws-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/**
 * How many questions the AI would add. Mirrors the backend rule so the count
 * updates as the list is edited, before anything is saved.
 */
function generatedCount(
  mode: ManualQuestionMode,
  writtenCount: number,
  targetCount: number,
): number {
  if (writtenCount === 0) return targetCount;
  if (mode === "MANUAL_ONLY") return 0;

  return Math.max(0, targetCount - writtenCount);
}
