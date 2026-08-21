/**
 * `/api/v1/admin/users/**` and `/api/v1/admin/dashboard/**` — account
 * administration and the platform-wide reporting screens.
 *
 * Unlike every other file in `contracts/api/`, these shapes are NOT taken
 * from `api-docs/api.json` — the spec has no `/admin/users` or
 * `/admin/dashboard` paths as of this writing, which means the backend does
 * not implement them yet. Everything below is this console's best guess at
 * a reasonable contract, modelled on the sibling endpoints that do exist
 * (`/me`, `/moderator/companies`). Treat every type here as provisional:
 * once the real backend ships these routes, diff its response against this
 * file and fix whatever drifted.
 */

import type { ApiResponse, EntityStatus, Page } from "./common";

/** Keycloak realm roles, matching `CurrentUserResponse.roles` in `auth.ts`. */
export type UserRole =
  | "JOB_SEEKER"
  | "RECRUITER"
  | "MODERATOR"
  | "ADMIN"
  | "FINANCE"
  | "SUPER_ADMIN";

export type AdminUserListItem = {
  id: number;
  keycloakUserId: string;
  username: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  status: EntityStatus;
  createdAt: string;
};

export type AdminUserDetail = AdminUserListItem & {
  phoneNumber: string;
  registrationSource: string;
  lastLoginAt: string | null;
  /** Mirrors `CurrentUserResponse.profiles` — which profile rows this account owns. */
  profiles: {
    jobSeekerProfileId?: number;
    recruiterProfileId?: number;
    moderatorProfileId?: number;
    adminProfileId?: number;
    financeProfileId?: number;
  };
};

export type UpdateUserStatusRequest = { status: EntityStatus };
export type UpdateUserRoleRequest = { role: UserRole };

/* -------------------------------------------------------------- dashboard --- */

export type DashboardOverviewResponse = {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  pendingCompanyVerifications: number;
  pendingApplicationReviews: number;
  newUsersToday: number;
  newApplicationsToday: number;
};

export type DashboardSeriesPoint = { label: string; value: number };

export type DashboardAnalyticsResponse = {
  userSignups: DashboardSeriesPoint[];
  applicationsSubmitted: DashboardSeriesPoint[];
  companyVerifications: DashboardSeriesPoint[];
  usersByRole: { role: UserRole; count: number }[];
};

export type DashboardRevenueResponse = {
  totalRevenue: number;
  currency: string;
  periodLabel: string;
  revenueByPeriod: DashboardSeriesPoint[];
};

/* ----------------------------------------------------------- envelopes --- */

export type ApiResponsePageAdminUserListItem = ApiResponse<
  Page<AdminUserListItem>
>;
export type ApiResponseAdminUserDetail = ApiResponse<AdminUserDetail>;
export type ApiResponseDashboardOverview =
  ApiResponse<DashboardOverviewResponse>;
export type ApiResponseDashboardAnalytics =
  ApiResponse<DashboardAnalyticsResponse>;
export type ApiResponseDashboardRevenue =
  ApiResponse<DashboardRevenueResponse>;
