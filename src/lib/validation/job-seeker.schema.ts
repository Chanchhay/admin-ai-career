import { z } from "zod";

export const jobSeekerProfileSchema = z
  .object({
    headline: z.string().trim().max(255, "Headline must not exceed 255 characters."),
    bio: z.string().trim().max(5000, "Bio must not exceed 5000 characters."),
    currentPosition: z
      .string()
      .trim()
      .max(150, "Current position must not exceed 150 characters."),
    expectedSalaryMin: z.string().trim(),
    expectedSalaryMax: z.string().trim(),
    expectedSalaryCurrency: z
      .string()
      .trim()
      .max(10, "Currency code must not exceed 10 characters."),
    salaryVisibility: z.enum(["PRIVATE", "RECRUITERS_ONLY", "PUBLIC"]),
    preferredLocation: z
      .string()
      .trim()
      .max(150, "Preferred location must not exceed 150 characters."),
    availabilityStatus: z
      .string()
      .trim()
      .max(50, "Availability status must not exceed 50 characters."),
  })
  .refine(
    (value) => {
      if (!value.expectedSalaryMin || !value.expectedSalaryMax) return true;
      const min = Number(value.expectedSalaryMin);
      const max = Number(value.expectedSalaryMax);
      if (Number.isNaN(min) || Number.isNaN(max)) return true;
      return max >= min;
    },
    {
      path: ["expectedSalaryMax"],
      message: "Maximum salary must be greater than or equal to minimum salary.",
    },
  );

export type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;

export const publicationSchema = z.object({
  visibility: z.enum(["PUBLIC", "PRIVATE", "HIDDEN"]),
});

export type PublicationFormValues = z.infer<typeof publicationSchema>;
