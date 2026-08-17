"use client";

import { TaxonomyScreen, type TaxonomyField } from "@/components/console/TaxonomyScreen";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import type { SkillResponse } from "@/contracts";
import { orDash } from "@/lib/format";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillsQuery,
  useUpdateSkillMutation,
} from "@/services/taxonomyApi";

type SkillForm = {
  name: string;
  skillType: string;
};

// `skillType` is free text on the backend, not an enum, so this is an input
// rather than a select — a select here would quietly invent a constraint the
// API does not enforce.
const FIELDS: readonly TaxonomyField<SkillForm>[] = [
  { name: "name", label: "Name", required: true, placeholder: "TypeScript" },
  { name: "skillType", label: "Type", placeholder: "TECHNICAL" },
];

const EMPTY: SkillForm = { name: "", skillType: "" };

export default function SkillsPage() {
  useSetPageHeading("Skills");

  const { data, isLoading, isError, refetch } = useGetSkillsQuery();
  const [create, createState] = useCreateSkillMutation();
  const [update, updateState] = useUpdateSkillMutation();
  const [remove] = useDeleteSkillMutation();

  return (
    <TaxonomyScreen<SkillResponse, SkillForm>
      title="Skills"
      description="One shared vocabulary for job requirements and candidate resumes. Duplicates with different spellings split the matching, so rename rather than add."
      items={data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      fields={FIELDS}
      emptyForm={EMPTY}
      toForm={(item) => ({
        name: item.name,
        skillType: item.skillType ?? "",
      })}
      renderMeta={(item) => orDash(item.skillType)}
      onCreate={(form) => create(form).unwrap()}
      onUpdate={(id, form) => update({ id, body: form }).unwrap()}
      onDelete={(id) => remove(id).unwrap()}
      isSaving={createState.isLoading || updateState.isLoading}
    />
  );
}
