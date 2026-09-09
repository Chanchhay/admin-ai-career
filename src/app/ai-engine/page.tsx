"use client";

import { useMemo, useState } from "react";
import { KeyRound, PlugZap, RotateCcw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GhostChip, Panel, PanelHeader } from "@/components/workspace/primitives";
import type {
  AiModelOption,
  AiProviderConfigResponse,
  AiTask,
  AiThinking,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime, humanizeEnum } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useGetAiModelCatalogQuery,
  useGetAiProviderConfigQuery,
  useTestAiConnectionMutation,
  useUpdateAiProviderConfigMutation,
} from "@/services/aiProviderApi";

type Form = {
  model: string;
  /** Empty means "keep whatever is stored" — the key is never read back. */
  apiKey: string;
  clearApiKey: boolean;
  overrides: Record<string, string>;
  temperature: string;
  maxOutputTokens: string;
  timeoutSeconds: string;
  maxRetries: string;
  thinking: AiThinking;
};

function toForm(config: AiProviderConfigResponse): Form {
  const overrides: Record<string, string> = {};
  for (const task of config.availableTasks) overrides[task] = "";
  for (const override of config.modelOverrides) {
    overrides[override.task] = override.model;
  }

  return {
    model: config.model,
    apiKey: "",
    clearApiKey: false,
    overrides,
    temperature: String(config.temperature),
    maxOutputTokens: String(config.maxOutputTokens),
    timeoutSeconds: String(config.timeoutSeconds),
    maxRetries: String(config.maxRetries),
    thinking: config.thinking,
  };
}

/** What each task is, in the words of someone deciding which model it deserves. */
const TASK_HINTS: Record<AiTask, string> = {
  QUESTION_GENERATION: "Writes the questions for a new interview.",
  ANSWER_EVALUATION: "Scores answers and writes feedback and model answers.",
  TRANSCRIPT_SEGMENTATION:
    "Splits a voice interview transcript back into per-question answers.",
  JOB_DOCUMENT_EXTRACTION:
    "Reads an uploaded job description into a structured job post.",
};

const THINKING_LABELS: Record<AiThinking, string> = {
  OFF: "Off — fastest",
  MINIMAL: "Minimal",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High — slowest",
  PROVIDER_DEFAULT: "Provider default",
};

export default function AiEnginePage() {
  useSetPageHeading("AI engine");

  const { data, error, isError, refetch } = useGetAiProviderConfigQuery();
  const catalog = useGetAiModelCatalogQuery();
  const [save, saveState] = useUpdateAiProviderConfigMutation();
  const [test, testState] = useTestAiConnectionMutation();
  const [form, setForm] = useState<Form | null>(null);
  const [seededFrom, setSeededFrom] = useState<AiProviderConfigResponse | null>(
    null,
  );

  // Derived from the last response during render rather than in an effect, so
  // the form and the server never disagree for a pass.
  if (data && data !== seededFrom) {
    setSeededFrom(data);
    setForm(toForm(data));
  }

  const forbidden = useMemo(
    () =>
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status === 403
        : false,
    [error],
  );

  // This page is SUPER_ADMIN only, unlike the rest of the console, so a 403 here
  // is a role problem to explain rather than a failure to retry.
  if (forbidden) {
    return (
      <Panel tone="soft">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="text-base font-semibold">Needs the SUPER_ADMIN role</h2>
            <p className="mt-1 text-base leading-6">
              The API key stored here can spend real money, so it is held to the
              platform&apos;s narrowest role. Ask whoever administers Keycloak to add{" "}
              <code className="rounded bg-ws-card px-1 py-0.5 text-sm">SUPER_ADMIN</code>{" "}
              to your account, then sign out and back in.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  if (isError) {
    return (
      <ErrorState message="Unable to load the AI engine settings." onRetry={refetch} />
    );
  }

  if (!data || !form) {
    return <LoadingState rows={6} />;
  }

  const set = <K extends keyof Form>(field: K, value: Form[K]) =>
    setForm((current) => (current ? { ...current, [field]: value } : current));

  const models: AiModelOption[] = catalog.data?.models ?? [];

  const overridesPayload = () =>
    Object.entries(form.overrides)
      .filter(([, model]) => model.trim())
      .map(([task, model]) => ({ task: task as AiTask, model: model.trim() }));

  const numbers = {
    temperature: Number(form.temperature),
    maxOutputTokens: Number(form.maxOutputTokens),
    timeoutSeconds: Number(form.timeoutSeconds),
    maxRetries: Number(form.maxRetries),
  };

  const invalid = () => {
    if (!form.model.trim()) return "A default model is required.";
    if (!(numbers.temperature >= 0 && numbers.temperature <= 2))
      return "Temperature must be between 0 and 2.";
    if (!Number.isInteger(numbers.maxOutputTokens) || numbers.maxOutputTokens < 256)
      return "Max output tokens must be a whole number of at least 256.";
    if (!Number.isInteger(numbers.timeoutSeconds) || numbers.timeoutSeconds < 5)
      return "Timeout must be a whole number of at least 5 seconds.";
    if (!Number.isInteger(numbers.maxRetries) || numbers.maxRetries < 0)
      return "Retries must be 0 or more.";
    return null;
  };

  const submit = async () => {
    const problem = invalid();
    if (problem) {
      toast.error(problem);
      return;
    }

    try {
      await save({
        model: form.model.trim(),
        // Sent only when something was typed: an empty field means "keep the
        // stored key", which is the only way to say that when it is never read
        // back.
        apiKey: form.apiKey.trim() || null,
        clearApiKey: form.clearApiKey,
        modelOverrides: overridesPayload(),
        thinking: form.thinking,
        ...numbers,
      }).unwrap();
      toast.success("AI engine settings saved.");
    } catch (caught) {
      toast.error(getApiErrorMessage(caught, "Unable to save these settings."));
    }
  };

  const runTest = async () => {
    try {
      const result = await test({
        model: form.model.trim() || undefined,
        apiKey: form.apiKey.trim() || undefined,
      }).unwrap();

      if (result.success) {
        toast.success(
          `${result.model} answered in ${result.latencyMillis} ms using the ${result.keySource} key.`,
        );
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(getApiErrorMessage(caught, "The connection test could not run."));
    }
  };

  const keyInUse = data.apiKeyStored
    ? "a key saved here"
    : data.environmentKeyAvailable
      ? "the server's GEMINI_API_KEY"
      : "no key at all";

  return (
    <div className="flex flex-col gap-3 max-lg:min-w-0 max-lg:shrink-0 max-sm:[&>section]:min-w-0 max-sm:[&>section]:p-3 max-sm:[&_code]:break-all">
      <Panel tone="soft">
        <p className="text-base leading-6">
          Every AI feature on the platform — interview questions, scoring, voice
          transcripts and recruiter job imports — runs on these settings. Changes
          apply to the next call; nothing needs restarting, and an interview
          already under way keeps the model it started on.
        </p>
      </Panel>

      <Panel className="max-sm:[&>header]:flex-wrap max-sm:[&>header>div]:ml-0 max-sm:[&>header>div]:w-full">
        <PanelHeader
          title="Provider key"
          icon={<KeyRound aria-hidden="true" className="size-4" />}
          action={<GhostChip>Currently using {keyInUse}</GhostChip>}
        />

        {data.apiKeyEditable ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ws-muted">
              {data.apiKeyStored ? "Replace the saved key" : "API key"}
              <Input
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder={
                  data.apiKeyMask
                    ? `Saved: ${data.apiKeyMask} — leave blank to keep it`
                    : "Paste the provider API key"
                }
                value={form.apiKey}
                onChange={(event) => set("apiKey", event.target.value)}
                disabled={form.clearApiKey}
              />
              <span className="font-normal text-ws-faint">
                Stored encrypted and never shown again. Leaving this blank keeps
                whatever is already saved.
              </span>
            </label>

            {data.apiKeyStored ? (
              <label className="flex items-center gap-2 text-sm font-medium text-ws-muted">
                <input
                  type="checkbox"
                  className="size-4 accent-primary max-sm:shrink-0"
                  checked={form.clearApiKey}
                  onChange={(event) => set("clearApiKey", event.target.checked)}
                />
                Remove the saved key on save
                {data.environmentKeyAvailable
                  ? " and fall back to the server's own key"
                  : " (no fallback exists — AI features will stop until a new key is set)"}
              </label>
            ) : null}
          </div>
        ) : (
          <p className="rounded-xl bg-ws-card-hover px-4 py-3 text-base leading-6 text-ws-muted">
            This server has no secret encryption key, so a provider key cannot be
            stored here — it would have to be written to the database in the
            clear. Set{" "}
            <code className="rounded bg-ws-card px-1 py-0.5 text-sm">
              AI_SETTINGS_ENCRYPTION_KEY
            </code>{" "}
            to a base64-encoded 32-byte value (
            <code className="rounded bg-ws-card px-1 py-0.5 text-sm">
              openssl rand -base64 32
            </code>
            ) and restart it. Everything else on this page still works.
          </p>
        )}

        <div className="mt-4">
          <Button variant="outline" className="max-sm:min-h-11 max-sm:w-full" onClick={() => void runTest()} disabled={testState.isLoading}>
            <PlugZap aria-hidden="true" className="size-4" />
            {testState.isLoading ? "Testing…" : "Test connection"}
          </Button>
          <p className="mt-2 text-sm text-ws-faint">
            Sends one tiny prompt using the model and key entered above, so a typo
            is caught here rather than by the next candidate.
          </p>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Models" />

        <label className="flex max-w-md flex-col gap-1.5 text-sm font-medium text-ws-muted">
          Default model
          <ModelSelect
            value={form.model}
            models={models}
            loading={catalog.isLoading}
            onChange={(value) => set("model", value)}
          />
          <span className="font-normal text-ws-faint">
            Used for everything that has no override below.
            {catalog.data ? ` ${catalog.data.message}` : ""}
          </span>
        </label>

        <ul className="mt-4 flex flex-col gap-2">
          {data.availableTasks.map((task) => (
            <li
              key={task}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-ws-card-hover px-4 py-3 max-sm:min-w-0 max-sm:flex-col max-sm:items-stretch max-sm:px-3"
            >
              <div className="min-w-40 flex-1 max-sm:min-w-0">
                <p className="text-base font-semibold text-ws-fg">{humanizeEnum(task)}</p>
                <p className="mt-0.5 text-sm text-ws-faint">{TASK_HINTS[task]}</p>
              </div>
              <ModelSelect
                className="w-60 max-sm:min-w-0 max-sm:w-full"
                ariaLabel={`${humanizeEnum(task)} model`}
                value={form.overrides[task] ?? ""}
                models={models}
                loading={catalog.isLoading}
                defaultLabel={`Default (${form.model || "unset"})`}
                onChange={(value) =>
                  set("overrides", { ...form.overrides, [task]: value })
                }
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <PanelHeader title="Tuning" />

        <label className="mb-4 flex max-w-md flex-col gap-1.5 text-sm font-medium text-ws-muted">
          Thinking
          <Select
            value={form.thinking}
            onChange={(level) => set("thinking", level as AiThinking)}
            options={data.availableThinkingLevels.map((level) => ({
              value: level,
              label: THINKING_LABELS[level] ?? level,
            }))}
            className="w-full"
          />
          <span className="font-normal text-ws-faint">
            The biggest speed dial there is. Every job here is filling in a fixed
            structure — writing questions, scoring answers, splitting a transcript —
            where deliberating adds seconds and little else. A few models, Gemini
            2.5 Pro among them, refuse to have it switched off; use Provider
            default for those.
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            label="Temperature"
            hint="0 is repeatable, 2 is wild."
            value={form.temperature}
            step="0.1"
            min={0}
            max={2}
            onChange={(value) => set("temperature", value)}
          />
          <NumberField
            label="Max output tokens"
            hint="Ceiling on one response."
            value={form.maxOutputTokens}
            min={256}
            max={65536}
            onChange={(value) => set("maxOutputTokens", value)}
          />
          <NumberField
            label="Timeout (seconds)"
            hint="How long to wait for the provider."
            value={form.timeoutSeconds}
            min={5}
            max={600}
            onChange={(value) => set("timeoutSeconds", value)}
          />
          <NumberField
            label="Retries"
            hint="Extra attempts after a failure."
            value={form.maxRetries}
            min={0}
            max={5}
            onChange={(value) => set("maxRetries", value)}
          />
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2 max-sm:[&>button]:min-h-11 max-sm:[&>button]:flex-1 max-sm:[&>p]:w-full max-sm:[&>p]:break-words">
        <Button onClick={() => void submit()} disabled={saveState.isLoading}>
          {saveState.isLoading ? "Saving…" : "Save settings"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setForm(toForm(data))}
          disabled={saveState.isLoading}
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Reset
        </Button>
        <p className="text-sm text-ws-faint">
          {data.updatedAt
            ? `Last changed ${formatDateTime(data.updatedAt)}${
                data.updatedBy ? ` by ${data.updatedBy}` : ""
              }.`
            : "Never changed — running on the server's own configuration."}
        </p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  min: number;
  max: number;
  step?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ws-muted">
      {label}
      <Input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="font-normal text-ws-faint">{hint}</span>
    </label>
  );
}

/**
 * A model is chosen, never typed: the list comes from the provider, so a name
 * that does not exist cannot be saved. An override adds an empty option, which
 * is how a task is put back on the default model.
 */
function ModelSelect({
  value,
  models,
  loading,
  onChange,
  defaultLabel,
  ariaLabel,
  className,
}: {
  value: string;
  models: AiModelOption[];
  loading: boolean;
  onChange: (value: string) => void;
  /** Given for per-task selects; its absence marks this as the default-model select. */
  defaultLabel?: string;
  ariaLabel?: string;
  className?: string;
}) {
  // A value the catalogue does not carry still has to appear, or opening this
  // select would quietly rewrite a setting the admin never touched.
  const missing = value && !models.some((model) => model.id === value);

  const options = [
    ...(defaultLabel ? [{ value: "", label: defaultLabel }] : []),
    // A value the catalogue does not carry is still offered, so opening the
    // list cannot quietly rewrite a setting nobody touched.
    ...(missing ? [{ value, label: `${value} (in use)` }] : []),
    ...models.map((model) => ({
      value: model.id,
      label:
        model.displayName === model.id
          ? model.id
          : `${model.displayName} — ${model.id}`,
    })),
  ];

  return (
    <Select
      aria-label={ariaLabel}
      value={value}
      disabled={loading}
      onChange={onChange}
      options={options}
      placeholder={loading ? "Loading models…" : "Select a model"}
      mobileDropdownBelow
      className={cn("w-full", className)}
    />
  );
}
