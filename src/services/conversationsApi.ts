import type {
  ApiResponseConversation,
  CreateConversationRequest,
  ApiResponseMessage,
  ApiResponsePageConversation,
  ApiResponsePageMessage,
  ConversationResponse,
  MessageResponse,
  Page,
  SendMessageRequest,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<
      Page<ConversationResponse>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/conversations",
        params: { page: params?.page ?? 0, size: params?.size ?? 20 },
      }),
      transformResponse: (response: ApiResponsePageConversation) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: ["Conversations"],
    }),
    getConversation: builder.query<ConversationResponse, string>({
      query: (id) => `/conversations/${id}`,
      transformResponse: (response: ApiResponseConversation) =>
        unwrapApiResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Conversations", id }],
    }),
    getMessages: builder.query<
      Page<MessageResponse>,
      { conversationId: string; page?: number; size?: number }
    >({
      query: ({ conversationId, page, size }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: { page: page ?? 0, size: size ?? 30 },
      }),
      transformResponse: (response: ApiResponsePageMessage) =>
        normalizePage(unwrapApiResponse(response)),
      providesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),
    sendMessage: builder.mutation<
      MessageResponse,
      { conversationId: string; body: SendMessageRequest }
    >({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseMessage) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        { type: "Conversations", id: conversationId },
        "Conversations",
      ],
    }),
    markConversationRead: builder.mutation<ConversationResponse, string>({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseConversation) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: "Conversations", id: conversationId },
        "Conversations",
      ],
    }),
    /* ------------------------------------------------- moderator only --- */

    createConversation: builder.mutation<
      ConversationResponse,
      CreateConversationRequest
    >({
      query: (body) => ({
        url: "/moderator/conversations",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponseConversation) =>
        unwrapApiResponse(response),
      invalidatesTags: ["Conversations"],
    }),
    closeConversation: builder.mutation<ConversationResponse, string>({
      query: (conversationId) => ({
        url: `/moderator/conversations/${conversationId}/close`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseConversation) =>
        unwrapApiResponse(response),
      invalidatesTags: (_result, _error, conversationId) => [
        { type: "Conversations", id: conversationId },
        "Conversations",
      ],
    }),
    deleteMessage: builder.mutation<
      void,
      { conversationId: string; messageId: string }
    >({
      query: ({ conversationId, messageId }) => ({
        url: `/conversations/${conversationId}/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useDeleteMessageMutation,
  useCreateConversationMutation,
  useCloseConversationMutation,
} = conversationsApi;
