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
    id: 1,
    companyId: 1,
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
      {
        id: 3005,
        sectionType: "BENEFIT",
        title: "Benefits",
        contentMarkdown:
          "Hybrid schedule, learning support, and product ownership with senior engineers.",
        contentText:
          "Hybrid schedule, learning support, and product ownership with senior engineers.",
        displayOrder: 3,
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
    id: 2,
    companyId: 2,
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
      {
        id: 4004,
        skillId: 4,
        skillName: "Communication",
        skillType: "SOFT",
        requiredLevel: "INTERMEDIATE",
      },
    ],
  },
  {
    id: 3,
    companyId: 3,
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
  {
    id: 4,
    companyId: 1,
    companyName: "ABA Digital",
    categoryId: 10,
    categoryName: "Software Engineering",
    title: "Backend Engineer",
    description:
      "Build Spring Boot services that support job matching and application workflows.",
    location: "Phnom Penh",
    jobType: "FULL_TIME",
    workMode: "ONSITE",
    salaryMin: 1100,
    salaryMax: 1900,
    experienceLevel: "MID",
    publishedAt: "2026-07-16T08:00:00Z",
    expiredAt: "2026-08-16T08:00:00Z",
    sections: [
      {
        id: 3006,
        sectionType: "DESCRIPTION",
        title: "Role overview",
        contentMarkdown:
          "Design secure APIs, optimize data access, and keep services observable.",
        contentText:
          "Design secure APIs, optimize data access, and keep services observable.",
        displayOrder: 1,
      },
      {
        id: 3007,
        sectionType: "QUALIFICATION",
        title: "Qualifications",
        contentMarkdown:
          "Practical Spring Boot experience and clear understanding of REST contracts.",
        contentText:
          "Practical Spring Boot experience and clear understanding of REST contracts.",
        displayOrder: 2,
      },
    ],
    skills: [
      {
        id: 4005,
        skillId: 2,
        skillName: "Spring Boot",
        skillType: "TECHNICAL",
        requiredLevel: "INTERMEDIATE",
      },
      {
        id: 4006,
        skillId: 4,
        skillName: "Communication",
        skillType: "SOFT",
        requiredLevel: "FOUNDATIONAL",
      },
    ],
  },
  {
    id: 5,
    companyId: 4,
    companyName: "Koompi Tech",
    categoryId: 10,
    categoryName: "Software Engineering",
    title: "QA Automation Engineer",
    description:
      "Create automated checks for web applications and help teams ship with confidence.",
    location: "Siem Reap",
    jobType: "CONTRACT",
    workMode: "REMOTE",
    salaryMin: 650,
    salaryMax: 1000,
    experienceLevel: "ENTRY",
    publishedAt: "2026-07-18T08:00:00Z",
    expiredAt: "2026-08-18T08:00:00Z",
    sections: [
      {
        id: 3008,
        sectionType: "DESCRIPTION",
        title: "Role overview",
        contentMarkdown:
          "Write test plans, automate core journeys, and report quality risks early.",
        contentText:
          "Write test plans, automate core journeys, and report quality risks early.",
        displayOrder: 1,
      },
    ],
    skills: [
      {
        id: 4007,
        skillId: 1,
        skillName: "React",
        skillType: "TECHNICAL",
        requiredLevel: "FOUNDATIONAL",
      },
      {
        id: 4008,
        skillId: 4,
        skillName: "Communication",
        skillType: "SOFT",
        requiredLevel: "INTERMEDIATE",
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
