import type { ApiResponsePageModeratorCompanyListItemResponse, ApiResponseCompanyVerificationResponse, CompanyVerificationResponse } from "@/contracts/api/admin";
import type { CompanyResponse } from "@/contracts/api/recruiter";
import type { CompanyVerificationStatus, Page } from "@/contracts/api/common";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModeratorCompanies: builder.query<
      Page<CompanyResponse>,
      { status?: CompanyVerificationStatus; page?: number; size?: number; sort?: string } | void
    >({
      query: (params) => ({
        url: "/moderator/companies",
        params: {
          verificationStatus: params?.status,
          page: params?.page ?? 0,
          size: params?.size ?? 12,
          sort: params?.sort ?? "id,desc",
        },
      }),
      transformResponse: (response: ApiResponsePageModeratorCompanyListItemResponse) =>
        unwrapApiResponse(response),
      providesTags: ["ModeratorCompanies"],
    }),
    approveCompany: builder.mutation<CompanyVerificationResponse, number>({
      query: (companyId) => ({
        url: `/moderator/companies/${companyId}/approve`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseCompanyVerificationResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["ModeratorCompanies"],
    }),
    rejectCompany: builder.mutation<CompanyVerificationResponse, number>({
      query: (companyId) => ({
        url: `/moderator/companies/${companyId}/reject`,
        method: "POST",
      }),
      transformResponse: (response: ApiResponseCompanyVerificationResponse) =>
        unwrapApiResponse(response),
      invalidatesTags: ["ModeratorCompanies"],
    }),
  }),
});

export const {
  useGetModeratorCompaniesQuery,
  useApproveCompanyMutation,
  useRejectCompanyMutation,
} = adminApi;
