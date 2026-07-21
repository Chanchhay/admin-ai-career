export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PageableObject = {
  offset: number;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  unpaged: boolean;
};

export type SortObject = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Page<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  sort: SortObject;
  empty: boolean;
};

export type EntityStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type PublicationVisibility = "PUBLIC" | "PRIVATE" | "HIDDEN";

export type InterviewStatus =
  | "PREPARING"
  | "READY"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type InterviewResult = "PASSED" | "FAILED" | "NEEDS_REVIEW";

export type CompanyVerificationStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type RegistrationRole = "SEEKER" | "RECRUITER";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

export type SalaryVisibility = "PRIVATE" | "RECRUITERS_ONLY" | "PUBLIC";

export type ApiVoid = Record<string, never>;

export type ApiResponseVoid = ApiResponse<ApiVoid>;
