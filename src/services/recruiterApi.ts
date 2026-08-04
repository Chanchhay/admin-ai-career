import type {
  ApiResponseCompanyDocumentResponse,
  ApiResponseCompanyResponse,
  ApiResponseForwardedApplicationResponse,
  ApiResponseJobPostResponse,
  ApiResponseListCompanyDocumentResponse,
  ApiResponseListForwardedApplicationResponse,
  ApiResponseListJobPostResponse,
  ApiResponsePagePublicTalentListItemResponse,
  ApiResponsePublicResumeDownloadResponse,
  ApiResponsePublicTalentDetailResponse,
  ApiResponseRecruiterProfileResponse,
  CompanyCreateRequest,
  CompanyDocumentRequest,
  CompanyDocumentResponse,
  CompanyResponse,
  CompanyUpdateRequest,
  ForwardedApplicationResponse,
  JobPostRequest,
  JobPostResponse,
  Page,
  PublicResumeDownloadResponse,
  PublicTalentDetailResponse,
  PublicTalentListItemResponse,
  RecruiterProfileResponse,
  RecruiterProfileUpdateRequest,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

type Id = string | number;

/** A job's status change also changes what `/public/jobs` returns. */
const jobWriteTags = (_r: unknown, _e: unknown, arg: { id: Id } | Id) => [
  "RecruiterJobs" as const,
  "PublicJobs" as const,
  {
    type: "RecruiterJobs" as const,
    id: typeof arg === "object" ? arg.id : arg,
  },
];

export const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruiterCompany: builder.query<CompanyResponse, void>({
      query: () => "/recruiter/companies/me",
      transformResponse: (response: ApiResponseCompanyResponse) =>
        unwrapApiResponse(response),
      providesTags: ["RecruiterCompany"],
    }),
    createCompany: builder.mutation<CompanyResponse, CompanyCreateRequest>({
      query: (body) => ({ url: "/recruiter/companies", method: "POST", body }),
      transformResponse: (response: ApiResponseCompanyResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["RecruiterCompany"],
    }),
    updateCompany: builder.mutation<
      CompanyResponse,
      { id: Id; body: CompanyUpdateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/recruiter/companies/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseCompanyResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["RecruiterCompany"],
    }),
    submitCompanyVerification: builder.mutation<CompanyResponse, Id>({
      query: (companyId) => ({
        url: `/recruiter/companies/${companyId}/submit-verification`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseCompanyResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["RecruiterCompany", "CompanyDocuments"],
    }),
    getCompanyDocuments: builder.query<CompanyDocumentResponse[], number>({
      query: (companyId) => `/recruiter/companies/${companyId}/documents`,
      transformResponse: (response: ApiResponseListCompanyDocumentResponse) =>
        unwrapApiResponse(response),
      providesTags: ["CompanyDocuments"],
    }),
    addCompanyDocument: builder.mutation<
      CompanyDocumentResponse,
      { companyId: Id; body: CompanyDocumentRequest }
    >({
      query: ({ companyId, body }) => ({
        url: `/recruiter/companies/${companyId}/documents`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseCompanyDocumentResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["CompanyDocuments"],
    }),
    deleteCompanyDocument: builder.mutation<
      void,
      { companyId: Id; documentId: Id }
    >({
      query: ({ companyId, documentId }) => ({
        url: `/recruiter/companies/${companyId}/documents/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyDocuments"],
    }),
    getRecruiterJobs: builder.query<JobPostResponse[], void>({
      query: () => "/recruiter/jobs",
      transformResponse: (response: ApiResponseListJobPostResponse) =>
        unwrapApiResponse(response),
      providesTags: ["RecruiterJobs"],
    }),
    getRecruiterJob: builder.query<JobPostResponse, Id>({
      query: (id) => `/recruiter/jobs/${id}`,
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "RecruiterJobs", id }],
    }),
    createJobDraft: builder.mutation<JobPostResponse, JobPostRequest>({
      query: (body) => ({ url: "/recruiter/jobs", method: "POST", body }),
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["RecruiterJobs"],
    }),
    updateJob: builder.mutation<JobPostResponse, { id: Id; body: JobPostRequest }>(
      {
        query: ({ id, body }) => ({
          url: `/recruiter/jobs/${id}`,
          method: "PUT",
          body,
        }),
        transformResponse: (response: ApiResponseJobPostResponse) =>
          unwrapApiResponse(response),
        invalidatesTags: jobWriteTags,
      },
    ),
    publishJob: builder.mutation<JobPostResponse, Id>({
      query: (id) => ({ url: `/recruiter/jobs/${id}/publish`, method: "POST" }),
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: jobWriteTags,
    }),
    pauseJob: builder.mutation<JobPostResponse, Id>({
      query: (id) => ({ url: `/recruiter/jobs/${id}/pause`, method: "POST" }),
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: jobWriteTags,
    }),
    resumeJob: builder.mutation<JobPostResponse, Id>({
      query: (id) => ({ url: `/recruiter/jobs/${id}/resume`, method: "POST" }),
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: jobWriteTags,
    }),
    closeJob: builder.mutation<JobPostResponse, Id>({
      query: (id) => ({ url: `/recruiter/jobs/${id}/close`, method: "POST" }),
      transformResponse: (response: ApiResponseJobPostResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: jobWriteTags,
    }),
    updateRecruiterProfile: builder.mutation<
      RecruiterProfileResponse,
      RecruiterProfileUpdateRequest
    >({
      query: (body) => ({
        url: "/recruiter/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseRecruiterProfileResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["CurrentUser"],
    }),
    getForwardedApplications: builder.query<
      ForwardedApplicationResponse[],
      void
    >({
      query: () => "/recruiter/forwarded-applications",
      transformResponse: (
        response: ApiResponseListForwardedApplicationResponse,
      ) => unwrapApiResponse(response),
      providesTags: ["ForwardedApplications"],
    }),
    getForwardedApplication: builder.query<ForwardedApplicationResponse, Id>({
      query: (id) => `/recruiter/forwarded-applications/${id}`,
      transformResponse: (response: ApiResponseForwardedApplicationResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [
        { type: "ForwardedApplications", id },
      ],
    }),
    getTalent: builder.query<
      Page<PublicTalentListItemResponse>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/recruiter/talent",
        params: params ?? undefined,
      }),
      transformResponse: (
        response: ApiResponsePagePublicTalentListItemResponse,
      ) => unwrapApiResponse(response),
      providesTags: ["Talent"],
    }),
    getTalentDetail: builder.query<PublicTalentDetailResponse, string>({
      query: (slug) => `/recruiter/talent/${encodeURIComponent(slug)}`,
      transformResponse: (response: ApiResponsePublicTalentDetailResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Talent", id }],
    }),
    getTalentResumeDownload: builder.query<
      PublicResumeDownloadResponse,
      { slug: string; resumeId: Id }
    >({
      query: ({ slug, resumeId }) =>
        `/recruiter/talent/${encodeURIComponent(slug)}/resumes/${resumeId}/download`,
      transformResponse: (response: ApiResponsePublicResumeDownloadResponse) =>
        unwrapApiResponse(response),
    }),
  }),
});

export const {
  useGetRecruiterCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useSubmitCompanyVerificationMutation,
  useGetCompanyDocumentsQuery,
  useAddCompanyDocumentMutation,
  useDeleteCompanyDocumentMutation,
  useGetRecruiterJobsQuery,
  useGetRecruiterJobQuery,
  useCreateJobDraftMutation,
  useUpdateJobMutation,
  usePublishJobMutation,
  usePauseJobMutation,
  useResumeJobMutation,
  useCloseJobMutation,
  useUpdateRecruiterProfileMutation,
  useGetForwardedApplicationsQuery,
  useGetForwardedApplicationQuery,
  useGetTalentQuery,
  useGetTalentDetailQuery,
  useLazyGetTalentResumeDownloadQuery,
} = recruiterApi;
