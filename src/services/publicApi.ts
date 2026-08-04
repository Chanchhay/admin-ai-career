import type {
  ApiResponseListPublicIndustryResponse,
  ApiResponseListPublicJobCategoryResponse,
  ApiResponseListPublicSkillResponse,
  ApiResponsePagePublicJobResponse,
  ApiResponsePublicJobResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export type PublicJobsQuery = {
  keyword?: string;
  location?: string;
  categoryId?: number;
  skillIds?: number[];
  workMode?: string;
  jobType?: string;
  page?: number;
  size?: number;
};

function unwrapPublicJobs(response: ApiResponsePagePublicJobResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicJob(response: ApiResponsePublicJobResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicSkills(response: ApiResponseListPublicSkillResponse) {
  return unwrapApiResponse(response);
}

function unwrapPublicJobCategories(
  response: ApiResponseListPublicJobCategoryResponse,
) {
  return unwrapApiResponse(response);
}

function unwrapPublicIndustries(
  response: ApiResponseListPublicIndustryResponse,
) {
  return unwrapApiResponse(response);
}

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicJobs: builder.query<
      ReturnType<typeof unwrapPublicJobs>,
      PublicJobsQuery | void
    >({
      query: (params) => ({ url: "/public/jobs", params: params ?? undefined }),
      transformResponse: unwrapPublicJobs,
      providesTags: ["PublicJobs"],
    }),
    getPublicJob: builder.query<
      ReturnType<typeof unwrapPublicJob>,
      string | number
    >({
      query: (jobId) => `/public/jobs/${jobId}`,
      transformResponse: unwrapPublicJob,
      providesTags: (_result, _error, id) => [{ type: "PublicJobs", id }],
    }),
    getPublicSkills: builder.query<
      ReturnType<typeof unwrapPublicSkills>,
      void
    >({
      query: () => "/public/skills",
      transformResponse: unwrapPublicSkills,
    }),
    getPublicJobCategories: builder.query<
      ReturnType<typeof unwrapPublicJobCategories>,
      void
    >({
      query: () => "/public/job-categories",
      transformResponse: unwrapPublicJobCategories,
    }),
    getPublicIndustries: builder.query<
      ReturnType<typeof unwrapPublicIndustries>,
      void
    >({
      query: () => "/public/industries",
      transformResponse: unwrapPublicIndustries,
    }),
  }),
});

export const {
  useGetPublicJobsQuery,
  useGetPublicJobQuery,
  useGetPublicSkillsQuery,
  useGetPublicJobCategoriesQuery,
  useGetPublicIndustriesQuery,
} = publicApi;
