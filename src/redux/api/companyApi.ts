import { baseApi } from "./baseApi";
import type {
  Company,
  CreateCompanyRequest,
  PortfolioQuality,
  RequiredDoc,
} from "@/types/company";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequiredDocs: builder.query<RequiredDoc[], void>({
      query: () => "/companies/required-docs",
      providesTags: ["Docs"],
    }),

    getPortfolioQuality: builder.query<PortfolioQuality, void>({
      query: () => "/companies/portfolio-quality",
      providesTags: ["Company"],
    }),

    createCompany: builder.mutation<Company, CreateCompanyRequest>({
      query: (payload) => {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("websiteUrl", payload.websiteUrl);
        formData.append("industry", payload.industry);
        formData.append("size", payload.size);
        formData.append("selfVerified", String(payload.selfVerified));

        if (payload.logo) {
          formData.append("logo", payload.logo);
        }

        return { url: "/companies", method: "POST", body: formData };
      },
      invalidatesTags: ["Company", "Docs"],
    }),
  }),
});


export const {
  useGetRequiredDocsQuery,
  useGetPortfolioQualityQuery,
  useCreateCompanyMutation,
} = companyApi;