import type {
  AiInterviewResultResponse,
  AiInterviewSessionResponse,
  JobApplicationResponse,
  JobSeekerDashboardMock,
  JobSeekerProfileResponse,
  PortfolioResponse,
  ResumeResponse,
} from "@/contracts";
import { publicJobs } from "./public";

export const jobSeekerProfile: JobSeekerProfileResponse = {
  id: 7001,
  headline: "Frontend developer focused on accessible product interfaces",
  bio: "I build practical React interfaces and enjoy working with product teams.",
  currentPosition: "Junior Frontend Developer",
  expectedSalaryMin: 800,
  expectedSalaryMax: 1200,
  expectedSalaryCurrency: "USD",
  salaryVisibility: "RECRUITERS_ONLY",
  preferredLocation: "Phnom Penh",
  availabilityStatus: "OPEN_TO_WORK",
  publicProfileSlug: "sophea-frontend-developer",
  profileVisibility: "PUBLIC",
  publishedAt: "2026-07-01T08:00:00Z",
  verificationStatus: "APPROVED",
  status: "ACTIVE",
  createdAt: "2026-06-01T08:00:00Z",
  updatedAt: "2026-07-15T08:00:00Z",
};

export const resumes: ResumeResponse[] = [
  {
    id: 8001,
    title: "Frontend Developer Resume",
    resumeFileUrl: "/mock/resumes/frontend-developer.pdf",
    resumeData: {
      skills: ["React", "TypeScript", "Accessibility"],
      yearsOfExperience: 2,
    },
    isDefault: true,
    visibility: "PUBLIC",
    publishedAt: "2026-07-02T08:00:00Z",
    createdAt: "2026-06-02T08:00:00Z",
    updatedAt: "2026-07-02T08:00:00Z",
  },
];

export const portfolios: PortfolioResponse[] = [
  {
    id: 9001,
    title: "Product UI Portfolio",
    summary: "Selected web app and dashboard projects.",
    publicUrl: "https://portfolio.example.com/sophea",
    visibility: "PUBLIC",
    publishedAt: "2026-07-03T08:00:00Z",
    status: "ACTIVE",
    createdAt: "2026-06-03T08:00:00Z",
    updatedAt: "2026-07-03T08:00:00Z",
    projects: [
      {
        id: 9101,
        title: "Career Dashboard",
        description: "A responsive dashboard for tracking applications.",
        projectUrl: "https://portfolio.example.com/career-dashboard",
        githubUrl: "https://github.com/example/career-dashboard",
        imageUrl: "/images/istad.png",
        techStack: "React, TypeScript, Tailwind CSS",
        displayOrder: 1,
        createdAt: "2026-06-05T08:00:00Z",
        updatedAt: "2026-07-03T08:00:00Z",
      },
    ],
  },
];

export const applications: JobApplicationResponse[] = [
  {
    id: 6001,
    jobId: publicJobs[0].id,
    jobTitle: publicJobs[0].title,
    resumeId: resumes[0].id,
    resumeTitle: resumes[0].title,
    coverLetter:
      "I am interested in this role because it matches my React and accessibility experience.",
    status: "AI_INTERVIEW_REQUIRED",
    appliedAt: "2026-07-16T08:00:00Z",
    createdAt: "2026-07-16T08:00:00Z",
  },
  {
    id: 6002,
    jobId: publicJobs[1].id,
    jobTitle: publicJobs[1].title,
    resumeId: resumes[0].id,
    resumeTitle: resumes[0].title,
    coverLetter: "My portfolio includes similar product design systems.",
    status: "UNDER_REVIEW",
    appliedAt: "2026-07-18T08:00:00Z",
    createdAt: "2026-07-18T08:00:00Z",
  },
];

export const aiInterviews: AiInterviewSessionResponse[] = [
  {
    id: 5001,
    applicationId: applications[0].id,
    jobId: applications[0].jobId,
    jobTitle: applications[0].jobTitle,
    status: "READY",
    startedAt: "",
    endedAt: "",
    totalScore: 0,
    result: "NEEDS_REVIEW",
    questionCount: 2,
    answeredCount: 0,
    questions: [
      {
        id: 5101,
        displayOrder: 1,
        questionType: "TECHNICAL",
        questionText:
          "How would you structure reusable UI components in a React application?",
        maxScore: 10,
        answered: false,
      },
      {
        id: 5102,
        displayOrder: 2,
        questionType: "BEHAVIORAL",
        questionText: "Tell us about a time you improved a user workflow.",
        maxScore: 10,
        answered: false,
      },
    ],
  },
];

export const aiInterviewResult: AiInterviewResultResponse = {
  session: {
    ...aiInterviews[0],
    status: "COMPLETED",
    startedAt: "2026-07-19T08:00:00Z",
    endedAt: "2026-07-19T08:30:00Z",
    totalScore: 82,
    result: "PASSED",
    answeredCount: 2,
  },
  feedback: {
    communicationScore: 84,
    technicalScore: 80,
    confidenceScore: 78,
    problemSolvingScore: 86,
    overallScore: 82,
    strengths: "Clear component thinking and practical tradeoff discussion.",
    weaknesses: "Could provide more detail on performance testing.",
    recommendation: "Move forward to recruiter review.",
    result: "PASSED",
  },
};

export const jobSeekerDashboard: JobSeekerDashboardMock = {
  profile: jobSeekerProfile,
  resumes,
  portfolios,
  applications,
  interviews: aiInterviews,
  recommendedJobs: publicJobs,
};
