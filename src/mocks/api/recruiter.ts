import type {
  CompanyDocumentResponse,
  CompanyResponse,
  ForwardedApplicationResponse,
  JobPostResponse,
  PublicTalentListItemResponse,
  RecruiterDashboardMock,
  RecruiterProfileResponse,
} from "@/contracts";
import { aiInterviewResult } from "./job-seeker";

export const recruiterProfile: RecruiterProfileResponse = {
  id: 3001,
  position: "Talent Acquisition Lead",
  linkedinUrl: "https://www.linkedin.com/in/recruiter-demo",
  status: "ACTIVE",
};

export const company: CompanyResponse = {
  id: 501,
  recruiterProfileId: recruiterProfile.id,
  industryId: 20,
  industryName: "Financial Technology",
  name: "ABA Digital",
  description:
    "Digital finance product group hiring software, design, and data talent.",
  websiteUrl: "https://www.ababank.com",
  address: "Phnom Penh, Cambodia",
  contactEmail: "talent@example.com",
  contactPhone: "+855 12 345 678",
  logoUrl: "/images/logo.png",
  businessRegistrationNo: "BR-2026-001",
  verificationStatus: "APPROVED",
  status: "ACTIVE",
};

export const companyDocuments: CompanyDocumentResponse[] = [
  {
    id: 701,
    companyId: company.id,
    uploadedByRecruiterProfileId: recruiterProfile.id,
    documentType: "BUSINESS_REGISTRATION",
    documentUrl: "/mock/company/business-registration.pdf",
    status: "ACTIVE",
    createdAt: "2026-07-01T08:00:00Z",
  },
  {
    id: 702,
    companyId: company.id,
    uploadedByRecruiterProfileId: recruiterProfile.id,
    documentType: "TAX_CERTIFICATE",
    documentUrl: "/mock/company/tax-certificate.pdf",
    status: "PENDING",
    createdAt: "2026-07-03T08:00:00Z",
  },
];

export const recruiterJobs: JobPostResponse[] = [
  {
    id: 1001,
    companyId: company.id,
    companyName: company.name,
    recruiterProfileId: recruiterProfile.id,
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
    status: "PUBLISHED",
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
    id: 1004,
    companyId: company.id,
    companyName: company.name,
    recruiterProfileId: recruiterProfile.id,
    categoryId: 12,
    categoryName: "Data",
    title: "Business Intelligence Analyst",
    description:
      "Prepare dashboards and reporting workflows for product and leadership teams.",
    location: "Phnom Penh",
    jobType: "FULL_TIME",
    workMode: "ONSITE",
    salaryMin: 700,
    salaryMax: 1200,
    experienceLevel: "MID",
    status: "DRAFT",
    publishedAt: "",
    expiredAt: "2026-08-25T08:00:00Z",
    sections: [],
    skills: [],
  },
];

export const publicTalent: PublicTalentListItemResponse[] = [
  {
    profileId: 7001,
    publicProfileSlug: "sophea-frontend-developer",
    headline: "Frontend developer focused on accessible product interfaces",
    bio: "I build practical React interfaces and enjoy working with product teams.",
    currentPosition: "Junior Frontend Developer",
    preferredLocation: "Phnom Penh",
    availabilityStatus: "OPEN_TO_WORK",
    expectedSalaryMin: 800,
    expectedSalaryMax: 1200,
    expectedSalaryCurrency: "USD",
    salaryVisibility: "RECRUITERS_ONLY",
  },
  {
    profileId: 7002,
    publicProfileSlug: "dara-data-analyst",
    headline: "Data analyst turning operational data into decisions",
    bio: "I focus on reporting systems, data quality, and stakeholder-ready dashboards.",
    currentPosition: "Data Analyst",
    preferredLocation: "Phnom Penh",
    availabilityStatus: "OPEN_TO_WORK",
    expectedSalaryMin: 700,
    expectedSalaryMax: 1100,
    expectedSalaryCurrency: "USD",
    salaryVisibility: "PUBLIC",
  },
];

export const forwardedApplications: ForwardedApplicationResponse[] = [
  {
    application: {
      id: 6001,
      jobId: 1001,
      jobTitle: "Frontend Developer",
      coverLetter:
        "I am interested in this role because it matches my React and accessibility experience.",
      status: "SHORTLISTED",
      appliedAt: "2026-07-16T08:00:00Z",
    },
    candidate: {
      id: 7001,
      headline: "Frontend developer focused on accessible product interfaces",
      currentPosition: "Junior Frontend Developer",
      preferredLocation: "Phnom Penh",
      availabilityStatus: "OPEN_TO_WORK",
    },
    submittedResume: {
      id: 8001,
      title: "Frontend Developer Resume",
      resumeFileUrl: "/mock/resumes/frontend-developer.pdf",
      visibility: "PRIVATE",
    },
    aiResult: aiInterviewResult,
    humanInterviews: [],
    forwardedAt: "2026-07-20T08:00:00Z",
  },
];

export const recruiterDashboard: RecruiterDashboardMock = {
  profile: recruiterProfile,
  company,
  jobs: recruiterJobs,
  forwardedApplications,
  talent: publicTalent,
};
