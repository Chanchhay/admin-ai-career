import type { ApiResponse, CompanyVerificationStatus, Page } from "./common";
import type { CompanyDocumentResponse, CompanyResponse } from "./recruiter";

export type CompanyVerificationDecision = "APPROVED" | "REJECTED" | "NEEDS_REVISION";

export type CompanyVerificationResponse = {
  id: number;
  companyId: number;
  moderatorProfileId: number;
  decision: CompanyVerificationDecision;
  note?: string;
  verifiedAt: string;
};

export type ModeratorCompanyDetailResponse = {
  company: CompanyResponse;
  documents: CompanyDocumentResponse[];
  verificationHistory: CompanyVerificationResponse[];
};

export type ApiResponseCompanyVerificationResponse = ApiResponse<CompanyVerificationResponse>;
export type ApiResponseModeratorCompanyDetailResponse = ApiResponse<ModeratorCompanyDetailResponse>;
export type ApiResponsePageModeratorCompanyListItemResponse = ApiResponse<Page<CompanyResponse>>;
