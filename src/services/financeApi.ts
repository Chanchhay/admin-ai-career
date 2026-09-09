/**
 * Hire review and the finance desk.
 *
 * Hire review sits under `/moderator/**`; everything else under
 * `/finance/**`, which requires the FINANCE role (SUPER_ADMIN reaches it
 * through the role hierarchy). A moderator without FINANCE will see the hire
 * queue and get 403s from the invoicing screens — which is the intent.
 */

import type {
    ApiResponse,
    PagedModel,
    FinanceSummaryParams,
    FinanceSummaryResponse,
    PayingCompanyResponse,
    ApiResponseFinanceSettings,
    ApiResponseListBillableCompany,
    ApiResponseHiringRecord,
    ApiResponseInvoice,
    ApiResponseListCommission,
    ApiResponsePageCommission,
    ApiResponsePageHiringRecord,
    BillableCompanyResponse,
    ApiResponsePageInvoice,
    CommissionRecordResponse,
    CreateInvoiceRequest,
    FinanceSettingsRequest,
    FinanceSettingsResponse,
    HireReviewRequest,
    HiringRecordResponse,
    HiringRecordStatus,
    InvoiceResponse,
    InvoiceStatus,
    Page,
    PaymentStatus,
    RecordPaymentRequest,
} from "@/contracts";
import { baseApi, normalizePage, unwrapApiResponse } from "./baseApi";

const DEFAULT_PAGE_SIZE = 12;

export const financeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFinanceSummary: builder.query<
            FinanceSummaryResponse,
            FinanceSummaryParams
        >({
            query: (params) => ({ url: "/finance/summary", params }),
            transformResponse: (
                response: ApiResponse<FinanceSummaryResponse>,
            ) => unwrapApiResponse(response),
            providesTags: ["Invoices", "FinanceSettings"],
        }),
        getPayingCompanies: builder.query<
            Page<PayingCompanyResponse>,
            FinanceSummaryParams & {
                search?: string;
                page: number;
                size: number;
            }
        >({
            query: (params) => ({ url: "/finance/summary/companies", params }),
            transformResponse: (
                response: ApiResponse<PagedModel<PayingCompanyResponse>>,
            ) => normalizePage(unwrapApiResponse(response)),
            providesTags: ["Invoices", "FinanceSettings"],
        }),
        /* --------------------------------------------------- hire review --- */

        getHiringRecords: builder.query<
            Page<HiringRecordResponse>,
            { status?: HiringRecordStatus; page?: number; size?: number } | void
        >({
            query: (params) => ({
                url: "/moderator/hiring-records",
                params: {
                    status: params?.status || undefined,
                    page: params?.page ?? 0,
                    size: params?.size ?? DEFAULT_PAGE_SIZE,
                },
            }),
            transformResponse: (response: ApiResponsePageHiringRecord) =>
                normalizePage(unwrapApiResponse(response)),
            providesTags: ["HiringRecords"],
        }),
        confirmHire: builder.mutation<
            HiringRecordResponse,
            { hiringRecordId: string; body: HireReviewRequest }
        >({
            query: ({ hiringRecordId, body }) => ({
                url: `/moderator/hiring-records/${hiringRecordId}/confirm`,
                method: "POST",
                body,
            }),
            transformResponse: (response: ApiResponseHiringRecord) =>
                unwrapApiResponse(response),
            // Confirming mints a commission, so the finance pool changes too.
            invalidatesTags: ["HiringRecords", "Commissions"],
        }),
        rejectHire: builder.mutation<
            HiringRecordResponse,
            { hiringRecordId: string; body: HireReviewRequest }
        >({
            query: ({ hiringRecordId, body }) => ({
                url: `/moderator/hiring-records/${hiringRecordId}/reject`,
                method: "POST",
                body,
            }),
            transformResponse: (response: ApiResponseHiringRecord) =>
                unwrapApiResponse(response),
            invalidatesTags: ["HiringRecords"],
        }),

        /* ---------------------------------------------------- commissions --- */

        getCommissions: builder.query<
            Page<CommissionRecordResponse>,
            { companyId?: string; status?: PaymentStatus; page?: number } | void
        >({
            query: (params) => ({
                url: "/finance/commissions",
                params: {
                    companyId: params?.companyId || undefined,
                    status: params?.status || undefined,
                    page: params?.page ?? 0,
                    size: DEFAULT_PAGE_SIZE,
                },
            }),
            transformResponse: (response: ApiResponsePageCommission) =>
                normalizePage(unwrapApiResponse(response)),
            providesTags: ["Commissions"],
        }),
        /**
         * Every company with something billable — the finance desk's entry point.
         *
         * Shares the `Commissions` tag with the per-company pool, so creating or
         * cancelling an invoice moves a company on and off this list without any
         * extra invalidation.
         */
        getBillableCompanies: builder.query<BillableCompanyResponse[], void>({
            query: () => "/finance/billable-companies",
            transformResponse: (response: ApiResponseListBillableCompany) =>
                unwrapApiResponse(response),
            providesTags: ["Commissions"],
        }),
        getUnbilledCommissions: builder.query<
            CommissionRecordResponse[],
            string
        >({
            query: (companyId) =>
                `/finance/companies/${companyId}/unbilled-commissions`,
            transformResponse: (response: ApiResponseListCommission) =>
                unwrapApiResponse(response),
            providesTags: ["Commissions"],
        }),

        /* ------------------------------------------------------- invoices --- */

        getInvoices: builder.query<
            Page<InvoiceResponse>,
            {
                companyId?: string;
                status?: InvoiceStatus;
                page?: number;
                size?: number;
            } | void
        >({
            query: (params) => ({
                url: "/finance/invoices",
                params: {
                    companyId: params?.companyId || undefined,
                    status: params?.status || undefined,
                    page: params?.page ?? 0,
                    size: params?.size ?? DEFAULT_PAGE_SIZE,
                },
            }),
            transformResponse: (response: ApiResponsePageInvoice) =>
                normalizePage(unwrapApiResponse(response)),
            providesTags: ["Invoices"],
        }),
        getInvoice: builder.query<InvoiceResponse, string>({
            query: (invoiceId) => `/finance/invoices/${invoiceId}`,
            transformResponse: (response: ApiResponseInvoice) =>
                unwrapApiResponse(response),
            providesTags: (_result, _error, id) => [{ type: "Invoices", id }],
        }),
        createInvoice: builder.mutation<InvoiceResponse, CreateInvoiceRequest>({
            query: (body) => ({
                url: "/finance/invoices",
                method: "POST",
                body,
            }),
            transformResponse: (response: ApiResponseInvoice) =>
                unwrapApiResponse(response),
            invalidatesTags: ["Invoices", "Commissions"],
        }),
        issueInvoice: builder.mutation<InvoiceResponse, string>({
            query: (invoiceId) => ({
                url: `/finance/invoices/${invoiceId}/issue`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponseInvoice) =>
                unwrapApiResponse(response),
            invalidatesTags: (_result, _error, id) => [
                "Invoices",
                { type: "Invoices", id },
            ],
        }),
        cancelInvoice: builder.mutation<InvoiceResponse, string>({
            query: (invoiceId) => ({
                url: `/finance/invoices/${invoiceId}/cancel`,
                method: "POST",
            }),
            transformResponse: (response: ApiResponseInvoice) =>
                unwrapApiResponse(response),
            // Cancelling returns its commissions to the unbilled pool.
            invalidatesTags: (_result, _error, id) => [
                "Invoices",
                { type: "Invoices", id },
                "Commissions",
            ],
        }),
        recordPayment: builder.mutation<
            InvoiceResponse,
            { invoiceId: string; body: RecordPaymentRequest }
        >({
            query: ({ invoiceId, body }) => ({
                url: `/finance/invoices/${invoiceId}/payments`,
                method: "POST",
                body,
            }),
            transformResponse: (response: ApiResponseInvoice) =>
                unwrapApiResponse(response),
            invalidatesTags: (_result, _error, { invoiceId }) => [
                "Invoices",
                { type: "Invoices", id: invoiceId },
                "Commissions",
            ],
        }),

        /* ------------------------------------------------------- settings --- */

        getFinanceSettings: builder.query<FinanceSettingsResponse, void>({
            query: () => "/finance/settings",
            transformResponse: (response: ApiResponseFinanceSettings) =>
                unwrapApiResponse(response),
            providesTags: ["FinanceSettings"],
        }),
        updateFinanceSettings: builder.mutation<
            FinanceSettingsResponse,
            FinanceSettingsRequest
        >({
            query: (body) => ({
                url: "/finance/settings",
                method: "PUT",
                body,
            }),
            transformResponse: (response: ApiResponseFinanceSettings) =>
                unwrapApiResponse(response),
            invalidatesTags: ["FinanceSettings"],
        }),
    }),
});

export const {
    useGetFinanceSummaryQuery,
    useGetPayingCompaniesQuery,
    useGetHiringRecordsQuery,
    useConfirmHireMutation,
    useRejectHireMutation,
    useGetCommissionsQuery,
    useGetBillableCompaniesQuery,
    useGetUnbilledCommissionsQuery,
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useCreateInvoiceMutation,
    useIssueInvoiceMutation,
    useCancelInvoiceMutation,
    useRecordPaymentMutation,
    useGetFinanceSettingsQuery,
    useUpdateFinanceSettingsMutation,
} = financeApi;
