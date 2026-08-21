"use client";

import { useState, type ReactNode } from "react";
import { FolderOpen, Layers, Pencil, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PillTabs } from "@/components/workspace/primitives";
import type { EntityStatus, IndustryResponse, JobCategoryResponse } from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { humanizeEnum } from "@/lib/format";
import {
  useCreateIndustryMutation,
  useCreateJobCategoryMutation,
  useDeleteIndustryMutation,
  useDeleteJobCategoryMutation,
  useGetIndustriesQuery,
  useGetJobCategoriesQuery,
  useUpdateIndustryMutation,
  useUpdateJobCategoryMutation,
} from "@/services/taxonomyApi";

/**
 * Industries and job categories are two independent taxonomies — a company
 * picks one industry, a job post picks one category — but they are edited by
 * the same person in the same sitting, so they live on one screen with a tab
 * switch instead of two separate nav destinations doing the same thing twice.
 */

export type TaxonomyField<TForm> = {
  name: keyof TForm & string;
  label: string;
  kind?: "text" | "textarea" | "select";
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type TaxonomyItem = { id: number; name: string };

const TAB_KEYS = ["industries", "jobCategories"] as const;
export type TaxonomyTab = (typeof TAB_KEYS)[number];

const TAB_LABEL: Record<TaxonomyTab, string> = {
  industries: "Industries",
  jobCategories: "Job categories",
};

const labelToTab: Record<string, TaxonomyTab> = {
  Industries: "industries",
  "Job categories": "jobCategories",
};

const TAB_DESCRIPTION: Record<TaxonomyTab, string> = {
  industries:
    "Every company is classified by exactly one industry, so an entry removed here leaves those companies unclassified until a recruiter picks another.",
  jobCategories:
    "Recruiters file each job post under one category, and seekers filter by it. Keep the list short — a category nobody recognises is worse than none.",
};

type IndustryForm = { name: string; description: string; status: EntityStatus };
type JobCategoryForm = { name: string; description: string };

const INDUSTRY_FIELDS: readonly TaxonomyField<IndustryForm>[] = [
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

const JOB_CATEGORY_FIELDS: readonly TaxonomyField<JobCategoryForm>[] = [
  { name: "name", label: "Name", required: true, placeholder: "Engineering" },
  {
    name: "description",
    label: "Description",
    kind: "textarea",
    placeholder: "What kind of roles belong here.",
  },
];

const EMPTY_INDUSTRY: IndustryForm = { name: "", description: "", status: "ACTIVE" };
const EMPTY_JOB_CATEGORY: JobCategoryForm = { name: "", description: "" };

/** Shape a `<CategoryManager>` needs, regardless of which resource backs it. */
type ManagerProps<TItem extends TaxonomyItem, TForm extends Record<string, string>> = {
  items: TItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  fields: readonly TaxonomyField<TForm>[];
  emptyForm: TForm;
  toForm: (item: TItem) => TForm;
  renderMeta: (item: TItem) => ReactNode;
  onCreate: (form: TForm) => Promise<unknown>;
  onUpdate: (id: number, form: TForm) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  isSaving: boolean;
  singular: string;
  plural: string;
  icon: ReactNode;
};

export function TaxonomyWorkspace({ initialTab }: { initialTab: TaxonomyTab }) {
  useSetPageHeading(
    "Categories",
    "The industry and job-category vocabulary the rest of the console selects from.",
  );

  const [tab, setTab] = useState<TaxonomyTab>(initialTab);

  const industries = useGetIndustriesQuery();
  const [createIndustry, createIndustryState] = useCreateIndustryMutation();
  const [updateIndustry, updateIndustryState] = useUpdateIndustryMutation();
  const [deleteIndustry] = useDeleteIndustryMutation();

  const jobCategories = useGetJobCategoriesQuery();
  const [createJobCategory, createJobCategoryState] = useCreateJobCategoryMutation();
  const [updateJobCategory, updateJobCategoryState] = useUpdateJobCategoryMutation();
  const [deleteJobCategory] = useDeleteJobCategoryMutation();

  const industryProps: ManagerProps<IndustryResponse, IndustryForm> = {
    items: industries.data,
    isLoading: industries.isLoading,
    isError: industries.isError,
    refetch: industries.refetch,
    fields: INDUSTRY_FIELDS,
    emptyForm: EMPTY_INDUSTRY,
    toForm: (item) => ({
      name: item.name,
      description: item.description ?? "",
      status: item.status ?? "ACTIVE",
    }),
    renderMeta: (item) =>
      [humanizeEnum(item.status), item.description].filter(Boolean).join(" · "),
    onCreate: (form) => createIndustry(form).unwrap(),
    onUpdate: (id, form) => updateIndustry({ id, body: form }).unwrap(),
    onDelete: (id) => deleteIndustry(id).unwrap(),
    isSaving: createIndustryState.isLoading || updateIndustryState.isLoading,
    singular: "industry",
    plural: "industries",
    icon: <Layers aria-hidden="true" className="size-4" />,
  };

  const jobCategoryProps: ManagerProps<JobCategoryResponse, JobCategoryForm> = {
    items: jobCategories.data,
    isLoading: jobCategories.isLoading,
    isError: jobCategories.isError,
    refetch: jobCategories.refetch,
    fields: JOB_CATEGORY_FIELDS,
    emptyForm: EMPTY_JOB_CATEGORY,
    toForm: (item) => ({ name: item.name, description: item.description ?? "" }),
    renderMeta: (item) => item.description || "—",
    onCreate: (form) => createJobCategory(form).unwrap(),
    onUpdate: (id, form) => updateJobCategory({ id, body: form }).unwrap(),
    onDelete: (id) => deleteJobCategory(id).unwrap(),
    isSaving: createJobCategoryState.isLoading || updateJobCategoryState.isLoading,
    singular: "job category",
    plural: "job categories",
    icon: <Tags aria-hidden="true" className="size-4" />,
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">{TAB_DESCRIPTION[tab]}</p>
      </Panel>

      <PillTabs
        tabs={TAB_KEYS.map((key) => TAB_LABEL[key])}
        value={TAB_LABEL[tab]}
        onChange={(label) => setTab(labelToTab[label])}
      />

      {tab === "industries" ? (
        <CategoryManager key="industries" {...industryProps} />
      ) : (
        <CategoryManager key="jobCategories" {...jobCategoryProps} />
      )}
    </div>
  );
}

function CategoryManager<
  TItem extends TaxonomyItem,
  TForm extends Record<string, string>,
>({
  items,
  isLoading,
  isError,
  refetch,
  fields,
  emptyForm,
  toForm,
  renderMeta,
  onCreate,
  onUpdate,
  onDelete,
  isSaving,
  singular,
  plural,
  icon,
}: ManagerProps<TItem, TForm>) {
  // `null` = the panel is a blank "add" form, a number = editing that row.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);

  const openEdit = (item: TItem) => {
    setForm(toForm(item));
    setEditingId(item.id);
  };

  const resetToCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async () => {
    const missing = fields.find(
      (field) => field.required && !form[field.name]?.trim(),
    );
    if (missing) {
      toast.error(`${missing.label} is required.`);
      return;
    }

    try {
      if (editingId === null) {
        await onCreate(form);
        toast.success(`${humanizeEnum(singular)} created.`);
        setForm(emptyForm);
      } else {
        await onUpdate(editingId, form);
        toast.success("Changes saved.");
        resetToCreate();
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save this entry."));
    }
  };

  const remove = async (item: TItem) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? Anything still referencing it will lose the link.`,
    );
    if (!confirmed) return;

    try {
      await onDelete(item.id);
      toast.success(`"${item.name}" deleted.`);
      if (editingId === item.id) resetToCreate();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete this entry."));
    }
  };

  const set = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* -------------------------------------------------- category list --- */}
      <Panel>
        <header className="mb-4 flex items-center gap-2">
          <FolderOpen aria-hidden="true" className="size-5" />
          <h2 className="text-[15px] font-semibold tracking-tight">
            {items?.length ?? 0} {items?.length === 1 ? singular : plural}
          </h2>
        </header>

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message={`Unable to load ${plural}.`} onRetry={refetch} />
        ) : (items?.length ?? 0) === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            Nothing here yet. Add the first entry using the panel on the right.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items?.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-center gap-3 rounded-[18px] px-4 py-3 transition-colors",
                  editingId === item.id
                    ? "bg-primary-tint ring-1 ring-primary/30"
                    : "bg-ws-card-hover",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ws-card text-ws-muted">
                  {icon}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ws-fg">
                    {item.name}
                  </p>
                  <div className="mt-0.5 truncate text-xs text-ws-faint">
                    {renderMeta(item)}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${item.name}`}
                  onClick={() => openEdit(item)}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${item.name}`}
                  onClick={() => void remove(item)}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* -------------------------------------------------- add / edit panel --- */}
      <Panel className="lg:sticky lg:top-5">
        <header className="mb-1">
          <h2 className="text-[15px] font-semibold tracking-tight">
            {editingId === null ? `Add ${singular}` : `Edit ${singular}`}
          </h2>
          <p className="mt-1 text-xs text-ws-faint">
            {editingId === null
              ? `Define how ${singular === "industry" ? "companies" : "jobs"} are grouped.`
              : "Update this entry — the row updates as soon as you save."}
          </p>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="mt-4 flex flex-col gap-3"
        >
          {fields.map((field) => (
            <label
              key={field.name}
              className="flex flex-col gap-1.5 text-xs font-medium text-ws-muted"
            >
              {field.label}
              {field.kind === "textarea" ? (
                <Textarea
                  value={form[field.name] ?? ""}
                  onChange={(event) => set(field.name, event.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-24"
                />
              ) : field.kind === "select" ? (
                <select
                  value={form[field.name] ?? ""}
                  onChange={(event) => set(field.name, event.target.value)}
                  className="h-11 rounded-md border border-input bg-surface px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={form[field.name] ?? ""}
                  onChange={(event) => set(field.name, event.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}

          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving
                ? "Saving…"
                : editingId === null
                  ? `Add ${singular}`
                  : "Save changes"}
            </Button>
            {editingId !== null ? (
              <Button type="button" variant="ghost" onClick={resetToCreate}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Panel>
    </div>
  );
}
