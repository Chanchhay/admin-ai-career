/**
 * Reference data is read from `/api/v1/public/{industries,job-categories,skills}`
 * and changed through `/api/v1/admin/**`.
 *
 * All three resources expose the same list / create / update / delete shape, so
 * the console drives them from one screen; the endpoints stay separate because
 * their payloads differ (an industry has a status, a skill has a type).
 */

import type {
  ApiResponseIndustry,
  ApiResponseJobCategory,
  ApiResponseListIndustry,
  ApiResponseListJobCategory,
  ApiResponseListSkill,
  ApiResponseSkill,
  IndustryRequest,
  IndustryResponse,
  JobCategoryRequest,
  JobCategoryResponse,
  SkillRequest,
  SkillResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const taxonomyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* -------------------------------------------------------- industries --- */

    getIndustries: builder.query<IndustryResponse[], void>({
      query: () => "/public/industries",
      transformResponse: (response: ApiResponseListIndustry) =>
        unwrapApiResponse(response),
      providesTags: ["Industries"],
    }),
    createIndustry: builder.mutation<IndustryResponse, IndustryRequest>({
      query: (body) => ({ url: "/admin/industries", method: "POST", body }),
      transformResponse: (response: ApiResponseIndustry) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Industries"],
    }),
    updateIndustry: builder.mutation<
      IndustryResponse,
      { id: number; body: IndustryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/industries/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseIndustry) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Industries"],
    }),
    deleteIndustry: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/industries/${id}`, method: "DELETE" }),
      invalidatesTags: ["Industries"],
    }),

    /* ---------------------------------------------------- job categories --- */

    getJobCategories: builder.query<JobCategoryResponse[], void>({
      query: () => "/public/job-categories",
      transformResponse: (response: ApiResponseListJobCategory) =>
        unwrapApiResponse(response),
      providesTags: ["JobCategories"],
    }),
    createJobCategory: builder.mutation<JobCategoryResponse, JobCategoryRequest>({
      query: (body) => ({ url: "/admin/job-categories", method: "POST", body }),
      transformResponse: (response: ApiResponseJobCategory) =>
        unwrapApiResponse(response),
      invalidatesTags: ["JobCategories"],
    }),
    updateJobCategory: builder.mutation<
      JobCategoryResponse,
      { id: number; body: JobCategoryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/job-categories/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseJobCategory) =>
        unwrapApiResponse(response),
      invalidatesTags: ["JobCategories"],
    }),
    deleteJobCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/job-categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["JobCategories"],
    }),

    /* ------------------------------------------------------------ skills --- */

    getSkills: builder.query<SkillResponse[], void>({
      query: () => "/public/skills",
      transformResponse: (response: ApiResponseListSkill) =>
        unwrapApiResponse(response),
      providesTags: ["Skills"],
    }),
    createSkill: builder.mutation<SkillResponse, SkillRequest>({
      query: (body) => ({ url: "/admin/skills", method: "POST", body }),
      transformResponse: (response: ApiResponseSkill) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Skills"],
    }),
    updateSkill: builder.mutation<SkillResponse, { id: number; body: SkillRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/skills/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseSkill) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Skills"],
    }),
    deleteSkill: builder.mutation<void, number>({
      query: (id) => ({ url: `/admin/skills/${id}`, method: "DELETE" }),
      invalidatesTags: ["Skills"],
    }),
  }),
});

export const {
  useGetIndustriesQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
  useGetJobCategoriesQuery,
  useCreateJobCategoryMutation,
  useUpdateJobCategoryMutation,
  useDeleteJobCategoryMutation,
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = taxonomyApi;
