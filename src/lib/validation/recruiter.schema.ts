import { z } from "zod";

/** Optional URL field: either a valid URL or left blank. */
const optionalUrl = (message: string) => z.url(message).or(z.literal(""));

export const companySchema = z.object({
  name: z.string().trim().min(2, "Company name is required."),
  industryId: z.string(),
  description: z.string(),
  websiteUrl: optionalUrl("Enter a valid website URL."),
  address: z.string(),
  contactEmail: z.email("Enter a valid email address.").or(z.literal("")),
  contactPhone: z
    .string()
    .regex(/^\+?[0-9 ]{8,30}$/, "Enter a valid phone number.")
    .or(z.literal("")),
  logoUrl: optionalUrl("Enter a valid logo URL."),
  businessRegistrationNo: z.string(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const companyDocumentSchema = z.object({
  documentType: z.string().trim().min(2, "Document type is required."),
  documentUrl: z.url("Enter a valid document URL."),
});

export type CompanyDocumentFormValues = z.infer<typeof companyDocumentSchema>;

/**
 * Numeric fields stay strings so an empty input is "" rather than NaN; they are
 * converted at submit time.
 */
export const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters."),
    /** Markdown, stored as a REQUIREMENT_RESPONSIBILITY job section. */
    requirements: z.string(),
    categoryId: z.string(),
    location: z.string(),
    jobType: z.string(),
    workMode: z.string(),
    experienceLevel: z.string(),
    salaryMin: z.string(),
    salaryMax: z.string(),
    expiredAt: z.string(),
  })
  .refine(
    (value) =>
      !value.salaryMin ||
      !value.salaryMax ||
      Number(value.salaryMax) >= Number(value.salaryMin),
    {
      path: ["salaryMax"],
      message: "Maximum salary must be greater than the minimum.",
    },
  );

export type JobFormValues = z.infer<typeof jobSchema>;

export const recruiterProfileSchema = z.object({
  position: z.string(),
  linkedinUrl: optionalUrl("Enter a valid LinkedIn URL."),
});

export type RecruiterProfileFormValues = z.infer<typeof recruiterProfileSchema>;
