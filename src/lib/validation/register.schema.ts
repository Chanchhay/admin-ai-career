import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().trim().min(3, "Username must be at least 3 characters."),
    email: z.email("Enter a valid email address."),
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    gender: z.enum(["UNSPECIFIED", "MALE", "FEMALE", "OTHER"]),
    role: z.enum(["SEEKER", "RECRUITER"]),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9 ]{8,30}$/, "Enter a valid phone number.")
      .or(z.literal("")),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
