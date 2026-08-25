/**
 * Account administration — `/api/v1/admin/users/**`.
 *
 * Unlike the rest of this console, the backend does enforce a role here:
 * SUPER_ADMIN. A moderator who reaches these screens will get 403s from every
 * call, which is the intended outcome — granting roles and suspending people
 * is not moderator work.
 */

import type {
  AccountStatus,
  AdminUserCreateRequest,
  AdminUserResponse,
  AdminUserRolesRequest,
  AdminUserStatusRequest,
  ApiResponseAdminUser,
  ApiResponsePageAdminUser,
  ManageableRole,
  Page,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

export type UserListParams = {
  search?: string;
  role?: ManageableRole;
  status?: AccountStatus;
  page?: number;
  size?: number;
};

const DEFAULT_PAGE_SIZE = 12;

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Page<AdminUserResponse>, UserListParams | void>({
      query: (params) => ({
        url: "/admin/users",
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? DEFAULT_PAGE_SIZE,
          // Undefined keys are dropped by the query serializer, so an unset
          // filter simply does not reach the backend.
          search: params?.search || undefined,
          role: params?.role || undefined,
          status: params?.status || undefined,
        },
      }),
      transformResponse: (response: ApiResponsePageAdminUser) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["Users"],
    }),
    getUser: builder.query<AdminUserResponse, string>({
      query: (keycloakUserId) => `/admin/users/${keycloakUserId}`,
      transformResponse: (response: ApiResponseAdminUser) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "UserDetail", id }],
    }),
    createUser: builder.mutation<AdminUserResponse, AdminUserCreateRequest>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      transformResponse: (response: ApiResponseAdminUser) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Users"],
    }),
    suspendUser: builder.mutation<
      AdminUserResponse,
      { keycloakUserId: string; body: AdminUserStatusRequest }
    >({
      query: ({ keycloakUserId, body }) => ({
        url: `/admin/users/${keycloakUserId}/suspend`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseAdminUser) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { keycloakUserId }) => [
        "Users",
        { type: "UserDetail", id: keycloakUserId },
      ],
    }),
    reactivateUser: builder.mutation<
      AdminUserResponse,
      { keycloakUserId: string; body: AdminUserStatusRequest }
    >({
      query: ({ keycloakUserId, body }) => ({
        url: `/admin/users/${keycloakUserId}/reactivate`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseAdminUser) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { keycloakUserId }) => [
        "Users",
        { type: "UserDetail", id: keycloakUserId },
      ],
    }),
    updateUserRoles: builder.mutation<
      AdminUserResponse,
      { keycloakUserId: string; body: AdminUserRolesRequest }
    >({
      query: ({ keycloakUserId, body }) => ({
        url: `/admin/users/${keycloakUserId}/roles`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponseAdminUser) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { keycloakUserId }) => [
        "Users",
        { type: "UserDetail", id: keycloakUserId },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useUpdateUserRolesMutation,
} = usersApi;
