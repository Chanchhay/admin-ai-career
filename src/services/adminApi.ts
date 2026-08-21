/**
 * `/api/v1/admin/users/**` and `/api/v1/admin/dashboard/**`.
 *
 * See `contracts/api/admin.ts` for the caveat that matters most here: the
 * backend does not implement these paths yet, so every call below will 404
 * until it does. The service is wired up in full regardless, so the UI just
 * starts working the day the routes land — nothing in this file should need
 * to change, only the response shapes it currently guesses at.
 */

import type {
  AdminUserDetail,
  AdminUserListItem,
  ApiResponseAdminUserDetail,
  ApiResponseDashboardAnalytics,
  ApiResponseDashboardOverview,
  ApiResponseDashboardRevenue,
  ApiResponsePageAdminUserListItem,
  DashboardAnalyticsResponse,
  DashboardOverviewResponse,
  DashboardRevenueResponse,
  EntityStatus,
  Page,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
  UserRole,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export type UserPageParams = {
  page?: number;
  size?: number;
  sort?: string;
  role?: UserRole;
  status?: EntityStatus;
  /** Free-text match against name/username/email — trimmed, omitted if blank. */
  search?: string;
};

function userPageQuery(params: UserPageParams | undefined) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? 12,
    sort: params?.sort ?? "id,desc",
    role: params?.role,
    status: params?.status,
    search: params?.search?.trim() || undefined,
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------------------------------------ users --- */

    getAdminUsers: builder.query<Page<AdminUserListItem>, UserPageParams | void>({
      query: (params) => ({
        url: "/admin/users",
        params: userPageQuery(params || undefined),
      }),
      transformResponse: (response: ApiResponsePageAdminUserListItem) =>
        unwrapApiResponse(response),
      providesTags: ["AdminUsers"],
    }),

    getAdminUser: builder.query<AdminUserDetail, number>({
      query: (userId) => `/admin/users/${userId}`,
      transformResponse: (response: ApiResponseAdminUserDetail) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, userId) => [
        { type: "AdminUserDetail", id: userId },
      ],
    }),

    updateUserStatus: builder.mutation<
      AdminUserDetail,
      { userId: number; body: UpdateUserStatusRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseAdminUserDetail) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { userId }) => [
        "AdminUsers",
        { type: "AdminUserDetail", id: userId },
      ],
    }),

    updateUserRole: builder.mutation<
      AdminUserDetail,
      { userId: number; body: UpdateUserRoleRequest }
    >({
      query: ({ userId, body }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiResponseAdminUserDetail) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { userId }) => [
        "AdminUsers",
        { type: "AdminUserDetail", id: userId },
      ],
    }),

    /* -------------------------------------------------------- dashboard --- */

    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      query: () => "/admin/dashboard/overview",
      transformResponse: (response: ApiResponseDashboardOverview) =>
        unwrapApiResponse(response),
      providesTags: ["AdminDashboard"],
    }),

    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, void>({
      query: () => "/admin/dashboard/analytics",
      transformResponse: (response: ApiResponseDashboardAnalytics) =>
        unwrapApiResponse(response),
      providesTags: ["AdminDashboard"],
    }),

    getDashboardRevenue: builder.query<DashboardRevenueResponse, void>({
      query: () => "/admin/dashboard/revenue",
      transformResponse: (response: ApiResponseDashboardRevenue) =>
        unwrapApiResponse(response),
      providesTags: ["AdminDashboard"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetDashboardOverviewQuery,
  useGetDashboardAnalyticsQuery,
  useGetDashboardRevenueQuery,
} = adminApi;
