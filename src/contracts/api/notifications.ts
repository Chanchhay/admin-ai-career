/**
 * A signed-in account's notification inbox — `/api/v1/notifications/**`.
 *
 * Not role-scoped: seekers, recruiters, moderators and administrators all read
 * their own inbox from the same endpoints, filtered server-side to the caller.
 */

import type { ApiResponse, PagedModel } from "./common";

export type NotificationEventType =
  | "COMPANY_VERIFICATION_SUBMITTED"
  | "COMPANY_VERIFICATION_APPROVED"
  | "COMPANY_VERIFICATION_REJECTED"
  | "COMPANY_VERIFICATION_REVISION_REQUESTED"
  | "JOB_POST_SUBMITTED"
  | "JOB_POST_APPROVED"
  | "JOB_POST_REJECTED"
  | "JOB_APPLICATION_SUBMITTED"
  | "JOB_APPLICATION_STATUS_CHANGED"
  | "AI_INTERVIEW_ASSIGNED"
  | "AI_INTERVIEW_COMPLETED"
  | "HUMAN_INTERVIEW_SCHEDULED"
  | "HUMAN_INTERVIEW_RESCHEDULED"
  | "HUMAN_INTERVIEW_CANCELLED"
  | "PROJECT_ASSIGNED"
  | "PROJECT_SUBMITTED"
  | "PROJECT_REVIEWED"
  | "MESSAGE_RECEIVED"
  | "INVOICE_ISSUED"
  | "INVOICE_PAID";

export type NotificationResponse = {
  id: number;
  eventType: NotificationEventType;
  title: string;
  body: string | null;
  entityName: string | null;
  entityId: string | null;
  /**
   * App-relative path to open, or null. The same notification is readable from
   * more than one front end, so paths that belong to another app are ignored
   * rather than followed.
   */
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
  read: boolean;
};

export type UnreadCountResponse = {
  unreadCount: number;
};

export type ApiResponseNotification = ApiResponse<NotificationResponse>;

export type ApiResponsePageNotification = ApiResponse<
  PagedModel<NotificationResponse>
>;

export type ApiResponseUnreadCount = ApiResponse<UnreadCountResponse>;
