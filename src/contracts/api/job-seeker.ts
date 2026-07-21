import type {
  ApiResponse,
  InterviewResult,
  InterviewStatus,
  PublicationVisibility,
  SalaryVisibility,
} from "./common";
import type { PublicJobResponse } from "./public";

export type ResumeCreateRequest = {
  title: string;
  resumeFileUrl?: string;
  resumeData?: Record<string, unknown>;
};

export type ResumeUpdateRequest = Partial<ResumeCreateRequest>;

export type ResumeResponse = {
  id: number;
  title: string;
  resumeFileUrl: string;
  resumeData: Record<string, unknown>;
  isDefault: boolean;
  visibility: PublicationVisibility;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioProjectRequest = {
  title: string;
  description?: string;
  projectUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  techStack?: string;
  displayOrder?: number;
};

export type PortfolioProjectUpdateRequest = Partial<PortfolioProjectRequest>;

export type PortfolioProjectResponse = {
  id: number;
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  techStack: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioCreateRequest = {
  title: string;
  summary?: string;
  publicUrl?: string;
};

export type PortfolioUpdateRequest = Partial<PortfolioCreateRequest>;

export type PortfolioResponse = {
  id: number;
  title: string;
  summary: string;
  publicUrl: string;
  visibility: PublicationVisibility;
  publishedAt: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  projects: PortfolioProjectResponse[];
  createdAt: string;
  updatedAt: string;
};

export type PublicationRequest = {
  visibility: PublicationVisibility;
};

export type PublicationResponse = {
  resourceType: string;
  resourceId: number;
  visibility: PublicationVisibility;
  publicProfileSlug: string;
  publishedAt: string;
};

export type JobApplicationCreateRequest = {
  resumeId?: number;
  coverLetter?: string;
};

export type JobApplicationStatus =
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

export type JobApplicationResponse = {
  id: number;
  jobId: number;
  jobTitle: string;
  resumeId: number;
  resumeTitle: string;
  coverLetter: string;
  status: JobApplicationStatus;
  appliedAt: string;
  createdAt: string;
};

export type AiInterviewAnswerRequest = {
  answerText: string;
};

export type AiInterviewAnswerResponse = {
  id: number;
  answerText: string;
  score: number;
  feedback: string;
};

export type AiInterviewQuestionResponse = {
  id: number;
  displayOrder: number;
  questionType:
    | "TECHNICAL"
    | "BEHAVIORAL"
    | "SITUATIONAL"
    | "COMMUNICATION"
    | "PROBLEM_SOLVING"
    | "GENERAL";
  questionText: string;
  maxScore: number;
  answered: boolean;
  answer?: AiInterviewAnswerResponse;
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
  questions: AiInterviewQuestionResponse[];
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

export type AiInterviewResultResponse = {
  session: AiInterviewSessionResponse;
  feedback: AiInterviewFeedbackResponse;
};

export type JobSeekerProfileUpdateRequest = {
  headline?: string;
  bio?: string;
  currentPosition?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  expectedSalaryCurrency?: string;
  salaryVisibility?: SalaryVisibility;
  preferredLocation?: string;
  availabilityStatus?: string;
};

export type JobSeekerProfileResponse = JobSeekerProfileUpdateRequest & {
  id: number;
  publicProfileSlug: string;
  profileVisibility: PublicationVisibility;
  publishedAt: string;
  verificationStatus: "PENDING_VERIFICATION" | "APPROVED" | "REJECTED" | "SUSPENDED";
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

export type JobSeekerDashboardMock = {
  profile: JobSeekerProfileResponse;
  resumes: ResumeResponse[];
  portfolios: PortfolioResponse[];
  applications: JobApplicationResponse[];
  interviews: AiInterviewSessionResponse[];
  recommendedJobs: PublicJobResponse[];
};

export type ApiResponseResumeResponse = ApiResponse<ResumeResponse>;
export type ApiResponseListResumeResponse = ApiResponse<ResumeResponse[]>;
export type ApiResponsePortfolioResponse = ApiResponse<PortfolioResponse>;
export type ApiResponseListPortfolioResponse = ApiResponse<PortfolioResponse[]>;
export type ApiResponsePortfolioProjectResponse =
  ApiResponse<PortfolioProjectResponse>;
export type ApiResponsePublicationResponse = ApiResponse<PublicationResponse>;
export type ApiResponseJobApplicationResponse =
  ApiResponse<JobApplicationResponse>;
export type ApiResponseListJobApplicationResponse =
  ApiResponse<JobApplicationResponse[]>;
export type ApiResponseAiInterviewSessionResponse =
  ApiResponse<AiInterviewSessionResponse>;
export type ApiResponseListAiInterviewSessionResponse =
  ApiResponse<AiInterviewSessionResponse[]>;
export type ApiResponseAiInterviewResultResponse =
  ApiResponse<AiInterviewResultResponse>;
export type ApiResponseJobSeekerProfileResponse =
  ApiResponse<JobSeekerProfileResponse>;
