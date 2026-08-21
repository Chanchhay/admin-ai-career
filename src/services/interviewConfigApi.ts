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
  }),
});

export const {
  useGetAiInterviewConfigQuery,
  useUpdateAiInterviewConfigMutation,
} = interviewConfigApi;
