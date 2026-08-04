import type { ApiResponse, Gender, RegistrationRole } from "./common";

export type RegisterRequest = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  role: RegistrationRole;
  phoneNumber?: string;
};

export type RegisterResponse = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: RegistrationRole;
  phoneNumber: string;
  registrationSource: string;
};

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
  roles: string[];
  profiles: CurrentUserProfilesResponse;
};

export type ApiResponseCurrentUserResponse = ApiResponse<CurrentUserResponse>;
