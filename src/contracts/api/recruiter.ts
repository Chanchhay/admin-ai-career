import type {
  ApiResponse,
  CompanyVerificationStatus,
  EntityStatus,
  InterviewResult,
  InterviewStatus,
  Page,
  PublicationVisibility,
  SalaryVisibility,
} from "./common";
import type {
  JobPostSectionResponse,
  JobPostSectionType,
  JobPostSkillResponse,
} from "./public";
import type {
  AiInterviewResultResponse,
  JobApplicationStatus,
} from "./job-seeker";

export type JobPostRequest = {
  categoryId?: number;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  expiredAt?: string;
  sections?: JobPostSectionRequest[];
  skills?: JobPostSkillRequest[];
};

export type JobPostSectionRequest = {
  sectionType: JobPostSectionType;
  title: string;
  contentMarkdown: string;
  contentText?: string;
  displayOrder: number;
};

export type JobPostSkillRequest = {
  skillId: number;
  requiredLevel?: string;
};

export type JobPostStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "PAUSED"
  | "CLOSED"
  | "EXPIRED";

export type JobPostResponse = {
  id: number;
  companyId: number;
  companyName: string;
  recruiterProfileId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  status: JobPostStatus;
  publishedAt: string;
  expiredAt: string;
  sections: JobPostSectionResponse[];
  skills: JobPostSkillResponse[];
};

export type CompanyCreateRequest = {
  industryId?: number;
  name: string;
  description?: string;
  websiteUrl?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  businessRegistrationNo?: string;
};

export type CompanyUpdateRequest = CompanyCreateRequest;

export type CompanyResponse = {
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

export type CompanyDocumentRequest = {
  documentType: string;
  documentUrl: string;
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

export type RecruiterProfileUpdateRequest = {
  position?: string;
  linkedinUrl?: string;
};

export type RecruiterProfileResponse = {
  id: number;
  position: string;
  linkedinUrl: string;
  status: EntityStatus;
};

export type FindTalentParams = {
  keyword?: string;
  preferredLocation?: string;
  availabilityStatus?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type PublicTalentListItemResponse = {
  profileId: number;
  publicProfileSlug: string;
  headline: string;
  bio: string;
  currentPosition: string;
  preferredLocation: string;
  availabilityStatus: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  expectedSalaryCurrency: string;
  salaryVisibility: SalaryVisibility;
};

export type PublicPortfolioProjectResponse = {
  id: number;
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  techStack: string;
  displayOrder: number;
};

export type PublicPortfolioResponse = {
  id: number;
  title: string;
  summary: string;
  publicUrl: string;
  publishedAt: string;
  projects: PublicPortfolioProjectResponse[];
};

export type PublicResumeResponse = {
  id: number;
  title: string;
  isDefault: boolean;
  publishedAt: string;
};

export type PublicTalentDetailResponse = {
  profile: PublicTalentListItemResponse;
  portfolios: PublicPortfolioResponse[];
  resumes: PublicResumeResponse[];
};

export type PublicResumeDownloadResponse = {
  resumeId: number;
  downloadUrl: string;
};

export type ApplicationSummaryResponse = {
  id: number;
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  status: JobApplicationStatus;
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
  resumeFileUrl: string;
  visibility: PublicationVisibility;
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

export type ForwardedApplicationResponse = {
  application: ApplicationSummaryResponse;
  candidate: CandidateProfileResponse;
  submittedResume: SubmittedResumeResponse;
  aiResult: AiInterviewResultResponse;
  humanInterviews: HumanInterviewResponse[];
  forwardedAt: string;
};

export type ApiResponseJobPostResponse = ApiResponse<JobPostResponse>;
export type ApiResponseListJobPostResponse = ApiResponse<JobPostResponse[]>;
export type ApiResponseCompanyResponse = ApiResponse<CompanyResponse>;
export type ApiResponseCompanyDocumentResponse =
  ApiResponse<CompanyDocumentResponse>;
export type ApiResponseListCompanyDocumentResponse =
  ApiResponse<CompanyDocumentResponse[]>;
export type ApiResponseRecruiterProfileResponse =
  ApiResponse<RecruiterProfileResponse>;
export type ApiResponsePagePublicTalentListItemResponse = ApiResponse<
  Page<PublicTalentListItemResponse>
>;
export type ApiResponsePublicTalentDetailResponse =
  ApiResponse<PublicTalentDetailResponse>;
export type ApiResponsePublicResumeDownloadResponse =
  ApiResponse<PublicResumeDownloadResponse>;
export type ApiResponseListForwardedApplicationResponse =
  ApiResponse<ForwardedApplicationResponse[]>;
export type ApiResponseForwardedApplicationResponse =
  ApiResponse<ForwardedApplicationResponse>;
