/**
 * `/api/v1/admin/ai-provider-config` — the engine every AI feature runs on:
 * which model, on whose API key, with what tuning.
 *
 * SUPER_ADMIN only. The API key is write-only: a read returns a mask, never the
 * key, so the request type has to express "leave it alone" (omit) separately
 * from "remove it" (`clearApiKey`).
 */

import type { ApiResponse } from "./common";

export type AiTask =
  | "QUESTION_GENERATION"
  | "ANSWER_EVALUATION"
  | "TRANSCRIPT_SEGMENTATION"
  | "JOB_DOCUMENT_EXTRACTION";

/** How much the model may deliberate before answering — the main speed dial. */
export type AiThinking =
  | "PROVIDER_DEFAULT"
  | "OFF"
  | "MINIMAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type AiModelOverride = {
  task: AiTask;
  /** Blank clears the override and falls back to the default model. */
  model: string;
};

export type AiProviderConfigResponse = {
  model: string;
  /** `••••••af31`, or null when no key is configured anywhere. */
  apiKeyMask: string | null;
  apiKeyStored: boolean;
  environmentKeyAvailable: boolean;
  /** False when the server has no encryption key, which makes the field read-only. */
  apiKeyEditable: boolean;
  /** Only the tasks that have an override; the rest follow the default model. */
  modelOverrides: AiModelOverride[];
  availableTasks: AiTask[];
  temperature: number;
  maxOutputTokens: number;
  timeoutSeconds: number;
  maxRetries: number;
  thinking: AiThinking;
  availableThinkingLevels: AiThinking[];
  updatedAt: string | null;
  updatedBy: string | null;
};

export type AiProviderConfigRequest = {
  model: string;
  /** Omit to keep the stored key. */
  apiKey?: string | null;
  /** True removes the stored key so the server's own environment key takes over. */
  clearApiKey: boolean;
  modelOverrides: AiModelOverride[];
  temperature: number;
  maxOutputTokens: number;
  timeoutSeconds: number;
  maxRetries: number;
  thinking: AiThinking;
};

export type AiConnectionTestRequest = {
  model?: string;
  apiKey?: string;
};

export type AiConnectionTestResponse = {
  success: boolean;
  model: string;
  keySource: string;
  latencyMillis: number | null;
  message: string;
};

export type AiModelOption = {
  /** What gets saved, e.g. `gemini-3.5-flash`. */
  id: string;
  displayName: string;
  description: string | null;
};

export type AiModelCatalogResponse = {
  /** False when the list is the built-in fallback rather than the provider's own. */
  live: boolean;
  message: string;
  models: AiModelOption[];
};

export type ApiResponseAiProviderConfig = ApiResponse<AiProviderConfigResponse>;
export type ApiResponseAiModelCatalog = ApiResponse<AiModelCatalogResponse>;
export type ApiResponseAiConnectionTest = ApiResponse<AiConnectionTestResponse>;
