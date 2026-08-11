import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/contracts";

export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/backend" }),
  tagTypes: [
    "CurrentUser",
    "PublicJobs",
    "JobSeekerProfile",
    "Resumes",
    "Portfolios",
    "Applications",
    "Interviews",
    "RecruiterCompany",
    "RecruiterJobs",
    "CompanyDocuments",
    "ForwardedApplications",
    "Talent",
    "ModeratorCompanies",
  ],
  endpoints: () => ({}),
});
