"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FieldWrapper } from "@/components/shared/FieldWrapper";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toApiError } from "@/lib/api-error";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants";
import { formatThousands, parseNumericInput } from "@/lib/format";
import {
  DESCRIPTION_MIN,
  REQUIREMENTS_MIN,
  jobFormDefaults,
  jobSchema,
  type JobFormValues,
} from "@/lib/schemas/job.schema";
import { useCreateJobMutation } from "@/redux/api/jobApi";
import { AiEnhanceButton } from "./AiEnhanceButton";
import { JobPreviewCard } from "./JobPreviewCard";
import { RichTextField } from "./RichTextField";
import { SmartTipCard } from "./SmartTipCard";
import { WeeklyAllotmentCard } from "./WeeklyAllotmentCard";

const FORM_ID = "job-form";

const FIELD_NAMES: readonly (keyof JobFormValues)[] = [
  "title",
  "category",
  "location",
  "workMode",
  "salaryMin",
  "salaryMax",
  "experienceLevel",
  "jobType",
  "description",
  "requirements",
];

function isFormField(field: string): field is keyof JobFormValues {
  return (FIELD_NAMES as readonly string[]).includes(field);
}

export function JobForm() {
  const [createJob, { isLoading }] = useCreateJobMutation();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    mode: "onBlur",
    defaultValues: jobFormDefaults,
  });

  const watched = useWatch({ control: form.control });

  const onSubmit = async (values: JobFormValues) => {
    try {
      const job = await createJob(values).unwrap();
      toast.success(`${job.title} is now live.`);
      form.reset(jobFormDefaults);
    } catch (error) {
      const apiError = toApiError(error);

      if (apiError.status === 429) {
        toast.error(apiError.message, {
          description: "Use Upgrade Plan to raise your weekly limit.",
        });
        return;
      }

      if (apiError.field && isFormField(apiError.field)) {
        form.setError(apiError.field, { message: apiError.message });
        return;
      }

      toast.error(apiError.message);
    }
  };

  return (
    <Form {...form}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* LEFT */}
        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-heading">
                Post New Job
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the details to create a new AI-optimized job listing.
              </p>
            </div>

            <Button
              type="submit"
              form={FORM_ID}
              disabled={isLoading}
              className="h-10 shrink-0 bg-brand font-semibold text-white hover:bg-brand-hover"
            >
              {isLoading ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="mr-2 size-4 animate-spin"
                  />
                  Publishing...
                </>
              ) : (
                "Publish Job"
              )}
            </Button>
          </div>

          <Separator className="my-6 bg-slate-100" />

          <form
            id={FORM_ID}
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="grid gap-5 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Job Title">
                  <Input
                    {...field}
                    placeholder="e.g. Senior Full Stack Engineer"
                    aria-invalid={fieldState.invalid}
                    className="field-input"
                  />
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Category / Department">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="field-input w-full"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Location">
                  <div className="relative">
                    <MapPin
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                      {...field}
                      placeholder="Remote / San Francisco, CA"
                      aria-invalid={fieldState.invalid}
                      className="field-input pl-9"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="workMode"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Work Mode">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="field-input w-full"
                    >
                      <SelectValue placeholder="Select work mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_MODE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMin"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Salary Min">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                    >
                      $
                    </span>
                    <Input
                      inputMode="numeric"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={formatThousands(field.value)}
                      onChange={(event) =>
                        field.onChange(parseNumericInput(event.target.value))
                      }
                      placeholder="80,000"
                      aria-invalid={fieldState.invalid}
                      className="field-input pl-7"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="salaryMax"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Salary Max">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
                    >
                      $
                    </span>
                    <Input
                      inputMode="numeric"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={formatThousands(field.value)}
                      onChange={(event) =>
                        field.onChange(parseNumericInput(event.target.value))
                      }
                      placeholder="120,000"
                      aria-invalid={fieldState.invalid}
                      className="field-input pl-7"
                    />
                  </div>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Experience Level">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="field-input w-full"
                    >
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="jobType"
              render={({ field, fieldState }) => (
                <FieldWrapper label="Job Type">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      className="field-input w-full"
                    >
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldWrapper>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="job-description" className="label-section">
                      Job Description
                    </label>
                    <AiEnhanceButton
                      value={field.value}
                      onEnhanced={field.onChange}
                    />
                  </div>

                  <RichTextField
                    id="job-description"
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    minLength={DESCRIPTION_MIN}
                    placeholder="Write the core responsibilities and mission of this role..."
                  />

                  {fieldState.error ? (
                    <p className="text-xs font-medium text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field, fieldState }) => (
                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="job-requirements" className="label-section">
                    Requirements &amp; Responsibilities
                  </label>

                  <RichTextField
                    id="job-requirements"
                    value={field.value}
                    onChange={field.onChange}
                    tools={["bold", "list"]}
                    invalid={fieldState.invalid}
                    minLength={REQUIREMENTS_MIN}
                    placeholder="List the specific technical requirements, years of experience, and day-to-day duties..."
                  />

                  {fieldState.error ? (
                    <p className="text-xs font-medium text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </form>
        </section>

        {/* RIGHT */}
        <aside className="space-y-6">
          <WeeklyAllotmentCard />
          <SmartTipCard />
          <JobPreviewCard
            title={watched.title ?? jobFormDefaults.title}
            category={watched.category ?? jobFormDefaults.category}
            location={watched.location ?? jobFormDefaults.location}
            workMode={watched.workMode ?? jobFormDefaults.workMode}
            jobType={watched.jobType ?? jobFormDefaults.jobType}
            experienceLevel={
              watched.experienceLevel ?? jobFormDefaults.experienceLevel
            }
            salaryMin={watched.salaryMin}
            salaryMax={watched.salaryMax}
            description={watched.description ?? jobFormDefaults.description}
          />
        </aside>
      </div>
    </Form>
  );
}
