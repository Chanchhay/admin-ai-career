import { baseApi } from "./baseApi";
import type { ProfileOverview } from "@/types/profile";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileOverview: builder.query<ProfileOverview, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileOverviewQuery } = profileApi;
