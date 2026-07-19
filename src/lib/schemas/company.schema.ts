import { z } from "zod";
import {
  ACCEPTED_LOGO_TYPES,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  MAX_LOGO_SIZE_BYTES,
  MAX_LOGO_SIZE_MB,
} from "@/lib/constants";
import type { CompanySize, Industry } from "@/types/company";

const INDUSTRY_VALUES = INDUSTRY_OPTIONS.map((o) => o.value) as [
  Industry,
  ...Industry[],
];

const COMPANY_SIZE_VALUES = COMPANY_SIZE_OPTIONS.map((o) => o.value) as [
  CompanySize,
  ...CompanySize[],
];

const logoSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_LOGO_SIZE_BYTES,
    `Logo must be ${MAX_LOGO_SIZE_MB}MB or smaller.`,
  )
  .refine(
    (file) => (ACCEPTED_LOGO_TYPES as readonly string[]).includes(file.type),
    "Logo must be an SVG, PNG or JPG file.",
  );

export const companySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters.")
    .max(80, "Company name must be 80 characters or fewer."),
  websiteUrl: z
    .string()
    .min(1, "Website URL is required.")
    .url("Enter a valid URL including https://"),
  industry: z.enum(INDUSTRY_VALUES, { message: "Select an industry" }),
  size: z.enum(COMPANY_SIZE_VALUES, { message: "Select a headcount" }),
  logo: logoSchema.nullable().optional(),
  selfVerified: z.boolean(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
export const companyFormDefaults: CompanyFormValues = {
  name: "",
  websiteUrl: "",
  industry: "" as CompanyFormValues["industry"],
  size: "" as CompanyFormValues["size"],
  logo: null,
  selfVerified: true,
};