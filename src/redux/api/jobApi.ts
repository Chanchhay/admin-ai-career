import { baseApi } from "./baseApi";
import type { CreateJobRequest, Job, JobAllotment } from "@/types/job";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllotment: builder.query<JobAllotment, void>({
      query: () => "/jobs/allotment",
      providesTags: ["Allotment"],
    }),

    createJob: builder.mutation<Job, CreateJobRequest>({
      query: (body) => ({ url: "/jobs", method: "POST", body }),
      invalidatesTags: ["Job", "Allotment"],
    }),
  }),
});

export const { useGetAllotmentQuery, useCreateJobMutation } = jobApi;