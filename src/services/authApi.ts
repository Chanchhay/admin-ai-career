import type {
  ApiResponseCurrentUserResponse,
  CurrentUserResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
<<<<<<< Updated upstream
=======
    /**
     * Cheap "am I signed in?" check, answered by the gateway itself rather than
     * the backend, so the chrome can render before `/me` resolves.
     *
     * Uses `queryFn` because it sits at `/bff/session`, outside the `/api/v1`
     * base URL the rest of these endpoints share.
     */
    getSession: builder.query<SessionResponse, void>({
      queryFn: async () => {
        try {
          const sessionUrl =
            process.env.NODE_ENV === "development"
              ? "/admin/bff/session"
              : "/bff/session";
          const response = await fetch(sessionUrl, {
            headers: { accept: "application/json" },
          });
          if (!response.ok) return { data: SIGNED_OUT };
          return { data: (await response.json()) as SessionResponse };
        } catch {
          return { data: SIGNED_OUT };
        }
      },
      providesTags: ["Session"],
    }),

    /** Full profile — name, roles, avatar. Roles gate the console's sections. */
>>>>>>> Stashed changes
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
