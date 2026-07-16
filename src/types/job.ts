export type JobCategory =
  | "ENGINEERING"
  | "DESIGN"
  | "PRODUCT"
  | "MARKETING"
  | "SALES"
  | "OPERATIONS";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

export type Job = {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  workMode: WorkMode;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  description: string;
  requirements: string;
  publishedAt: string;
};

export type CreateJobRequest = Omit<Job, "id" | "publishedAt">;

export type JobAllotment = {
  used: number;
  total: number;
  resetsOn: string;
  plan: string;
};