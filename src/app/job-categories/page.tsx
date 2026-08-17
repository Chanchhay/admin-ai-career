"use client";

import { TaxonomyScreen, type TaxonomyField } from "@/components/console/TaxonomyScreen";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import type { JobCategoryResponse } from "@/contracts";
import { orDash } from "@/lib/format";
import {
  useCreateJobCategoryMutation,
  useDeleteJobCategoryMutation,
  useGetJobCategoriesQuery,
  useUpdateJobCategoryMutation,
} from "@/services/taxonomyApi";

type JobCategoryForm = {
  name: string;
  description: string;
};

const FIELDS: readonly TaxonomyField<JobCategoryForm>[] = [
  { name: "name", label: "Name", required: true, placeholder: "Engineering" },
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    placeholder: "What kind of roles belong here.",
  },
];

const EMPTY: JobCategoryForm = { name: "", description: "" };

export default function JobCategoriesPage() {
  useSetPageHeading("Job categories");

  const { data, isLoading, isError, refetch } = useGetJobCategoriesQuery();
  const [create, createState] = useCreateJobCategoryMutation();
  const [update, updateState] = useUpdateJobCategoryMutation();
  const [remove] = useDeleteJobCategoryMutation();

  return (
    <TaxonomyScreen<JobCategoryResponse, JobCategoryForm>
      title="Job categories"
      description="Recruiters file each job post under one category, and seekers filter by it. Keep the list short — a category nobody recognises is worse than none."
      items={data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      fields={FIELDS}
      emptyForm={EMPTY}
      toForm={(item) => ({
        name: item.name,
        description: item.description ?? "",
      })}
      renderMeta={(item) => orDash(item.description)}
      onCreate={(form) => create(form).unwrap()}
      onUpdate={(id, form) => update({ id, body: form }).unwrap()}
      onDelete={(id) => remove(id).unwrap()}
      isSaving={createState.isLoading || updateState.isLoading}
    />
  );
}
