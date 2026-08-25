import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, Page, PagedModel } from "@/contracts";

/**
 * Peels the backend's `{ success, message, data }` envelope. A `success: false`
 * body can still arrive with HTTP 200, so this throws rather than letting a
 * failed call render as empty data.
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  if (!response.success) throw new Error(response.message);
  return response.data;
}

/**
 * Flattens the backend's `PagedModel` into the `Page` shape the screens read.
 *
 * The API sets `pageSerializationMode = VIA_DTO`, so page metadata arrives
 * nested under `page` instead of alongside `content`. Kept here so no screen
 * has to know that; the derived flags are computed rather than read, because
 * the DTO shape does not send them.
 */
export function normalizePage<T>(payload: PagedModel<T>): Page<T> {
  const { number, size, totalElements, totalPages } = payload.page;
  const numberOfElements = payload.content.length;
  const emptySort = { empty: true, sorted: false, unsorted: true };

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
    "ApplicationSettings",
    "ApplicationDetail",
    "Industries",
    "JobCategories",
    "Skills",
    "Jobs",
    "AiInterviewConfig",
    "JobInterviewQuestions",
    "AiProviderConfig",
    "Users",
    "UserDetail",
    "HiringRecords",
    "Commissions",
    "Invoices",
    "FinanceSettings",
    "Conversations",
    "Messages",
    "Notifications",
    "UnreadCount",
  ],
  endpoints: () => ({}),
});
