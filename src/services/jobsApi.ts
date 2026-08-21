import type {
  ApiResponsePagePublicJob,
  ApiResponsePublicJob,
  Page,
  PublicJobResponse,
  PublicJobsQuery,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicJobs: builder.query<Page<PublicJobResponse>, PublicJobsQuery | void>({
      query: (params) => ({
        url: "/public/jobs",
        params: params ?? { page: 0, size: 10 },
      }),
      transformResponse: (response: ApiResponsePagePublicJob) => {
        const payload = unwrapApiResponse(response);
        const { number, size, totalElements, totalPages } = payload.page;
        const numberOfElements = payload.content.length;
        const emptySort = { empty: true, sorted: false, unsorted: true };

        // Normalize the backend's compact `{ content, page }` DTO to the Page
        // shape shared by the console's pager.
        return {
          content: payload.content,
          number,
          size,
          totalElements,
          totalPages,
          numberOfElements,
          first: number === 0,
          last: totalPages === 0 || number >= totalPages - 1,
          empty: numberOfElements === 0,
          sort: emptySort,
          pageable: {
            offset: number * size,
            paged: true,
            pageNumber: number,
            pageSize: size,
            sort: emptySort,
            unpaged: false,
          },
        };
      },
      providesTags: ["Jobs"],
    }),
    getPublicJob: builder.query<PublicJobResponse, number>({
      query: (jobId) => `/public/jobs/${jobId}`,
      transformResponse: (response: ApiResponsePublicJob) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Jobs", id }],
    }),
  }),
});

export const { useGetPublicJobsQuery, useGetPublicJobQuery } = jobsApi;
