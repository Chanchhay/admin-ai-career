/**
 * Hiring records, commissions, and invoices.
 *
 * A recruiter reports a hire; a moderator confirms it, and confirmation is what
 * creates the commission. Finance batches commissions into an invoice. From
 * this app a recruiter can report a hire and read — nothing else, because the
 * recruiter is the party being billed.
 */

import type { ApiResponse, PagedModel } from "./common";

export type HiringRecordStatus = "REPORTED" | "CONFIRMED" | "REJECTED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type CommissionRecordResponse = {
  id: number;
  hiringRecordId: number;
  companyId: number;
  companyName: string;
  /** Frozen when the hire was confirmed; later rate changes never restate it. */
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  dueAt: string | null;
  paidAt: string | null;
  status: PaymentStatus;
  note: string | null;
  invoiceId: number | null;
  invoiceNo: string | null;
};

export type HiringRecordResponse = {
  id: number;
  applicationId: number;
  jobPostId: number;
  jobTitle: string;
  companyId: number;
  companyName: string;
  jobSeekerProfileId: number;
  /** Headline — this platform does not carry real names. */
  candidateLabel: string | null;
  hiredAt: string;
  offeredSalary: number | null;
  salaryCurrency: string | null;
  note: string | null;
  status: HiringRecordStatus;
  reviewedAt: string | null;
  reviewNote: string | null;
  /** Present only once confirmed. */
  commission: CommissionRecordResponse | null;
};

export type ReportHireRequest = {
  offeredSalary: number;
  salaryCurrency?: string;
  note?: string;
};

export type HireReviewRequest = {
  note?: string;
};

export type InvoiceItemResponse = {
  id: number;
  commissionRecordId: number | null;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
};

export type InvoicePaymentResponse = {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  transactionReference: string | null;
  paidAt: string | null;
  status: PaymentStatus;
  note: string | null;
};

export type InvoiceResponse = {
  id: number;
  invoiceNo: string;
  companyId: number;
  companyName: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  status: InvoiceStatus;
  note: string | null;
  items: InvoiceItemResponse[];
  /** Null on list responses; populated when reading one invoice. */
  payments: InvoicePaymentResponse[] | null;
};

export type CreateInvoiceRequest = {
  companyId: number;
  commissionRecordIds: number[];
  taxAmount?: number;
  dueAt?: string;
  note?: string;
};

export type RecordPaymentRequest = {
  amount: number;
  paymentMethod?: string;
  transactionReference?: string;
  paidAt?: string;
  note?: string;
};

export type FinanceSettingsResponse = {
  commissionRate: number;
  paymentTermsDays: number;
  currency: string;
};

export type FinanceSettingsRequest = FinanceSettingsResponse;

export type ApiResponseHiringRecord = ApiResponse<HiringRecordResponse>;
export type ApiResponsePageHiringRecord = ApiResponse<
  PagedModel<HiringRecordResponse>
>;
export type ApiResponseInvoice = ApiResponse<InvoiceResponse>;
export type ApiResponsePageInvoice = ApiResponse<PagedModel<InvoiceResponse>>;
export type ApiResponsePageCommission = ApiResponse<
  PagedModel<CommissionRecordResponse>
>;
export type ApiResponseListCommission = ApiResponse<CommissionRecordResponse[]>;
export type ApiResponseFinanceSettings = ApiResponse<FinanceSettingsResponse>;
