/**
 * `/api/v1/moderator/**` — company verification and the candidate review queue.
 *
 * These are the console's only write-heavy endpoints: approving a company lets
 * its recruiters publish, and forwarding a candidate hands a recruiter the
 * private file. None of it is reversible through the API.
 */

import type {
  ApiResponse,
  ApplicationStatus,
  CompanyVerificationStatus,
  EntityStatus,
  InterviewResult,
  InterviewStatus,
  ProjectStatus,
  VisibilityStatus,
} from "./common";

/* ----------------------------------------------------------- companies --- */

/**
 * The list row. Deliberately narrower than the detail's `company` — the queue
 * shows identity and status only, and the full record costs a second call.
 */
/**
 * Whether candidates are told who a company is. Set by an administrator; the
 * recruiter can read it but not change it.
 */
export type CompanyIdentityVisibility = "VISIBLE" | "MASKED";

export type ModeratorCompanyListItem = {
  id: string;
  recruiterProfileId: string;
  industryId: string;
  industryName: string;
  name: string;
  /** The company's own logo. Empty on a company that never uploaded one. */
  logoUrl: string;
  websiteUrl: string;
  contactEmail: string;
  businessRegistrationNo: string;
  verificationStatus: CompanyVerificationStatus;
  status: EntityStatus;
  identityVisibility: CompanyIdentityVisibility;
  /** How much this company has posted, and how much of it is live. */
  jobCount: number;
  publishedJobCount: number;
};

export type ModeratorCompany = {
  id: string;
  recruiterProfileId: string;
  industryId: string;
  industryName: string;
  name: string;
  description: string;
  websiteUrl: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  businessRegistrationNo: string;
  verificationStatus: CompanyVerificationStatus;
  status: EntityStatus;
  identityVisibility: CompanyIdentityVisibility;
  /**
   * The stand-in logo candidates see while this company is masked. Null when
   * none is set, which is the ordinary state — a masked posting then carries
   * no mark at all. Only a moderator can write it.
   */
  maskedLogoUrl: string | null;
};

export type CompanyDocumentResponse = {
  id: string;
  companyId: string;
  uploadedByRecruiterProfileId: string;
  documentType: string;
  documentUrl: string;
  status: EntityStatus;
  createdAt: string;
};

export type CompanyVerificationDecision =
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_REVISION"
  | "SUSPENDED"
  | "REINSTATED";

export type CompanyVerificationResponse = {
  id: string;
  companyId: string;
  moderatorProfileId: string;
  decision: CompanyVerificationDecision;
  note?: string;
  verifiedAt: string;
};

export type ModeratorCompanyDetailResponse = {
  company: ModeratorCompany;
  documents: CompanyDocumentResponse[];
  /** Newest decision first — the backend orders by `verifiedAt` descending. */
  verificationHistory: CompanyVerificationResponse[];
};

/* ---------------------------------------------------------------- jobs --- */

export type JobStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "PAUSED"
  | "CLOSED"
  | "EXPIRED";

/**
 * A company's job as the console lists it.
 *
 * Not the public catalogue's shape: this one carries drafts, paused and closed
 * posts too, because a moderator deciding about a company needs to see what it
 * has posted, not only what candidates can currently find.
 */
export type ModeratorJobListItem = {
  id: string;
  title: string;
  location: string;
  jobType: string;
  workMode: string;
  status: JobStatus;
  publishedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
};

export type ModeratorJobSection = {
  id: string;
  sectionType: string;
  title: string;
  contentText: string;
  contentMarkdown: string;
  displayOrder: number;
};

export type ModeratorJobSkill = {
  id: string;
  skillId: string;
  skillName: string;
  weight: number;
};

/** One job in full, as `/moderator/jobs/{id}` returns it. */
export type ModeratorJobDetail = {
  id: string;
  companyId: string;
  companyName: string;
  recruiterProfileId: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string;
  status: JobStatus;
  publishedAt: string | null;
  expiredAt: string | null;
  sourceFileUrl: string | null;
  sections: ModeratorJobSection[];
  skills: ModeratorJobSkill[];
};

export type ApiResponseModeratorJobDetail = ApiResponse<ModeratorJobDetail>;

export type ApiResponsePageModeratorJob = ApiResponse<
  CompactPagePayload<ModeratorJobListItem>
>;
export type ApiResponseModeratorJob = ApiResponse<ModeratorJobListItem>;

/* -------------------------------------------------------- applications --- */

export type CandidateApplicationReviewStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "HUMAN_INTERVIEW_SCHEDULED"
  | "DECISION_PENDING"
  | "APPROVED"
  | "REJECTED"
  | "FORWARDED";

export type ApplicationSummaryResponse = {
  id: string;
  jobId: string;
  jobTitle: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type CandidateProfileResponse = {
  id: string;
  headline: string;
  currentPosition: string;
  preferredLocation: string;
  availabilityStatus: string;
};

export type SubmittedResumeResponse = {
  id: string;
  title: string;
  /** App-relative MinIO URL; fetchable as-is through the gateway. */
  resumeFileUrl: string;
  visibility: VisibilityStatus;
};

export type CandidateApplicationReviewResponse = {
  id: string;
  reviewStatus: CandidateApplicationReviewStatus;
  decisionNote: string;
  reviewedAt: string;
  approvedAt: string;
  forwardedAt: string;
};

export type AiInterviewFeedbackResponse = {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  overallScore: number;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  result: InterviewResult;
};

export type AiInterviewSessionResponse = {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  status: InterviewStatus;
  startedAt: string;
  endedAt: string;
  totalScore: number;
  result: InterviewResult;
  questionCount: number;
  answeredCount: number;
};

export type AiInterviewResultResponse = {
  session: AiInterviewSessionResponse;
  feedback: AiInterviewFeedbackResponse;
};

export type HumanInterviewResponse = {
  id: string;
  applicationId: string;
  scheduledAt: string;
  meetingUrl: string;
  status: InterviewStatus;
  result: InterviewResult;
  note: string;
  completedAt: string;
  cancelledAt: string;
};

export type ProjectAssignmentSummaryResponse = {
  id: string;
  title: string;
  description: string;
  deadlineAt: string;
  status: ProjectStatus;
};

export type CandidateApplicationListItem = {
  application: ApplicationSummaryResponse;
  candidate: CandidateProfileResponse;
  submittedResume: SubmittedResumeResponse;
  review: CandidateApplicationReviewResponse;
  /** Null until the candidate's AI interview has finished. */
  aiScore: number | null;
  aiResult: InterviewResult | null;
};

export type CandidateApplicationDetailResponse = Omit<
  CandidateApplicationListItem,
  "aiScore" | "aiResult"
> & {
  aiResult: AiInterviewResultResponse | null;
  humanInterviews: HumanInterviewResponse[];
  projectAssignments: ProjectAssignmentSummaryResponse[];
};

/* -------------------------------------------------------------- writes --- */

/** Body of every approve / reject / request-revision call. */
export type DecisionRequest = {
  decisionNote?: string;
};

export type HumanInterviewRequest = {
  /** ISO-8601 instant, e.g. `2026-03-04T09:30:00Z`. */
  scheduledAt: string;
  meetingUrl: string;
};

export type HumanInterviewCompleteRequest = {
  result: InterviewResult;
  note?: string;
};

/* ----------------------------------------------------------- envelopes --- */

export type ApiResponsePageModeratorCompanyListItem = ApiResponse<
  CompactPagePayload<ModeratorCompanyListItem>
>;
export type ApiResponseModeratorCompanyDetail =
  ApiResponse<ModeratorCompanyDetailResponse>;
export type ApiResponseCompanyVerification =
  ApiResponse<CompanyVerificationResponse>;
export type ApiResponsePageCandidateApplicationListItem = ApiResponse<
  CompactPagePayload<CandidateApplicationListItem>
>;
export type ApiResponseCandidateApplicationDetail =
  ApiResponse<CandidateApplicationDetailResponse>;
export type ApiResponseCandidateApplicationReview =
  ApiResponse<CandidateApplicationReviewResponse>;
export type ApiResponseHumanInterview = ApiResponse<HumanInterviewResponse>;

/** Compact pagination DTO returned by the moderator list endpoints. */
export type CompactPagePayload<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

/**
 * Platform rules for applying — `/api/v1/admin/application-settings`.
 *
 * `reapplyCooldownDays` is how long a rejected candidate must wait before
 * applying to the same job again. Zero switches it off, which is the default.
 * Withdrawing is not subject to it.
 */
export type ApplicationSettingsResponse = {
  reapplyCooldownDays: number;
};

export type ApplicationSettingsRequest = ApplicationSettingsResponse;

export type ApiResponseApplicationSettings =
  ApiResponse<ApplicationSettingsResponse>;
