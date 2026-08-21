import type { ApiResponse } from "./common";

export type JobPostSection = {
  id: number;
  sectionType: string;
  title: string;
  contentMarkdown: string;
  contentText: string;
  displayOrder: number;
};

export type JobPostSkill = {
  id: number;
  skillId: number;
  skillName: string;
  skillType: string;
  requiredLevel: string;
};

/** The published-job representation returned by `/public/jobs`. */
export type PublicJobResponse = {
  id: number;
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string;
  publishedAt: string | null;
  expiredAt: string | null;
  sections: JobPostSection[];
  skills: JobPostSkill[];
};

export type PublicJobsQuery = {
  keyword?: string;
  location?: string;
  categoryId?: number;
  workMode?: string;
  jobType?: string;
  page?: number;
  size?: number;
};

/**
 * The public jobs endpoint uses the application's compact page DTO rather than
 * Spring's full `Page` JSON shape.
 */
export type PublicJobPagePayload = {
  content: PublicJobResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type ApiResponsePagePublicJob = ApiResponse<PublicJobPagePayload>;
export type ApiResponsePublicJob = ApiResponse<PublicJobResponse>;
