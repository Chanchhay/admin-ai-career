"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, RotateCcw, User, Briefcase, DollarSign, FileText } from "lucide-react";
import type { JobSeekerProfileResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileFormValues,
} from "@/lib/validation/job-seeker.schema";
import { useUpdateJobSeekerProfileMutation } from "@/services/jobSeekerApi";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectField, TextAreaField, TextField } from "@/components/shared/FormFields";

interface ProfileFormProps {
  profile: JobSeekerProfileResponse;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [updateProfile, { isLoading }] = useUpdateJobSeekerProfileMutation();

  const getDefaultValues = (p: JobSeekerProfileResponse): JobSeekerProfileFormValues => ({
    headline: p.headline || "",
    bio: p.bio || "",
    currentPosition: p.currentPosition || "",
    expectedSalaryMin: p.expectedSalaryMin !== undefined && p.expectedSalaryMin !== null ? String(p.expectedSalaryMin) : "",
    expectedSalaryMax: p.expectedSalaryMax !== undefined && p.expectedSalaryMax !== null ? String(p.expectedSalaryMax) : "",
    expectedSalaryCurrency: p.expectedSalaryCurrency || "USD",
    salaryVisibility: p.salaryVisibility || "RECRUITERS_ONLY",
    preferredLocation: p.preferredLocation || "",
    availabilityStatus: p.availabilityStatus || "Actively Looking",
  });

  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues: getDefaultValues(profile),
  });

  useEffect(() => {
    form.reset(getDefaultValues(profile));
  }, [profile, form]);

  const onSubmit = async (values: JobSeekerProfileFormValues) => {
    try {
      const minSalary = values.expectedSalaryMin.trim() ? Number(values.expectedSalaryMin) : undefined;
      const maxSalary = values.expectedSalaryMax.trim() ? Number(values.expectedSalaryMax) : undefined;

      await updateProfile({
        headline: values.headline.trim() || undefined,
        bio: values.bio.trim() || undefined,
        currentPosition: values.currentPosition.trim() || undefined,
        expectedSalaryMin: minSalary,
        expectedSalaryMax: maxSalary,
        expectedSalaryCurrency: values.expectedSalaryCurrency.trim() || undefined,
        salaryVisibility: values.salaryVisibility,
        preferredLocation: values.preferredLocation.trim() || undefined,
        availabilityStatus: values.availabilityStatus.trim() || undefined,
      }).unwrap();

      toast.success("Profile information updated successfully!");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update profile."));
    }
  };

  const handleReset = () => {
    form.reset(getDefaultValues(profile));
    toast.info("Form reset to saved profile information.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Professional Summary & Overview */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
              <User className="size-5 text-brand" />
              General Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <TextField
              control={form.control}
              name="headline"
              label="Professional Headline"
              placeholder="e.g. Senior Full Stack Software Engineer | React & Node.js Specialist"
              description="A concise summary line displayed at the top of your profile."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                control={form.control}
                name="currentPosition"
                label="Current Position"
                placeholder="e.g. Senior Frontend Engineer at TechCorp"
              />
              <TextField
                control={form.control}
                name="preferredLocation"
                label="Preferred Location"
                placeholder="e.g. Ho Chi Minh City, Remote, Relocation"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                control={form.control}
                name="availabilityStatus"
                label="Availability Status"
                options={[
                  { value: "Actively Looking", label: "Actively Looking - Available Immediately" },
                  { value: "Open to Offers", label: "Open to Offers - Passive Job Seeking" },
                  { value: "Notice Period Required", label: "Serving Notice Period" },
                  { value: "Not Available", label: "Not Available Currently" },
                ]}
              />
            </div>

            <TextAreaField
              control={form.control}
              name="bio"
              label="About You / Bio"
              rows={5}
              placeholder="Write a brief professional summary describing your key skills, background, achievements, and career goals..."
              description="Provide detailed background information for recruiters to learn more about you."
            />
          </CardContent>
        </Card>

        {/* Salary Expectations & Visibility */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="bg-surface-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-heading">
              <DollarSign className="size-5 text-brand" />
              Salary Expectations & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                control={form.control}
                name="expectedSalaryMin"
                label="Minimum Expected Salary"
                type="number"
                placeholder="e.g. 2000"
              />
              <TextField
                control={form.control}
                name="expectedSalaryMax"
                label="Maximum Expected Salary"
                type="number"
                placeholder="e.g. 3500"
              />
              <SelectField
                control={form.control}
                name="expectedSalaryCurrency"
                label="Currency"
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "VND", label: "VND (₫)" },
                  { value: "EUR", label: "EUR (€)" },
                  { value: "SGD", label: "SGD ($)" },
                  { value: "GBP", label: "GBP (£)" },
                ]}
              />
            </div>

            <SelectField
              control={form.control}
              name="salaryVisibility"
              label="Salary Privacy & Visibility"
              description="Control who can see your expected salary range."
              options={[
                { value: "PRIVATE", label: "Private - Only visible to you" },
                { value: "RECRUITERS_ONLY", label: "Recruiters Only - Visible to verified recruiters" },
                { value: "PUBLIC", label: "Public - Visible on your public profile" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading || !form.formState.isDirty}
            className="h-11 rounded-xl px-6"
          >
            <RotateCcw className="mr-2 size-4" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-xl bg-brand px-8 font-medium hover:bg-brand/90 text-white shadow-sm"
          >
            <Save className="mr-2 size-4" />
            {isLoading ? "Saving Profile…" : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
