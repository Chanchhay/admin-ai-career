/**
 * Platform accounts — `/api/v1/admin/users/**`, SUPER_ADMIN only.
 *
 * An account spans two systems: Keycloak owns the identity and the realm roles,
 * the backend database owns `status` and the per-role profile rows. The API
 * reports both rather than merging them, because they can legitimately
 * disagree — someone disabled directly in the Keycloak console has no local
 * suspension behind it.
 */

import type { ApiResponse, PagedModel } from "./common";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";

/** The realm roles this console may grant or revoke. */
export type ManageableRole =
  | "SEEKER"
  | "RECRUITER"
  | "MODERATOR"
  | "FINANCE"
  | "SUPER_ADMIN";

export type AdminUserResponse = {
  keycloakUserId: string;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean | null;
  /** Whether Keycloak will let this account log in at all. */
  enabled: boolean | null;
  keycloakCreatedAt: string | null;
  roles: ManageableRole[];
  status: AccountStatus;
  /** False for an account that exists in Keycloak but has no local row yet. */
  hasLocalAccount: boolean;
  /** Populated on the detail endpoint only; the list leaves it empty. */
  profiles: string[];
};

export type AdminUserCreateRequest = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  temporaryPassword?: boolean;
  roles: ManageableRole[];
};

/** The complete role set the account should end up with, not a delta. */
export type AdminUserRolesRequest = {
  roles: ManageableRole[];
};

export type AdminUserStatusRequest = {
  reason?: string;
};

export type ApiResponseAdminUser = ApiResponse<AdminUserResponse>;

export type ApiResponsePageAdminUser = ApiResponse<PagedModel<AdminUserResponse>>;
