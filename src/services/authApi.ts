import type {
  ApiResponseCurrentUserResponse,
  CurrentUserResponse,
  SessionResponse,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

const SIGNED_OUT: SessionResponse = {
  authenticated: false,
  username: null,
  email: null,
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
          const response = await fetch("/bff/session", {
            headers: { accept: "application/json" },
          });
          // A 404 means this route doesn't exist on whatever served the
          // page — only the gateway implements `/bff/session`, so this is
          // the console being opened directly on its own port.
          if (response.status === 404) {
            return { data: { ...SIGNED_OUT, reachable: false } };
          }
          if (!response.ok) return { data: { ...SIGNED_OUT, reachable: true } };
          const body = (await response.json()) as SessionResponse;
          return { data: { ...body, reachable: true } };
        } catch {
          return { data: { ...SIGNED_OUT, reachable: false } };
        }
      },
      providesTags: ["Session"],
    }),

    /** Full profile — name, roles, avatar. Roles gate the console's sections. */
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => "/me",
      transformResponse: (response: ApiResponseCurrentUserResponse) =>
        unwrapApiResponse(response),
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const { useGetSessionQuery, useGetCurrentUserQuery } = authApi;
