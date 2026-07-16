import { z } from "zod";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants";
import type {
  ExperienceLevel,
  JobCategory,
  JobType,
  WorkMode,
} from "@/types/job";

const CATEGORY_VALUES = JOB_CATEGORY_OPTIONS.map((o) => o.value) as [
  JobCategory,
  ...JobCategory[],
];
const WORK_MODE_VALUES = WORK_MODE_OPTIONS.map((o) => o.value) as [
  WorkMode,
  ...WorkMode[],
];
const EXPERIENCE_VALUES = EXPERIENCE_LEVEL_OPTIONS.map((o) => o.value) as [
  ExperienceLevel,
  ...ExperienceLevel[],
];
const JOB_TYPE_VALUES = JOB_TYPE_OPTIONS.map((o) => o.value) as [
  JobType,
  ...JobType[],
];

export const DESCRIPTION_MIN = 50;
export const REQUIREMENTS_MIN = 20;

export const jobSchema = z
  .object({
    title: z
      .string()
      .min(5, "Job title must be at least 5 characters.")
      .max(100, "Job title must be 100 characters or fewer."),

    category: z.enum(CATEGORY_VALUES, { message: "Select a category" }),

    location: z.string().min(2, "Location is required."),

    workMode: z.enum(WORK_MODE_VALUES, { message: "Select a work mode" }),

    salaryMin: z
      .number({ message: "Enter a salary minimum." })
      .int()
      .positive("Enter a salary minimum."),

    salaryMax: z
      .number({ message: "Enter a salary maximum." })
      .int()
      .positive("Enter a salary maximum."),

    experienceLevel: z.enum(EXPERIENCE_VALUES, {
      message: "Select an experience level",
    }),

    jobType: z.enum(JOB_TYPE_VALUES, { message: "Select a job type" }),

    description: z
      .string()
      .min(
        DESCRIPTION_MIN,
        `Describe the role in at least ${DESCRIPTION_MIN} characters.`,
      ),

    requirements: z
      .string()
      .min(REQUIREMENTS_MIN, "List at least a few requirements."),
  })
  .refine((data) => data.salaryMax > data.salaryMin, {
    message: "Maximum salary must be greater than the minimum.",
    path: ["salaryMax"],
  });

export type JobFormValues = z.infer<typeof jobSchema>;

/**
 * salaryMin/salaryMax start as undefined so the inputs render empty and zod
 * produces a real "required" error instead of silently accepting 0.
 */
export const jobFormDefaults = {
  title: "",
  category: "ENGINEERING",
  location: "",
  workMode: "REMOTE",
  salaryMin: undefined,
  salaryMax: undefined,
  experienceLevel: "ENTRY",
  jobType: "FULL_TIME",
  description: "",
  requirements: "",
} as unknown as JobFormValues;