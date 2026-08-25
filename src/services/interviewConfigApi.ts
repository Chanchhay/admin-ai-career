/**
 * AI interview generation settings — `/api/v1/admin/ai-interview-config`.
 *
 * One resource with a read and a full replace; there is no partial update, so
 * the editor always sends every field back.
 */

import type {
  AiInterviewConfigRequest,
  AiInterviewConfigResponse,
  ApiResponseAiInterviewConfig,
  ApiResponseJobInterviewQuestionSet,
  JobInterviewQuestionSetRequest,
  JobInterviewQuestionSetResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const interviewConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiInterviewConfig: builder.query<AiInterviewConfigResponse, void>({
      query: () => "/admin/ai-interview-config",
      transformResponse: (response: ApiResponseAiInterviewConfig) =>
        unwrapApiResponse(response),
      providesTags: ["AiInterviewConfig"],
    }),
    updateAiInterviewConfig: builder.mutation<
      AiInterviewConfigResponse,
      AiInterviewConfigRequest
    >({
      query: (body) => ({
        url: "/admin/ai-interview-config",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseAiInterviewConfig) =>
        unwrapApiResponse(response),
      invalidatesTags: ["AiInterviewConfig"],
    }),

    /* ------------------- hand-written questions for one job --------------- */

    getJobInterviewQuestions: builder.query<JobInterviewQuestionSetResponse, number>({
      query: (jobId) => `/admin/jobs/${jobId}/interview-questions`,
      transformResponse: (response: ApiResponseJobInterviewQuestionSet) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, jobId) => [
        { type: "JobInterviewQuestions", id: jobId },
      ],
    }),
    saveJobInterviewQuestions: builder.mutation<
      JobInterviewQuestionSetResponse,
      { jobId: number; body: JobInterviewQuestionSetRequest }
    >({
      query: ({ jobId, body }) => ({
        url: `/admin/jobs/${jobId}/interview-questions`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseJobInterviewQuestionSet) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "JobInterviewQuestions", id: jobId },
      ],
    }),
  }),
});

export const {
  useGetJobInterviewQuestionsQuery,
  useSaveJobInterviewQuestionsMutation,
  useGetAiInterviewConfigQuery,
  useUpdateAiInterviewConfigMutation,
} = interviewConfigApi;
