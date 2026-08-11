import type {
  AiInterviewAnswerRequest,
  AiInterviewResultResponse,
  AiInterviewSessionResponse,
  ApiResponseAiInterviewResultResponse,
  ApiResponseAiInterviewSessionResponse,
  ApiResponseJobApplicationResponse,
  ApiResponseJobSeekerProfileResponse,
  ApiResponsePublicationResponse,
  ApiResponseListAiInterviewSessionResponse,
  ApiResponseListJobApplicationResponse,
  ApiResponseListPortfolioResponse,
  ApiResponseListResumeResponse,
  ApiResponsePortfolioResponse,
  ApiResponsePortfolioProjectResponse,
  ApiResponseResumeResponse,
  ApiResponseVoid,
  JobApplicationResponse,
  JobApplicationCreateRequest,
  JobSeekerProfileResponse,
  JobSeekerProfileUpdateRequest,
  PublicationRequest,
  PublicationResponse,
  PortfolioResponse,
  PortfolioCreateRequest,
  PortfolioUpdateRequest,
  PortfolioProjectRequest,
  PortfolioProjectResponse,
  PortfolioProjectUpdateRequest,
  ResumeCreateRequest,
  ResumeResponse,
  ResumeUpdateRequest,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const jobSeekerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobSeekerProfile: builder.query<JobSeekerProfileResponse, void>({
      query: () => "/job-seeker/profile",
      transformResponse: (response: ApiResponseJobSeekerProfileResponse) =>
        unwrapApiResponse(response),
      providesTags: ["JobSeekerProfile"],
    }),
    updateJobSeekerProfile: builder.mutation<
      JobSeekerProfileResponse,
      JobSeekerProfileUpdateRequest
    >({
      query: (body) => ({
        url: "/job-seeker/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseJobSeekerProfileResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["JobSeekerProfile"],
    }),
    updateJobSeekerPublication: builder.mutation<
      PublicationResponse,
      PublicationRequest
    >({
      query: (body) => ({
        url: "/job-seeker/profile/publication",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponsePublicationResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["JobSeekerProfile"],
    }),
    getResumes: builder.query<ResumeResponse[], void>({
      query: () => "/job-seeker/resumes",
      transformResponse: (response: ApiResponseListResumeResponse) =>
        unwrapApiResponse(response),
      providesTags: ["Resumes"],
    }),
    getResume: builder.query<ResumeResponse, string | number>({
      query: (id) => `/job-seeker/resumes/${id}`,
      transformResponse: (response: ApiResponseResumeResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Resumes", id }],
    }),
    createResume: builder.mutation<ResumeResponse, ResumeCreateRequest>({
      query: (body) => ({
        url: "/job-seeker/resumes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseResumeResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Resumes"],
    }),
    setDefaultResume: builder.mutation<ResumeResponse, string | number>({
      query: (resumeId) => ({
        url: `/job-seeker/resumes/${resumeId}/default`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseResumeResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Resumes"],
    }),
    updateResume: builder.mutation<
      ResumeResponse,
      { resumeId: string | number; body: ResumeUpdateRequest }
    >({
      query: ({ resumeId, body }) => ({
        url: `/job-seeker/resumes/${resumeId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseResumeResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { resumeId }) => [
        "Resumes",
        { type: "Resumes", id: resumeId },
      ],
    }),
    deleteResume: builder.mutation<
      ApiResponseVoid["data"],
      string | number
    >({
      query: (resumeId) => ({
        url: `/job-seeker/resumes/${resumeId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponseVoid) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, resumeId) => [
        "Resumes",
        { type: "Resumes", id: resumeId },
      ],
    }),
    getPortfolios: builder.query<PortfolioResponse[], void>({
      query: () => "/job-seeker/portfolios",
      transformResponse: (response: ApiResponseListPortfolioResponse) =>
        unwrapApiResponse(response),
      providesTags: ["Portfolios"],
    }),
    getPortfolio: builder.query<PortfolioResponse, string | number>({
      query: (id) => `/job-seeker/portfolios/${id}`,
      transformResponse: (response: ApiResponsePortfolioResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Portfolios", id }],
    }),
    createPortfolio: builder.mutation<PortfolioResponse, PortfolioCreateRequest>({
      query: (body) => ({ url: "/job-seeker/portfolios", method: "POST", body }),
      transformResponse: (response: ApiResponsePortfolioResponse) => unwrapApiResponse(response),
      invalidatesTags: ["Portfolios"],
    }),
    updatePortfolio: builder.mutation<PortfolioResponse, { portfolioId: string | number; body: PortfolioUpdateRequest }>({
      query: ({ portfolioId, body }) => ({ url: `/job-seeker/portfolios/${portfolioId}`, method: "PATCH", body }),
      transformResponse: (response: ApiResponsePortfolioResponse) => unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { portfolioId }) => ["Portfolios", { type: "Portfolios", id: portfolioId }],
    }),
    deletePortfolio: builder.mutation<ApiResponseVoid["data"], string | number>({
      query: (portfolioId) => ({ url: `/job-seeker/portfolios/${portfolioId}`, method: "DELETE" }),
      transformResponse: (response: ApiResponseVoid) => unwrapApiResponse(response),
      invalidatesTags: ["Portfolios"],
    }),
    createPortfolioProject: builder.mutation<PortfolioProjectResponse, { portfolioId: string | number; body: PortfolioProjectRequest }>({
      query: ({ portfolioId, body }) => ({ url: `/job-seeker/portfolios/${portfolioId}/projects`, method: "POST", body }),
      transformResponse: (response: ApiResponsePortfolioProjectResponse) => unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { portfolioId }) => ["Portfolios", { type: "Portfolios", id: portfolioId }],
    }),
    updatePortfolioProject: builder.mutation<PortfolioProjectResponse, { portfolioId: string | number; projectId: string | number; body: PortfolioProjectUpdateRequest }>({
      query: ({ portfolioId, projectId, body }) => ({ url: `/job-seeker/portfolios/${portfolioId}/projects/${projectId}`, method: "PATCH", body }),
      transformResponse: (response: ApiResponsePortfolioProjectResponse) => unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { portfolioId }) => ["Portfolios", { type: "Portfolios", id: portfolioId }],
    }),
    deletePortfolioProject: builder.mutation<ApiResponseVoid["data"], { portfolioId: string | number; projectId: string | number }>({
      query: ({ portfolioId, projectId }) => ({ url: `/job-seeker/portfolios/${portfolioId}/projects/${projectId}`, method: "DELETE" }),
      transformResponse: (response: ApiResponseVoid) => unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { portfolioId }) => ["Portfolios", { type: "Portfolios", id: portfolioId }],
    }),
    getApplications: builder.query<JobApplicationResponse[], void>({
      query: () => "/job-seeker/applications",
      transformResponse: (response: ApiResponseListJobApplicationResponse) =>
        unwrapApiResponse(response),
      providesTags: ["Applications"],
    }),
    getApplication: builder.query<JobApplicationResponse, string | number>({
      query: (id) => `/job-seeker/applications/${id}`,
      transformResponse: (response: ApiResponseJobApplicationResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Applications", id }],
    }),
    applyToJob: builder.mutation<
      JobApplicationResponse,
      { jobId: string | number; body: JobApplicationCreateRequest }
    >({
      query: ({ jobId, body }) => ({
        url: `/job-seeker/jobs/${jobId}/applications`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseJobApplicationResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Applications"],
    }),
    getAiInterviews: builder.query<AiInterviewSessionResponse[], void>({
      query: () => "/job-seeker/ai-interviews",
      transformResponse: (response: ApiResponseListAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      providesTags: ["Interviews"],
    }),
    getAiInterview: builder.query<AiInterviewSessionResponse, string | number>({
      query: (id) => `/job-seeker/ai-interviews/${id}`,
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Interviews", id }],
    }),
    getAiInterviewResult: builder.query<
      AiInterviewResultResponse,
      string | number
    >({
      query: (id) => `/job-seeker/ai-interviews/${id}/result`,
      transformResponse: (response: ApiResponseAiInterviewResultResponse) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Interviews", id }],
    }),
    createAiInterviewForJob: builder.mutation<
      AiInterviewSessionResponse,
      string | number
    >({
      query: (jobId) => ({
        url: `/job-seeker/jobs/${jobId}/ai-interviews`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Interviews"],
    }),
    createAiInterviewForApplication: builder.mutation<
      AiInterviewSessionResponse,
      string | number
    >({
      query: (applicationId) => ({
        url: `/job-seeker/applications/${applicationId}/ai-interviews`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Interviews"],
    }),
    startAiInterview: builder.mutation<AiInterviewSessionResponse, string | number>({
      query: (sessionId) => ({
        url: `/job-seeker/ai-interviews/${sessionId}/start`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, sessionId) => [
        "Interviews",
        { type: "Interviews", id: sessionId },
      ],
    }),
    submitAiInterviewAnswer: builder.mutation<
      AiInterviewSessionResponse,
      {
        sessionId: string | number;
        questionId: string | number;
        body: AiInterviewAnswerRequest;
      }
    >({
      query: ({ sessionId, questionId, body }) => ({
        url: `/job-seeker/ai-interviews/${sessionId}/questions/${questionId}/answer`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseAiInterviewSessionResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "Interviews", id: sessionId },
      ],
    }),
    completeAiInterview: builder.mutation<AiInterviewResultResponse, string | number>({
      query: (sessionId) => ({
        url: `/job-seeker/ai-interviews/${sessionId}/complete`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseAiInterviewResultResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, sessionId) => [
        "Interviews",
        { type: "Interviews", id: sessionId },
      ],
    }),
  }),
});

export const {
  useGetJobSeekerProfileQuery,
  useUpdateJobSeekerProfileMutation,
  useUpdateJobSeekerPublicationMutation,
  useGetResumesQuery,
  useGetResumeQuery,
  useCreateResumeMutation,
  useSetDefaultResumeMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useGetPortfoliosQuery,
  useGetPortfolioQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useCreatePortfolioProjectMutation,
  useUpdatePortfolioProjectMutation,
  useDeletePortfolioProjectMutation,
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useApplyToJobMutation,
  useGetAiInterviewsQuery,
  useGetAiInterviewQuery,
  useGetAiInterviewResultQuery,
  useCreateAiInterviewForJobMutation,
  useCreateAiInterviewForApplicationMutation,
  useStartAiInterviewMutation,
  useSubmitAiInterviewAnswerMutation,
  useCompleteAiInterviewMutation,
} = jobSeekerApi;
