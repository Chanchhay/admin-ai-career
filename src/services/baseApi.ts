import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/contracts";

/**
 * Peels the backend's `{ success, message, data }` envelope. A `success: false`
 * body can still arrive with HTTP 200, so this throws rather than letting a
 * failed call render as empty data.
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

export const baseApi = createApi({
  reducerPath: "api",
  // Same origin as the page: the Spring Cloud Gateway serves this console under
  // /admin and forwards /api/** to the backend, attaching the access token
  // itself. The browser only ever holds the gateway's session cookie.
  //
  // Unaffected by the app's `basePath` — that rewrites Next.js routes and
  // assets, not the URLs handed to fetch.
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: [
    "Session",
    "CurrentUser",
    "Companies",
    "CompanyDetail",
    "Applications",
    "ApplicationDetail",
    "Industries",
    "JobCategories",
    "Skills",
    "AiInterviewConfig",
    "AdminUsers",
    "AdminUserDetail",
    "AdminDashboard",
  ],
  endpoints: () => ({}),
});
