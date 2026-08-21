/**
 * Shapes shared by every endpoint: the backend's `ApiResponse<T>` envelope,
 * Spring's `Page<T>`, and the enums the console renders.
 */

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SortObject = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type PageableObject = {
  offset: number;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  sort: SortObject;
  unpaged: boolean;
};

export type Page<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  /** Zero-based, as Spring numbers pages. */
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  sort: SortObject;
  empty: boolean;
};

/** Lifecycle of a row the console can suspend but not delete. */
export type EntityStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export type CompanyVerificationStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type VisibilityStatus = "PUBLIC" | "PRIVATE" | "HIDDEN";

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "AI_INTERVIEW_REQUIRED"
  | "AI_INTERVIEW_IN_PROGRESS"
  | "AI_INTERVIEW_FAILED"
  | "MODERATOR_REVIEW_PENDING"
  | "AI_INTERVIEW_PASSED"
  | "SHORTLISTED"
  | "HUMAN_INTERVIEW_SCHEDULED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";

export type InterviewStatus =
  | "PREPARING"
  | "READY"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type InterviewResult = "PASSED" | "FAILED" | "NEEDS_REVIEW";

export type ProjectStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED"
  | "CANCELLED";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

/** `void` endpoints still answer with the envelope; the payload is empty. */
export type ApiVoid = Record<string, never>;

export type ApiResponseVoid = ApiResponse<ApiVoid>;
