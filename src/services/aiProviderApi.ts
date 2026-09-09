/**
 * AI engine settings — `/api/v1/admin/ai-provider-config`.
 *
 * The test endpoint is a mutation rather than a query: it spends a real provider
 * call, so it must fire when the button is pressed and never on a cache miss.
 */

import type {
    AiConnectionTestRequest,
    AiModelCatalogResponse,
    AiConnectionTestResponse,
    AiProviderConfigRequest,
    AiProviderConfigResponse,
    ApiResponseAiConnectionTest,
    ApiResponseAiModelCatalog,
    ApiResponseAiProviderConfig,
} from "@/contracts";
import { baseApi, unwrapApiResponse } from "./baseApi";

export const aiProviderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAiProviderConfig: builder.query<AiProviderConfigResponse, void>({
            query: () => "/admin/ai-provider-config",
            transformResponse: (response: ApiResponseAiProviderConfig) =>
                unwrapApiResponse(response),
            providesTags: ["AiProviderConfig"],
        }),
        /**
         * Asked of the provider with the saved key, so it reflects what that key may
         * call. Tagged with the config so saving a new key refreshes the list.
         */
        getAiModelCatalog: builder.query<AiModelCatalogResponse, void>({
            query: () => "/admin/ai-provider-config/models",
            transformResponse: (response: ApiResponseAiModelCatalog) =>
                unwrapApiResponse(response),
            providesTags: ["AiProviderConfig"],
        }),
        updateAiProviderConfig: builder.mutation<
            AiProviderConfigResponse,
            AiProviderConfigRequest
        >({
            query: (body) => ({
                url: "/admin/ai-provider-config",
                method: "PUT",
                body,
            }),
            transformResponse: (response: ApiResponseAiProviderConfig) =>
                unwrapApiResponse(response),
            invalidatesTags: ["AiProviderConfig"],
        }),
        testAiConnection: builder.mutation<
            AiConnectionTestResponse,
            AiConnectionTestRequest
        >({
            query: (body) => ({
                url: "/admin/ai-provider-config/test",
                method: "POST",
                body,
            }),
            transformResponse: (response: ApiResponseAiConnectionTest) =>
                unwrapApiResponse(response),
        }),
    }),
});

export const {
    useGetAiProviderConfigQuery,
    useGetAiModelCatalogQuery,
    useUpdateAiProviderConfigMutation,
    useTestAiConnectionMutation,
} = aiProviderApi;
