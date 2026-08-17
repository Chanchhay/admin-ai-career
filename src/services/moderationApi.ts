/**
 * Company verification and the candidate review queue — `/api/v1/moderator/**`.
 *
 * The backend enforces no role on these; the gateway only requires a session.
 * Whoever reaches this console can act, so the screens rely on the decision
 * buttons being deliberate rather than on the API refusing the wrong caller.
 */

import type {
  ApiResponseCandidateApplicationDetail,
  ApiResponseCandidateApplicationReview,
  ApiResponseCompanyVerification,
  ApiResponseHumanInterview,
  ApiResponseModeratorCompanyDetail,
  ApiResponsePageCandidateApplicationListItem,
  ApiResponsePageModeratorCompanyListItem,
  CandidateApplicationDetailResponse,
  CandidateApplicationListItem,
  CandidateApplicationReviewResponse,
  CandidateApplicationReviewStatus,
  CompanyVerificationResponse,
  CompanyVerificationStatus,
  DecisionRequest,
  HumanInterviewCompleteRequest,
  HumanInterviewRequest,
  HumanInterviewResponse,
  ModeratorCompanyDetailResponse,
  ModeratorCompanyListItem,
  Page,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

/** Paging shared by both queues; `page` is zero-based, as Spring expects. */
export type PageParams = {
  page?: number;
  size?: number;
  sort?: string;
};

const DEFAULT_PAGE_SIZE = 12;

function pageQuery(params: PageParams | undefined) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? DEFAULT_PAGE_SIZE,
    sort: params?.sort ?? "id,desc",
  };
}

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* --------------------------------------------------------- companies --- */

    getCompanies: builder.query<
      Page<ModeratorCompanyListItem>,
      (PageParams & { verificationStatus?: CompanyVerificationStatus }) | void
    >({
      query: (params) => ({
        url: "/moderator/companies",
        params: {
          verificationStatus: params?.verificationStatus,
          ...pageQuery(params || undefined),
        },
      }),
      transformResponse: (response: ApiResponsePageModeratorCompanyListItem) =>
        unwrapApiResponse(response),
      providesTags: ["Companies"],
    }),

    getCompany: builder.query<ModeratorCompanyDetailResponse, number>({
      query: (companyId) => `/moderator/companies/${companyId}`,
      transformResponse: (response: ApiResponseModeratorCompanyDetail) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, companyId) => [
        { type: "CompanyDetail", id: companyId },
      ],
    }),

    /**
     * The three verification decisions share a body and a response, so they are
     * one endpoint keyed by `decision` — the caller passes the verb, not a URL.
     */
    decideCompany: builder.mutation<
      CompanyVerificationResponse,
      {
        companyId: number;
        decision: "approve" | "reject" | "request-revision";
        body?: DecisionRequest;
      }
    >({
      query: ({ companyId, decision, body }) => ({
        url: `/moderator/companies/${companyId}/${decision}`,
        method: "POST",
        body: body ?? {},
      }),
      transformResponse: (response: ApiResponseCompanyVerification) =>
        unwrapApiResponse(response),
      // Reflect a successful decision immediately. Tag invalidation below still
      // refetches afterwards, so the server remains the final source of truth.
      onQueryStarted: async ({ companyId, decision }, { dispatch, queryFulfilled }) => {
        try {
          const { data: verification } = await queryFulfilled;
          dispatch(
            moderationApi.util.updateQueryData("getCompany", companyId, (draft) => {
              draft.verificationHistory.push(verification);
              if (decision === "approve") {
                draft.company.verificationStatus = "APPROVED";
              } else if (decision === "reject") {
                draft.company.verificationStatus = "REJECTED";
              }
            }),
          );
        } catch {
          // Failed requests must leave the visible state unchanged.
        }
      },
      invalidatesTags: (_result, _error, { companyId }) => [
        "Companies",
        { type: "CompanyDetail", id: companyId },
      ],
    }),

    /* ------------------------------------------------------ applications --- */

    getApplications: builder.query<
      Page<CandidateApplicationListItem>,
      (PageParams & { status?: CandidateApplicationReviewStatus }) | void
    >({
      query: (params) => ({
        url: "/moderator/candidate-applications",
        params: {
          status: params?.status,
          ...pageQuery(params || undefined),
        },
      }),
      transformResponse: (
        response: ApiResponsePageCandidateApplicationListItem,
      ) => unwrapApiResponse(response),
      providesTags: ["Applications"],
    }),

    getApplication: builder.query<CandidateApplicationDetailResponse, number>({
      query: (applicationId) =>
        `/moderator/candidate-applications/${applicationId}`,
      transformResponse: (response: ApiResponseCandidateApplicationDetail) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, applicationId) => [
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    /**
     * Approve, reject and forward again differ only by verb. `forward` takes no
     * body; sending an empty object is harmless and keeps one signature.
     */
    decideApplication: builder.mutation<
      CandidateApplicationReviewResponse,
      {
        applicationId: number;
        decision: "approve" | "reject" | "forward";
        body?: DecisionRequest;
      }
    >({
      query: ({ applicationId, decision, body }) => ({
        url: `/moderator/candidate-applications/${applicationId}/${decision}`,
        method: "POST",
        body: body ?? {},
      }),
      transformResponse: (response: ApiResponseCandidateApplicationReview) =>
        unwrapApiResponse(response),
      // The returned review contains the new status, timestamps and note.
      // Updating this cache makes the result visible before the refetch ends.
      onQueryStarted: async ({ applicationId }, { dispatch, queryFulfilled }) => {
        try {
          const { data: review } = await queryFulfilled;
          dispatch(
            moderationApi.util.updateQueryData(
              "getApplication",
              applicationId,
              (draft) => {
                draft.review = review;
              },
            ),
          );
        } catch {
          // An error toast is shown by the caller; do not fabricate a result.
        }
      },
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Applications",
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    /* --------------------------------------------------- human interviews --- */

    scheduleHumanInterview: builder.mutation<
      HumanInterviewResponse,
      { applicationId: number; body: HumanInterviewRequest }
    >({
      query: ({ applicationId, body }) => ({
        url: `/moderator/candidate-applications/${applicationId}/human-interviews`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseHumanInterview) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Applications",
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    rescheduleHumanInterview: builder.mutation<
      HumanInterviewResponse,
      { interviewId: number; applicationId: number; body: HumanInterviewRequest }
    >({
      query: ({ interviewId, body }) => ({
        url: `/moderator/human-interviews/${interviewId}/reschedule`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseHumanInterview) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    completeHumanInterview: builder.mutation<
      HumanInterviewResponse,
      {
        interviewId: number;
        applicationId: number;
        body: HumanInterviewCompleteRequest;
      }
    >({
      query: ({ interviewId, body }) => ({
        url: `/moderator/human-interviews/${interviewId}/complete`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseHumanInterview) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Applications",
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    cancelHumanInterview: builder.mutation<
      HumanInterviewResponse,
      { interviewId: number; applicationId: number }
    >({
      query: ({ interviewId }) => ({
        url: `/moderator/human-interviews/${interviewId}/cancel`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseHumanInterview) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Applications",
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyQuery,
  useDecideCompanyMutation,
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useDecideApplicationMutation,
  useScheduleHumanInterviewMutation,
  useRescheduleHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useCancelHumanInterviewMutation,
} = moderationApi;
