import type {
  ApiResponseCurrentUserResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => "/me",
      transformResponse: (response: ApiResponseCurrentUserResponse) =>
        unwrapApiResponse(response),
      providesTags: ["CurrentUser"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useRegisterMutation } = authApi;
