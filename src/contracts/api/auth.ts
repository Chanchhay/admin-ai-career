import type { Gender, RegistrationRole } from "./common";

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
