/**
 * `/api/v1/admin/**` — the reference data every other feature selects from:
 * industries on a company, job categories and skills on a job post.
 *
 * All three follow the same list / create / update / delete shape, which is why
 * the console renders them from one generic screen.
 */

import type { ApiResponse, EntityStatus } from "./common";

export type IndustryResponse = {
  parentId: string | null;
  parentName: string | null;
  id: string;
  name: string;
  description: string;
  /** Admin responses include these fields; public list responses may omit them. */
  status?: EntityStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type IndustryRequest = {
  parentId?: string | null;
  name: string;
  description?: string;
  status?: EntityStatus;
};

export type JobCategoryResponse = {
  parentId: string | null;
  parentName: string | null;
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobCategoryRequest = {
  parentId?: string | null;
  name: string;
  description?: string;
};

export type SkillResponse = {
  parentId: string | null;
  parentName: string | null;
  id: string;
  name: string;
  /** Free text on the backend — "TECHNICAL", "SOFT", whatever was entered. */
  skillType: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SkillRequest = {
  parentId?: string | null;
  name: string;
  skillType?: string;
};

export type ApiResponseListIndustry = ApiResponse<IndustryResponse[]>;
export type ApiResponseIndustry = ApiResponse<IndustryResponse>;
export type ApiResponseListJobCategory = ApiResponse<JobCategoryResponse[]>;
export type ApiResponseJobCategory = ApiResponse<JobCategoryResponse>;
export type ApiResponseListSkill = ApiResponse<SkillResponse[]>;
export type ApiResponseSkill = ApiResponse<SkillResponse>;
