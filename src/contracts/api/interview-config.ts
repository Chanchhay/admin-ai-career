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

/* --------------------------- hand-written job interview questions --------- */

/**
 * What a job's hand-written questions do to AI generation. Only consulted once
 * the job actually has written questions.
 */
export type ManualQuestionMode = "MANUAL_ONLY" | "MANUAL_PLUS_AI";

export type JobInterviewQuestionResponse = {
  id: string;
  displayOrder: number;
  questionType: InterviewQuestionType;
  questionText: string;
  expectedAnswer: string | null;
  maxScore: number;
};

/**
 * A job's written questions plus the numbers needed to explain what will
 * actually be asked. `generatedQuestionCount` is what the AI would add, given
 * this set and mode — the backend works it out so the editor and the interview
 * cannot disagree.
 */
export type JobInterviewQuestionSetResponse = {
  jobId: string;
  jobTitle: string;
  mode: ManualQuestionMode;
  targetQuestionCount: number;
  defaultMaxScore: number;
  generatedQuestionCount: number;
  availableTypes: InterviewQuestionType[];
  questions: JobInterviewQuestionResponse[];
};

/** `id` updates a question in place; null adds one. Omissions are deletions. */
export type JobInterviewQuestionRequest = {
  id: string | null;
  questionText: string;
  questionType: InterviewQuestionType;
  expectedAnswer?: string;
  maxScore?: number;
};

export type JobInterviewQuestionSetRequest = {
  mode: ManualQuestionMode;
  questions: JobInterviewQuestionRequest[];
};

export type ApiResponseJobInterviewQuestionSet =
  ApiResponse<JobInterviewQuestionSetResponse>;

/* ------------------------------- guest (signed-out) interviews ------------ */

/**
 * Where a guest interview's questions come from. `FOLLOW_JOB` leaves each job's
 * own manual/AI setting alone; the other two override every job for guests.
 */
export type GuestQuestionSource =
  | "FOLLOW_JOB"
  | "WRITTEN_ONLY"
  | "ALWAYS_GENERATE";

export type GuestInterviewSettingsResponse = {
  enabled: boolean;
  maxAttemptsPerGuest: number;
  maxAttemptsPerIpPerDay: number;
  questionSource: GuestQuestionSource;
};

export type GuestInterviewSettingsRequest = GuestInterviewSettingsResponse;

export type ApiResponseGuestInterviewSettings =
  ApiResponse<GuestInterviewSettingsResponse>;
