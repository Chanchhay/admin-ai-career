import type {
  ApiResponseNotification,
  ApiResponsePageNotification,
  ApiResponseUnreadCount,
  NotificationResponse,
  Page,
  UnreadCountResponse,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      Page<NotificationResponse>,
      { unreadOnly?: boolean; page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/notifications",
        params: {
          unreadOnly: params?.unreadOnly ?? false,
          page: params?.page ?? 0,
          size: params?.size ?? 20,
        },
      }),
      transformResponse: (response: ApiResponsePageNotification) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["Notifications"],
    }),
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => "/notifications/unread-count",
      transformResponse: (response: ApiResponseUnreadCount) =>
        unwrapApiResponse(response),
      providesTags: ["UnreadCount"],
    }),
    markNotificationRead: builder.mutation<NotificationResponse, number>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "POST" }),
      transformResponse: (response: ApiResponseNotification) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
    markAllNotificationsRead: builder.mutation<UnreadCountResponse, void>({
      query: () => ({ url: "/notifications/read-all", method: "POST" }),
      transformResponse: (response: ApiResponseUnreadCount) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
