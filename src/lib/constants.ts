import type { Option } from "@/types/api";
import type { CompanySize, Industry } from "@/types/company";
import type {
  ExperienceLevel,
  JobCategory,
  JobType,
  WorkMode,
} from "@/types/job";

export const INDUSTRY_OPTIONS: Option<Industry>[] = [
  { value: "TECH", label: "Technology" },
  { value: "FINANCE", label: "Finance & Banking" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "RETAIL", label: "Retail & E-commerce" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "EDUCATION", label: "Education" },
];

export const COMPANY_SIZE_OPTIONS: Option<CompanySize>[] = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

export const JOB_CATEGORY_OPTIONS: Option<JobCategory>[] = [
  { value: "ENGINEERING", label: "Engineering" },
  { value: "DESIGN", label: "Design" },
  { value: "PRODUCT", label: "Product" },
  { value: "MARKETING", label: "Marketing" },
  { value: "SALES", label: "Sales" },
  { value: "OPERATIONS", label: "Operations" },
];

export const WORK_MODE_OPTIONS: Option<WorkMode>[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

export const EXPERIENCE_LEVEL_OPTIONS: Option<ExperienceLevel>[] = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior Level" },
  { value: "LEAD", label: "Lead / Principal" },
  { value: "EXECUTIVE", label: "Executive" },
];

export const JOB_TYPE_OPTIONS: Option<JobType>[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

export const MAX_LOGO_SIZE_MB = 5;

export const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

export const ACCEPTED_LOGO_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
] as const;

export const ACCEPTED_LOGO_EXTENSIONS = "SVG, PNG, JPG";