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
  Page,
  ProjectStatus,
  VisibilityStatus,
} from "./common";

/* ----------------------------------------------------------- companies --- */

/**
 * The list row. Deliberately narrower than the detail's `company` — the queue
 * shows identity and status only, and the full record costs a second call.
 */
export type ModeratorCompanyListItem = {
  id: number;
  recruiterProfileId: number;
  industryId: number;
  industryName: string;
  name: string;
  websiteUrl: string;
  contactEmail: string;
  businessRegistrationNo: string;
  verificationStatus: CompanyVerificationStatus;
  status: EntityStatus;
};

export type ModeratorCompany = {
  id: number;
  recruiterProfileId: number;
  industryId: number;
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
};

export type CompanyDocumentResponse = {
  id: number;
  companyId: number;
  uploadedByRecruiterProfileId: number;
  documentType: string;
  documentUrl: string;
  status: EntityStatus;
  createdAt: string;
};

export type CompanyVerificationDecision =
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_REVISION";

export type CompanyVerificationResponse = {
  id: number;
  companyId: number;
  moderatorProfileId: number;
  decision: CompanyVerificationDecision;
  note?: string;
  verifiedAt: string;
};

export type ModeratorCompanyDetailResponse = {
  company: ModeratorCompany;
  documents: CompanyDocumentResponse[];
  /** Newest decision last, as the backend returns it. */
  verificationHistory: CompanyVerificationResponse[];
};

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
  id: number;
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type CandidateProfileResponse = {
  id: number;
  headline: string;
  currentPosition: string;
  preferredLocation: string;
  availabilityStatus: string;
};

export type SubmittedResumeResponse = {
  id: number;
  title: string;
  /** App-relative MinIO URL; fetchable as-is through the gateway. */
  resumeFileUrl: string;
  visibility: VisibilityStatus;
};

export type CandidateApplicationReviewResponse = {
  id: number;
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
  id: number;
  applicationId: number;
  jobId: number;
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
  id: number;
  applicationId: number;
  scheduledAt: string;
  meetingUrl: string;
  status: InterviewStatus;
  result: InterviewResult;
  note: string;
  completedAt: string;
  cancelledAt: string;
};

export type ProjectAssignmentSummaryResponse = {
  id: number;
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
};

export type CandidateApplicationDetailResponse = CandidateApplicationListItem & {
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
  Page<ModeratorCompanyListItem>
>;
export type ApiResponseModeratorCompanyDetail =
  ApiResponse<ModeratorCompanyDetailResponse>;
export type ApiResponseCompanyVerification =
  ApiResponse<CompanyVerificationResponse>;
export type ApiResponsePageCandidateApplicationListItem = ApiResponse<
  Page<CandidateApplicationListItem>
>;
export type ApiResponseCandidateApplicationDetail =
  ApiResponse<CandidateApplicationDetailResponse>;
export type ApiResponseCandidateApplicationReview =
  ApiResponse<CandidateApplicationReviewResponse>;
export type ApiResponseHumanInterview = ApiResponse<HumanInterviewResponse>;
