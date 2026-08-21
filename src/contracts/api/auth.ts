/**
 * Identity. Registration lives in the main app, so the console only reads
 * `/api/v1/me` — the roles it returns decide which sections are usable.
 */

import type { ApiResponse } from "./common";

export type CurrentUserProfilesResponse = {
  jobSeekerProfileId?: number;
  recruiterProfileId?: number;
  moderatorProfileId?: number;
  adminProfileId?: number;
  financeProfileId?: number;
};

export type CurrentUserResponse = {
  userAccountId: number;
  keycloakUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  registrationSource: string;
  /** Keycloak realm roles, e.g. `["ADMIN", "MODERATOR"]`. */
  roles: string[];
  /** App-relative avatar URL from whichever profile the account owns. */
  avatarUrl?: string;
  profiles: CurrentUserProfilesResponse;
};

export type ApiResponseCurrentUserResponse = ApiResponse<CurrentUserResponse>;

/** What the gateway reports about the current browser session. */
export type SessionResponse = {
  authenticated: boolean;
  username: string | null;
  email: string | null;
  /**
   * False when `/bff/session` didn't resolve at all (a 404, or the fetch
   * failing outright) — the clearest sign this console is being opened
   * directly on its own dev port instead of through the gateway that is
   * supposed to sit in front of it. `true`/undefined means the gateway
   * answered, even if it says the visitor is signed out.
   */
  reachable?: boolean;
};
