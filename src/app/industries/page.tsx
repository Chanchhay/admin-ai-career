"use client";

import { TaxonomyScreen, type TaxonomyField } from "@/components/console/TaxonomyScreen";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import type { EntityStatus, IndustryResponse } from "@/contracts";
import { humanizeEnum } from "@/lib/format";
import {
  useCreateIndustryMutation,
  useDeleteIndustryMutation,
  useGetIndustriesQuery,
  useUpdateIndustryMutation,
} from "@/services/taxonomyApi";

type IndustryForm = {
  name: string;
  description: string;
  status: EntityStatus;
};

const FIELDS: readonly TaxonomyField<IndustryForm>[] = [
  { name: "name", label: "Name", required: true, placeholder: "Software" },
  {
    name: "status",
    label: "Status",
    kind: "select",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "PENDING", label: "Pending" },
      { value: "SUSPENDED", label: "Suspended" },
    ],
  },
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    placeholder: "What kind of companies belong here.",
  },
];

const EMPTY: IndustryForm = { name: "", description: "", status: "ACTIVE" };

export default function IndustriesPage() {
  useSetPageHeading("Industries");

  const { data, isLoading, isError, refetch } = useGetIndustriesQuery();
  const [create, createState] = useCreateIndustryMutation();
  const [update, updateState] = useUpdateIndustryMutation();
  const [remove] = useDeleteIndustryMutation();

  return (
    <TaxonomyScreen<IndustryResponse, IndustryForm>
      title="Industries"
      description="Every company is classified by exactly one industry, so an entry removed here leaves those companies unclassified until a recruiter picks another."
      items={data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      fields={FIELDS}
      emptyForm={EMPTY}
      toForm={(item) => ({
        name: item.name,
        description: item.description ?? "",
        status: item.status ?? "ACTIVE",
      })}
      renderMeta={(item) =>
        [item.status ? humanizeEnum(item.status) : "Active", item.description]
          .filter(Boolean)
          .join(" · ")
      }
      onCreate={(form) => create(form).unwrap()}
      onUpdate={(id, form) => update({ id, body: form }).unwrap()}
      onDelete={(id) => remove(id).unwrap()}
      isSaving={createState.isLoading || updateState.isLoading}
    />
  );
}
