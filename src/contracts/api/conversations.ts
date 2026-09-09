/**
 * Moderator-mediated messaging.
 *
 * Reading and replying live at `/api/v1/conversations/**`, open to whoever is
 * in the thread. Opening a thread lives at `/api/v1/moderator/conversations`
 * and is closed to everyone else — that split is what keeps recruiters from
 * reaching candidates before a moderator forwards them.
 */

import type { ApiResponse, PagedModel } from "./common";

export type ConversationType = "APPLICATION" | "SUPPORT" | "GENERAL" | "SYSTEM";
export type ConversationStatus = "OPEN" | "CLOSED" | "ARCHIVED";
export type MessageType = "TEXT" | "FILE" | "IMAGE" | "SYSTEM";
export type MessageStatus = "SENT" | "READ" | "DELETED";

/**
 * No real name: names live in Keycloak, not the platform database, and the rest
 * of the product identifies people the same way — by role and headline.
 */
export type ConversationParticipantResponse = {
  userAccountId: string;
  role: "SEEKER" | "RECRUITER" | "MODERATOR" | "ADMIN" | "FINANCE" | "UNKNOWN";
  displayLabel: string;
  avatarUrl: string | null;
  self: boolean;
  lastReadAt: string | null;
};

export type MessageResponse = {
  id: string;
  conversationId: string;
  senderUserAccountId: string;
  mine: boolean;
  /** Null once deleted; the row stays so the thread still reads in order. */
  content: string | null;
  messageType: MessageType;
  status: MessageStatus;
  sentAt: string;
  deletedAt: string | null;
};

export type ConversationResponse = {
  id: string;
  title: string | null;
  type: ConversationType;
  status: ConversationStatus;
  applicationId: string | null;
  /** Actual job title, independent of the optional conversation title. */
  jobTitle?: string | null;
  participants: ConversationParticipantResponse[];
  lastMessage: MessageResponse | null;
  unreadCount: number;
  createdAt: string;
};

/** Exactly one of applicationId, companyId, or recipientKeycloakUserId. */
export type CreateConversationRequest = {
  applicationId?: string;
  companyId?: string;
  recipientKeycloakUserId?: string;
  title?: string;
  message?: string;
};

export type SendMessageRequest = {
  content: string;
};

export type ApiResponseConversation = ApiResponse<ConversationResponse>;
export type ApiResponsePageConversation = ApiResponse<
  PagedModel<ConversationResponse>
>;
export type ApiResponseMessage = ApiResponse<MessageResponse>;
export type ApiResponsePageMessage = ApiResponse<PagedModel<MessageResponse>>;
