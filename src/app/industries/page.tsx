"use client";

import { TaxonomyWorkspace } from "@/components/console/TaxonomyWorkspace";

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
    <TaxonomyWorkspace initialTab="industries" />;
  );
}
