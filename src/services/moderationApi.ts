/**
 * Company verification and the candidate review queue — `/api/v1/moderator/**`.
 *
 * The backend enforces no role on these; the gateway only requires a session.
 * Whoever reaches this console can act, so the screens rely on the decision
 * buttons being deliberate rather than on the API refusing the wrong caller.
 */

import type {
  ApiResponseApplicationSettings,
  ApplicationSettingsRequest,
  ApplicationSettingsResponse,
  ApiResponseCandidateApplicationDetail,
  ApiResponseCandidateApplicationReview,
  ApiResponseCompanyVerification,
  ApiResponseHumanInterview,
  ApiResponseModeratorCompanyDetail,
  CompanyIdentityVisibility,
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
  ModeratorJobListItem,
  ApiResponsePageModeratorJob,
  ApiResponseModeratorJob,
  ApiResponseModeratorJobDetail,
  ModeratorJobDetail,
  Page,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

/** Paging shared by both queues; `page` is zero-based, as Spring expects. */
export type PageParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export const DEFAULT_PAGE_SIZE = 20;

/** What the rows-per-page control offers; Spring caps a page at 2000. */
export const PAGE_SIZES = [10, 20, 50, 100] as const;

function pageQuery(params: PageParams | undefined) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? DEFAULT_PAGE_SIZE,
    /*
     * Newest first, by the audit timestamp rather than by id.
     *
     * `id` is a random v4 UUID, not a time-ordered one, so sorting on it puts
     * the rows in an order with no meaning — harmless-looking on one page, and
     * plainly broken once you can jump to page four and find it unrelated to
     * page three. Both entities these queues page over extend BaseEntity, so
     * `createdAt` is always there to sort on.
     */
    sort: params?.sort ?? "createdAt,desc",
  };
}

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------------------- application settings --- */

    getApplicationSettings: builder.query<ApplicationSettingsResponse, void>({
      query: () => "/admin/application-settings",
      transformResponse: (response: ApiResponseApplicationSettings) =>
        unwrapApiResponse(response),
      providesTags: ["ApplicationSettings"],
    }),
    updateApplicationSettings: builder.mutation<
      ApplicationSettingsResponse,
      ApplicationSettingsRequest
    >({
      query: (body) => ({
        url: "/admin/application-settings",
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseApplicationSettings) =>
        unwrapApiResponse(response),
      invalidatesTags: ["ApplicationSettings"],
    }),
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
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["Companies"],
    }),

    getCompany: builder.query<ModeratorCompanyDetailResponse, string>({
      query: (companyId) => `/moderator/companies/${companyId}`,
      transformResponse: (response: ApiResponseModeratorCompanyDetail) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, companyId) => [
        { type: "CompanyDetail", id: companyId },
      ],
    }),

    /**
     * Every verification decision shares a body and a response, so they are one
     * endpoint keyed by `decision` — the caller passes the verb, not a URL.
     *
     * `suspend` and `reinstate` only apply to a company in the right state and
     * answer 409 otherwise; the screens offer whichever one is legal rather
     * than relying on that.
     */
    decideCompany: builder.mutation<
      CompanyVerificationResponse,
      {
        companyId: string;
        decision:
          | "approve"
          | "reject"
          | "request-revision"
          | "suspend"
          | "reinstate";
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
      // Suspending takes a company's jobs out of the public listings, so the
      // job caches have to go with it.
      invalidatesTags: (_result, _error, { companyId }) => [
        "Companies",
        { type: "CompanyDetail", id: companyId },
        "Jobs",
      ],
    }),

    /**
     * Shows or hides a company's identity from candidates.
     *
     * Invalidates the public job caches as well: masking changes what every one
     * of that company's listings says, and the console renders those too.
     */
    setCompanyIdentityVisibility: builder.mutation<
      ModeratorCompanyDetailResponse,
      { companyId: string; visibility: CompanyIdentityVisibility }
    >({
      query: ({ companyId, visibility }) => ({
        url: `/moderator/companies/${companyId}/identity-visibility`,
        method: "PATCH",
        body: { visibility },
      }),
      transformResponse: (response: ApiResponseModeratorCompanyDetail) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { companyId }) => [
        "Companies",
        { type: "CompanyDetail", id: companyId },
        "Jobs",
      ],
    }),

    /**
     * Sets or clears the stand-in logo shown while a company is masked.
     *
     * Invalidates the public job caches for the same reason masking does: the
     * mark on every one of that company's listings changes with it.
     */
    setCompanyMaskedProfile: builder.mutation<
      ModeratorCompanyDetailResponse,
      { companyId: string; maskedLogoUrl: string | null }
    >({
      query: ({ companyId, maskedLogoUrl }) => ({
        url: `/moderator/companies/${companyId}/masked-profile`,
        method: "PATCH",
        body: { maskedLogoUrl },
      }),
      transformResponse: (response: ApiResponseModeratorCompanyDetail) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { companyId }) => [
        "Companies",
        { type: "CompanyDetail", id: companyId },
        "Jobs",
      ],
    }),

    /* ------------------------------------------------------------- jobs --- */

    /**
     * Every job a company has posted, in any state.
     *
     * Lives beside the company rather than under a section of its own: a job
     * is only ever looked at here in the context of the company that posted
     * it, and the console has no authority to create or edit one.
     */
    getCompanyJobs: builder.query<
      Page<ModeratorJobListItem>,
      { companyId: string } & PageParams
    >({
      query: ({ companyId, ...params }) => ({
        url: `/moderator/companies/${companyId}/jobs`,
        params: pageQuery(params),
      }),
      transformResponse: (response: ApiResponsePageModeratorJob) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: (_result, _error, { companyId }) => [
        { type: "CompanyJobs", id: companyId },
      ],
    }),

    /** One job in full — any state, unlike the public endpoint. */
    getJob: builder.query<ModeratorJobDetail, string>({
      query: (jobId) => `/moderator/jobs/${jobId}`,
      transformResponse: (response: ApiResponseModeratorJobDetail) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, jobId) => [{ type: "Jobs", id: jobId }],
    }),

    /**
     * Takes a live posting down, puts it back, or closes it. One endpoint
     * keyed by the verb, as the company decisions are.
     *
     * Invalidates the public job caches as well: pausing changes what
     * candidates can find, and the console renders those listings too.
     */
    moderateJob: builder.mutation<
      ModeratorJobListItem,
      {
        jobId: string;
        companyId: string;
        action: "pause" | "resume" | "close";
        body?: DecisionRequest;
      }
    >({
      query: ({ jobId, action, body }) => ({
        url: `/moderator/jobs/${jobId}/${action}`,
        method: "POST",
        body: body ?? {},
      }),
      transformResponse: (response: ApiResponseModeratorJob) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { companyId, jobId }) => [
        { type: "CompanyJobs", id: companyId },
        { type: "Jobs", id: jobId },
        "Jobs",
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
      ) => normalizePage(unwrapApiResponse(response)),
      providesTags: ["Applications"],
    }),

    getApplication: builder.query<CandidateApplicationDetailResponse, string>({
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
        applicationId: string;
        decision: "approve" | "reject" | "forward";
        body?: DecisionRequest;
      }
    >({
      query: ({ applicationId, decision, body }) => {
        const request: {
          url: string;
          method: "POST";
          body?: DecisionRequest;
        } = {
          url: `/moderator/candidate-applications/${applicationId}/${decision}`,
          method: "POST",
        };

        // `forward` has no request body in the OpenAPI contract.
        if (decision !== "forward") request.body = body ?? {};
        return request;
      },
      transformResponse: (response: ApiResponseCandidateApplicationReview) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Applications",
        { type: "ApplicationDetail", id: applicationId },
      ],
    }),

    /* --------------------------------------------------- human interviews --- */

    scheduleHumanInterview: builder.mutation<
      HumanInterviewResponse,
      { applicationId: string; body: HumanInterviewRequest }
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
      { interviewId: string; applicationId: string; body: HumanInterviewRequest }
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
        interviewId: string;
        applicationId: string;
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
      { interviewId: string; applicationId: string }
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
  useGetCompanyJobsQuery,
  useGetJobQuery,
  useModerateJobMutation,
  useSetCompanyIdentityVisibilityMutation,
  useSetCompanyMaskedProfileMutation,
  useGetCompanyQuery,
  useDecideCompanyMutation,
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useDecideApplicationMutation,
  useScheduleHumanInterviewMutation,
  useRescheduleHumanInterviewMutation,
  useCompleteHumanInterviewMutation,
  useCancelHumanInterviewMutation,
  useGetApplicationSettingsQuery,
  useUpdateApplicationSettingsMutation,
} = moderationApi;
