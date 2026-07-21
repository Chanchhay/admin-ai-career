import type { ApiResponse, Page } from "./common";

export type PublicSkillResponse = {
  id: number;
  name: string;
  skillType: string;
};

export type PublicJobCategoryResponse = {
  id: number;
  name: string;
  description: string;
};

export type PublicIndustryResponse = {
  id: number;
  name: string;
  description: string;
};

export type JobPostSectionType =
  | "DESCRIPTION"
  | "REQUIREMENT_RESPONSIBILITY"
  | "BENEFIT"
  | "QUALIFICATION"
  | "NICE_TO_HAVE"
  | "ABOUT_ROLE";

export type JobPostSectionResponse = {
  id: number;
  sectionType: JobPostSectionType;
  title: string;
  contentMarkdown: string;
  contentText: string;
  displayOrder: number;
};

export type JobPostSkillResponse = {
  id: number;
  skillId: number;
  skillName: string;
  skillType: string;
  requiredLevel: string;
};

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
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  publishedAt: string;
  expiredAt: string;
  sections: JobPostSectionResponse[];
  skills: JobPostSkillResponse[];
};

export type ApiResponsePagePublicJobResponse = ApiResponse<
  Page<PublicJobResponse>
>;

export type ApiResponsePublicJobResponse = ApiResponse<PublicJobResponse>;

export type ApiResponseListPublicSkillResponse = ApiResponse<
  PublicSkillResponse[]
>;

export type ApiResponseListPublicJobCategoryResponse = ApiResponse<
  PublicJobCategoryResponse[]
>;

export type ApiResponseListPublicIndustryResponse = ApiResponse<
  PublicIndustryResponse[]
>;
