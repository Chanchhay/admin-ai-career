/**
 * `/api/v1/admin/ai-interview-config` — how AI interviews are generated:
 * how many questions, of which types, and what each one is worth.
 *
 * `availableTypes` comes down with the config rather than being listed here, so
 * a new question type on the backend appears in the editor without a frontend
 * release.
 */

import type { ApiResponse } from "./common";

export type InterviewQuestionType = string;

export type QuestionTypeAllocation = {
  type: InterviewQuestionType;
  count: number;
};

export type AiInterviewConfigResponse = {
  questionCount: number;
  maxScorePerQuestion: number;
  /** Only types carrying at least one question. */
  typeDistribution: QuestionTypeAllocation[];
  additionalInstructions: string | null;
  availableTypes: InterviewQuestionType[];
  updatedAt: string | null;
  updatedBy: string | null;
};

export type AiInterviewConfigRequest = {
  /** Must equal the sum of `typeDistribution`; the backend rejects a mismatch. */
  questionCount: number;
  maxScorePerQuestion: number;
  typeDistribution: QuestionTypeAllocation[];
  additionalInstructions?: string | null;
};

export type ApiResponseAiInterviewConfig = ApiResponse<AiInterviewConfigResponse>;
