import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/contracts";

export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export const baseApi = createApi({
  reducerPath: "api",
<<<<<<< Updated upstream
  baseQuery: fetchBaseQuery({ baseUrl: "/api/backend" }),
=======
  // Same origin as the page: the Spring Cloud Gateway serves this console under
  // /admin and forwards /api/** to the backend, attaching the access token
  // itself. The browser only ever holds the gateway's session cookie.
  //
  // Unaffected by the app's `basePath` — that rewrites Next.js routes and
  // assets, not the URLs handed to fetch.
  // Production traffic is served by the gateway. In standalone development the
  // same contracts are served by the local demo route under the app base path.
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === "development" ? "/admin/api/v1" : "/api/v1",
  }),
>>>>>>> Stashed changes
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
