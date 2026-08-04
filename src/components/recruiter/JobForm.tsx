"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type {
  JobPostRequest,
  JobPostResponse,
  JobPostSectionRequest,
} from "@/contracts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { SelectField, TextField } from "@/components/shared/FormFields";
import { getApiErrorMessage } from "@/lib/api-error";
import { markdownToPlainText } from "@/lib/markdown";
import {
  experienceLevelOptions,
  jobTypeOptions,
  NOT_SPECIFIED,
  withNotSpecified,
  workModeOptions,
} from "@/lib/job-options";
import {
  jobSchema,
  type JobFormValues,
} from "@/lib/validation/recruiter.schema";
import { useGetPublicJobCategoriesQuery } from "@/services/publicApi";
import {
  useCreateJobDraftMutation,
  usePublishJobMutation,
  useUpdateJobMutation,
} from "@/services/recruiterApi";

const REQUIREMENTS_SECTION = "REQUIREMENT_RESPONSIBILITY";

function toFormValues(job?: JobPostResponse): JobFormValues {
  const requirements = job?.sections?.find(
    (section) => section.sectionType === REQUIREMENTS_SECTION,
  );

  return {
    title: job?.title ?? "",
    description: job?.description ?? "",
    requirements: requirements?.contentMarkdown ?? "",
    categoryId: job?.categoryId ? String(job.categoryId) : NOT_SPECIFIED,
    location: job?.location ?? "",
    jobType: job?.jobType || NOT_SPECIFIED,
    workMode: job?.workMode || NOT_SPECIFIED,
    experienceLevel: job?.experienceLevel || NOT_SPECIFIED,
    salaryMin: job?.salaryMin ? String(job.salaryMin) : "",
    salaryMax: job?.salaryMax ? String(job.salaryMax) : "",
    // The API returns an ISO timestamp; <input type="date"> needs just the date.
    expiredAt: job?.expiredAt ? job.expiredAt.slice(0, 10) : "",
  };
}

const optional = (value: string) =>
  value && value !== NOT_SPECIFIED ? value : undefined;

/**
 * `expiredAt` is declared `format: date-time`, but <input type="date"> yields a
 * bare `YYYY-MM-DD` — which Jackson cannot read, failing the whole body.
 *
 * Sent as an end-of-day UTC instant ("…T16:59:59.000Z"), matching the format the
 * API's own timestamps use. If the backend field is a LocalDateTime rather than
 * an Instant it will reject the `Z`; drop to `${value}T23:59:59` in that case.
 */
function toDateTime(value: string) {
  if (!value) return undefined;
  const endOfDay = new Date(`${value}T23:59:59`);
  return Number.isNaN(endOfDay.getTime()) ? undefined : endOfDay.toISOString();
}

export function JobForm({ job }: { job?: JobPostResponse }) {
  const router = useRouter();
  const categories = useGetPublicJobCategoriesQuery();
  const [createJobDraft, creation] = useCreateJobDraftMutation();
  const [updateJob, update] = useUpdateJobMutation();
  const [publishJob, publication] = usePublishJobMutation();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    values: toFormValues(job),
  });

  const isSaving = creation.isLoading || update.isLoading || publication.isLoading;

  const toRequest = (values: JobFormValues): JobPostRequest => {
    const sections: JobPostSectionRequest[] = values.requirements.trim()
      ? [
          {
            sectionType: REQUIREMENTS_SECTION,
            title: "Requirements & responsibilities",
            contentMarkdown: values.requirements,
            // Plain-text mirror, so anything indexing the section body sees words
            // rather than markdown punctuation.
            contentText: markdownToPlainText(values.requirements),
            displayOrder: 1,
          },
        ]
      : [];

    return {
      title: values.title,
      description: values.description,
      categoryId:
        values.categoryId === NOT_SPECIFIED
          ? undefined
          : Number(values.categoryId),
      location: optional(values.location),
      jobType: optional(values.jobType),
      workMode: optional(values.workMode),
      experienceLevel: optional(values.experienceLevel),
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      expiredAt: toDateTime(values.expiredAt),
      sections,
    };
  };

  /** Saves, then optionally publishes — a new post is always created as a draft. */
  const submit = async (values: JobFormValues, publish: boolean) => {
    const body = toRequest(values);
    let saved: JobPostResponse;

    try {
      saved = job
        ? await updateJob({ id: job.id, body }).unwrap()
        : await createJobDraft(body).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save the job."));
      return;
    }

    if (publish) {
      try {
        await publishJob(saved.id).unwrap();
        toast.success("Job published.");
      } catch (error) {
        // The draft exists either way, so move on to it rather than let a retry
        // create a second copy.
        toast.error(
          getApiErrorMessage(error, "Saved as a draft, but publishing failed."),
        );
      }
    } else {
      toast.success(job ? "Job updated." : "Draft saved.");
    }

    router.push(`/recruiter/jobs/${saved.id}`);
  };

  const categoryOptions = withNotSpecified(
    (categories.data ?? []).map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  );

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => submit(values, false))}
      >
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            type="submit"
            variant="outline"
            className="h-11 rounded-lg px-6"
            disabled={isSaving}
          >
            {job ? "Save changes" : "Save draft"}
          </Button>
          <Button
            type="button"
            className="h-11 rounded-lg px-6"
            disabled={isSaving}
            onClick={form.handleSubmit((values) => submit(values, true))}
          >
            {publication.isLoading ? "Publishing…" : "Publish Job"}
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            control={form.control}
            name="title"
            label="Job title"
            placeholder="e.g. Senior Full Stack Engineer"
          />
          <SelectField
            control={form.control}
            name="categoryId"
            label="Category / department"
            options={categoryOptions}
          />
          <TextField
            control={form.control}
            name="location"
            label="Location"
            placeholder="Remote / Phnom Penh, Cambodia"
          />
          <SelectField
            control={form.control}
            name="workMode"
            label="Work mode"
            options={withNotSpecified(workModeOptions)}
          />
          <TextField
            control={form.control}
            name="salaryMin"
            label="Salary min"
            type="number"
            placeholder="80000"
          />
          <TextField
            control={form.control}
            name="salaryMax"
            label="Salary max"
            type="number"
            placeholder="120000"
          />
          <SelectField
            control={form.control}
            name="experienceLevel"
            label="Experience level"
            options={withNotSpecified(experienceLevelOptions)}
          />
          <SelectField
            control={form.control}
            name="jobType"
            label="Job type"
            options={withNotSpecified(jobTypeOptions)}
          />
          <TextField
            control={form.control}
            name="expiredAt"
            label="Expires on"
            type="date"
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write the core responsibilities and mission of this role…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements &amp; responsibilities</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="List the specific technical requirements, years of experience, and day-to-day duties…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-lg px-6"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
