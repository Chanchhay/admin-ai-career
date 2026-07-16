import { Briefcase, EyeOff, MapPin } from "lucide-react";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/constants";
import { formatCurrency, stripMarkdown } from "@/lib/format";
import type { Option } from "@/types/api";
import type {
  ExperienceLevel,
  JobCategory,
  JobType,
  WorkMode,
} from "@/types/job";

type JobPreviewCardProps = {
  title: string;
  category: JobCategory;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
};

function labelOf<T extends string>(
  options: Option<T>[],
  value: T | undefined,
): string | undefined {
  return options.find((option) => option.value === value)?.label;
}

function PreviewBadge({
  children,
  icon,
}: {
  children: string;
  icon?: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
      {icon}
      {children}
    </span>
  );
}

export function JobPreviewCard({
  title,
  category,
  location,
  workMode,
  jobType,
  experienceLevel,
  salaryMin,
  salaryMax,
  description,
}: JobPreviewCardProps) {
  const hasDescription = description.trim().length > 0;

  if (!hasDescription) {
    return (
      <section
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-12 text-center"
      >
        <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-slate-200/70">
          <EyeOff aria-hidden="true" className="size-4 text-slate-400" />
        </span>
        <p className="text-sm font-semibold text-heading">No Preview Yet</p>
        <p className="mt-1 max-w-[80%] text-xs leading-relaxed text-slate-400">
          Start typing your description to see how your card will appear to
          talent.
        </p>
      </section>
    );
  }

  const showSalary = salaryMin !== undefined && salaryMax !== undefined;

  return (
    <section
      aria-live="polite"
      className="surface-card p-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint">
          <Briefcase aria-hidden="true" className="size-4 text-brand" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-heading">
            {title.trim() || "Untitled Role"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {labelOf(JOB_CATEGORY_OPTIONS, category)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {location.trim() ? (
          <PreviewBadge
            icon={<MapPin aria-hidden="true" className="size-2.5" />}
          >
            {location.trim()}
          </PreviewBadge>
        ) : null}

        {labelOf(WORK_MODE_OPTIONS, workMode) ? (
          <PreviewBadge>{labelOf(WORK_MODE_OPTIONS, workMode) ?? ""}</PreviewBadge>
        ) : null}

        {labelOf(JOB_TYPE_OPTIONS, jobType) ? (
          <PreviewBadge>{labelOf(JOB_TYPE_OPTIONS, jobType) ?? ""}</PreviewBadge>
        ) : null}

        {labelOf(EXPERIENCE_LEVEL_OPTIONS, experienceLevel) ? (
          <PreviewBadge>
            {labelOf(EXPERIENCE_LEVEL_OPTIONS, experienceLevel) ?? ""}
          </PreviewBadge>
        ) : null}
      </div>

      {showSalary ? (
        <p className="mt-3 text-sm font-semibold text-brand">
          {formatCurrency(salaryMin)} – {formatCurrency(salaryMax)}
        </p>
      ) : null}

      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">
        {stripMarkdown(description)}
      </p>

      <p className="mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
        Preview • visible to talent after publishing
      </p>
    </section>
  );
}