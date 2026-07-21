import type {
  ApiResponseListPublicIndustryResponse,
  ApiResponseListPublicJobCategoryResponse,
  ApiResponseListPublicSkillResponse,
  ApiResponsePagePublicJobResponse,
  ApiResponsePublicJobResponse,
  PublicIndustryResponse,
  PublicJobCategoryResponse,
  PublicJobResponse,
  PublicSkillResponse,
} from "@/contracts";
import { ok, pageOf } from "./common";

export const publicSkills: PublicSkillResponse[] = [
  { id: 1, name: "React", skillType: "TECHNICAL" },
  { id: 2, name: "Spring Boot", skillType: "TECHNICAL" },
  { id: 3, name: "UI Design", skillType: "TECHNICAL" },
  { id: 4, name: "Communication", skillType: "SOFT" },
  { id: 5, name: "Data Analysis", skillType: "TECHNICAL" },
];

export const publicJobCategories: PublicJobCategoryResponse[] = [
  {
    id: 10,
    name: "Software Engineering",
    description: "Frontend, backend, mobile, QA, and platform roles.",
  },
  {
    id: 11,
    name: "Design",
    description: "Product design, visual design, UX research, and content.",
  },
  {
    id: 12,
    name: "Data",
    description: "Analytics, data engineering, and business intelligence.",
  },
];

export const publicIndustries: PublicIndustryResponse[] = [
  {
    id: 20,
    name: "Financial Technology",
    description: "Banking, payments, lending, and digital finance.",
  },
  {
    id: 21,
    name: "Education Technology",
    description: "Learning platforms, bootcamps, and digital classrooms.",
  },
  {
    id: 22,
    name: "Telecommunications",
    description: "Connectivity, mobile networks, and communications.",
  },
];

export const publicJobs: PublicJobResponse[] = [
  {
    id: 1001,
    companyId: 501,
    companyName: "ABA Digital",
    categoryId: 10,
    categoryName: "Software Engineering",
    title: "Frontend Developer",
    description:
      "Build reliable, accessible web interfaces for digital banking products.",
    location: "Phnom Penh",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    salaryMin: 900,
    salaryMax: 1600,
    experienceLevel: "MID",
    publishedAt: "2026-07-10T08:00:00Z",
    expiredAt: "2026-08-10T08:00:00Z",
    sections: [
      {
        id: 3001,
        sectionType: "DESCRIPTION",
        title: "Role overview",
        contentMarkdown:
          "Work with product and engineering teams to ship customer-facing features.",
        contentText:
          "Work with product and engineering teams to ship customer-facing features.",
        displayOrder: 1,
      },
      {
        id: 3002,
        sectionType: "REQUIREMENT_RESPONSIBILITY",
        title: "Responsibilities",
        contentMarkdown:
          "Implement React views, review pull requests, and improve accessibility.",
        contentText:
          "Implement React views, review pull requests, and improve accessibility.",
        displayOrder: 2,
      },
    ],
    skills: [
      {
        id: 4001,
        skillId: 1,
        skillName: "React",
        skillType: "TECHNICAL",
        requiredLevel: "INTERMEDIATE",
      },
    ],
  },
  {
    id: 1002,
    companyId: 502,
    companyName: "ISTAD Labs",
    categoryId: 11,
    categoryName: "Design",
    title: "Product Designer",
    description:
      "Design practical learning and career experiences for early-career talent.",
    location: "Phnom Penh",
    jobType: "FULL_TIME",
    workMode: "ONSITE",
    salaryMin: 800,
    salaryMax: 1400,
    experienceLevel: "MID",
    publishedAt: "2026-07-12T08:00:00Z",
    expiredAt: "2026-08-12T08:00:00Z",
    sections: [
      {
        id: 3003,
        sectionType: "DESCRIPTION",
        title: "Role overview",
        contentMarkdown:
          "Create clean product flows, prototypes, and production-ready specs.",
        contentText:
          "Create clean product flows, prototypes, and production-ready specs.",
        displayOrder: 1,
      },
    ],
    skills: [
      {
        id: 4002,
        skillId: 3,
        skillName: "UI Design",
        skillType: "TECHNICAL",
        requiredLevel: "INTERMEDIATE",
      },
    ],
  },
  {
    id: 1003,
    companyId: 503,
    companyName: "Cellcard",
    categoryId: 12,
    categoryName: "Data",
    title: "Data Analyst",
    description:
      "Turn customer, network, and product data into clear operational insights.",
    location: "Phnom Penh",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    salaryMin: 700,
    salaryMax: 1300,
    experienceLevel: "ENTRY",
    publishedAt: "2026-07-14T08:00:00Z",
    expiredAt: "2026-08-14T08:00:00Z",
    sections: [
      {
        id: 3004,
        sectionType: "DESCRIPTION",
        title: "Role overview",
        contentMarkdown:
          "Build dashboards, validate data quality, and explain trends.",
        contentText: "Build dashboards, validate data quality, and explain trends.",
        displayOrder: 1,
      },
    ],
    skills: [
      {
        id: 4003,
        skillId: 5,
        skillName: "Data Analysis",
        skillType: "TECHNICAL",
        requiredLevel: "FOUNDATIONAL",
      },
    ],
  },
];

export const publicJobsResponse: ApiResponsePagePublicJobResponse = ok(
  pageOf(publicJobs),
  "Public jobs loaded",
);

export function publicJobResponse(jobId: number): ApiResponsePublicJobResponse {
  return ok(
    publicJobs.find((job) => job.id === jobId) ?? publicJobs[0],
    "Public job loaded",
  );
}

export const publicSkillsResponse: ApiResponseListPublicSkillResponse = ok(
  publicSkills,
  "Skills loaded",
);

export const publicJobCategoriesResponse:
  ApiResponseListPublicJobCategoryResponse = ok(
    publicJobCategories,
    "Job categories loaded",
  );

export const publicIndustriesResponse: ApiResponseListPublicIndustryResponse =
  ok(publicIndustries, "Industries loaded");
