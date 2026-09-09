"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  FolderOpen,
  Layers,
  LoaderCircle,
  Pencil,
  Plus,
  Tags,
  Trash2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useSetPageHeading } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PillTabs } from "@/components/workspace/primitives";
import type {
  EntityStatus,
  IndustryResponse,
  JobCategoryResponse,
  SkillResponse,
} from "@/contracts";
import { getApiErrorMessage } from "@/lib/api-error";
import { getListDeleteErrorMessage } from "@/lib/list-delete-error";
import { cn } from "@/lib/utils";
import { humanizeEnum, orDash } from "@/lib/format";
import {
  useCreateIndustryMutation,
  useCreateJobCategoryMutation,
  useCreateSkillMutation,
  useDeleteIndustryMutation,
  useDeleteJobCategoryMutation,
  useDeleteSkillMutation,
  useGetIndustriesQuery,
  useGetJobCategoriesQuery,
  useGetSkillsQuery,
  useUpdateIndustryMutation,
  useUpdateJobCategoryMutation,
  useUpdateSkillMutation,
} from "@/services/taxonomyApi";

/**
 * Industries, job categories and skills are three independent taxonomies — a
 * company picks one industry, a job post picks one category, a job or resume
 * picks any number of skills — but they are edited by the same person in the
 * same sitting, so they live on one screen with a tab switch instead of
 * separate nav destinations doing the same thing three times over.
 */

export type TaxonomyField<TForm> = {
  name: keyof TForm & string;
  label: string;
  kind?: "text" | "textarea" | "select";
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type TaxonomyItem = { id: string; name: string; parentId: string | null };

const TAB_KEYS = ["industries", "jobCategories", "skills"] as const;
export type TaxonomyTab = (typeof TAB_KEYS)[number];

const TAB_LABEL: Record<TaxonomyTab, string> = {
  industries: "Industries",
  jobCategories: "Job categories",
  skills: "Skills",
};

const labelToTab: Record<string, TaxonomyTab> = {
  Industries: "industries",
  "Job categories": "jobCategories",
  Skills: "skills",
};

const TAB_DESCRIPTION: Record<TaxonomyTab, string> = {
  industries:
    "Manage the industries recruiters choose when adding a company, such as banking, education, or technology.",
  jobCategories:
    "Manage the categories recruiters use to group jobs and job seekers use to find relevant roles.",
  skills:
    "Manage the skills used in job requirements and candidate resumes. Check for an existing skill before adding a new one.",
};

type IndustryForm = { name: string; description: string; status: EntityStatus; parentId: string };
type JobCategoryForm = { name: string; description: string; parentId: string };
type SkillForm = { name: string; skillType: string; parentId: string };

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

const SKILL_FIELDS: readonly TaxonomyField<SkillForm>[] = [
  { name: "name", label: "Name", required: true, placeholder: "TypeScript" },
  { name: "skillType", label: "Type", placeholder: "TECHNICAL" },
];

const EMPTY_INDUSTRY: IndustryForm = { name: "", description: "", status: "ACTIVE", parentId: "" };
const EMPTY_JOB_CATEGORY: JobCategoryForm = { name: "", description: "", parentId: "" };
const EMPTY_SKILL: SkillForm = { name: "", skillType: "", parentId: "" };

const ADD_HINT: Record<string, string> = {
  industry: "Define how companies are grouped.",
  "job category": "Define how jobs are grouped.",
  skill: "Define a term jobs and resumes can both reference.",
};

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
  onUpdate: (id: string, form: TForm) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  isSaving: boolean;
  singular: string;
  plural: string;
  icon: ReactNode;
};

export function TaxonomyWorkspace({ initialTab }: { initialTab: TaxonomyTab }) {
  useSetPageHeading(
    "Platform lists",
    "Manage industries, job categories, and skills.",
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

  const skills = useGetSkillsQuery();
  const [createSkill, createSkillState] = useCreateSkillMutation();
  const [updateSkill, updateSkillState] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

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
      parentId: item.parentId ?? "",
    }),
    renderMeta: (item) =>
      [humanizeEnum(item.status), item.description].filter(Boolean).join(" · "),
    onCreate: (form) => createIndustry({ ...form, parentId: form.parentId || null }).unwrap(),
    onUpdate: (id, form) => updateIndustry({ id, body: { ...form, parentId: form.parentId || null } }).unwrap(),
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
    toForm: (item) => ({ name: item.name, description: item.description ?? "", parentId: item.parentId ?? "" }),
    renderMeta: (item) => item.description || "—",
    onCreate: (form) => createJobCategory({ ...form, parentId: form.parentId || null }).unwrap(),
    onUpdate: (id, form) => updateJobCategory({ id, body: { ...form, parentId: form.parentId || null } }).unwrap(),
    onDelete: (id) => deleteJobCategory(id).unwrap(),
    isSaving: createJobCategoryState.isLoading || updateJobCategoryState.isLoading,
    singular: "job category",
    plural: "job categories",
    icon: <Tags aria-hidden="true" className="size-4" />,
  };

  const skillProps: ManagerProps<SkillResponse, SkillForm> = {
    items: skills.data,
    isLoading: skills.isLoading,
    isError: skills.isError,
    refetch: skills.refetch,
    fields: SKILL_FIELDS,
    emptyForm: EMPTY_SKILL,
    toForm: (item) => ({ name: item.name, skillType: item.skillType ?? "", parentId: item.parentId ?? "" }),
    renderMeta: (item) => orDash(item.skillType),
    onCreate: (form) => createSkill({ ...form, parentId: form.parentId || null }).unwrap(),
    onUpdate: (id, form) => updateSkill({ id, body: { ...form, parentId: form.parentId || null } }).unwrap(),
    onDelete: (id) => deleteSkill(id).unwrap(),
    isSaving: createSkillState.isLoading || updateSkillState.isLoading,
    singular: "skill",
    plural: "skills",
    icon: <Wrench aria-hidden="true" className="size-4" />,
  };

  return (
    <div className="flex flex-col gap-3">
      <Panel tone="soft">
        <p className="text-base leading-6">{TAB_DESCRIPTION[tab]}</p>
      </Panel>

      <PillTabs
        tabs={TAB_KEYS.map((key) => TAB_LABEL[key])}
        value={TAB_LABEL[tab]}
        onChange={(label) => setTab(labelToTab[label])}
      />

      {tab === "industries" ? (
        <CategoryManager key="industries" {...industryProps} />
      ) : tab === "jobCategories" ? (
        <CategoryManager key="jobCategories" {...jobCategoryProps} />
      ) : (
        <CategoryManager key="skills" {...skillProps} />
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
  // A selected ID edits that entry; null opens the add form.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);
  const [entryLevel, setEntryLevel] = useState("Parent category");
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const parents = (items ?? []).filter((item) => !item.parentId);
  const childCount = (items ?? []).filter((item) => item.parentId).length;
  const entryLabel = entryLevel === "Subcategory" ? "subcategory" : "parent category";

  const [deleteTarget, setDeleteTarget] = useState<TItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openEdit = (item: TItem) => {
    setEntryLevel(item.parentId ? "Subcategory" : "Parent category");
    setForm(toForm(item));
    setEditingId(item.id);
  };

  const resetToCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setEntryLevel("Parent category");
  };

  const submit = async () => {
    if (entryLevel === "Subcategory" && !form.parentId) {
      toast.error("Choose a parent category for this subcategory.");
      return;
    }
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
        toast.success(`${humanizeEnum(entryLabel)} created.`);
        setForm({ ...emptyForm, parentId: form.parentId });
      } else {
        await onUpdate(editingId, form);
        toast.success("Changes saved.");
        resetToCreate();
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save this entry."));
    }
  };

  const remove = async () => {
    if (!deleteTarget || isDeleting) return;
    const item = deleteTarget;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDelete(item.id);
      toast.success(`"${item.name}" deleted.`);
      if (editingId === item.id) resetToCreate();
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(getListDeleteErrorMessage(error, singular, !item.parentId));
    } finally {
      setIsDeleting(false);
    }
  };

  const set = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  function itemActions(item: TItem) {
    return (
      <>
        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${item.name}`}
          disabled={isSaving || isDeleting} onClick={() => openEdit(item)}>
          <Pencil aria-hidden="true" className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${item.name}`}
          disabled={isSaving || isDeleting} onClick={() => {
            setDeleteError(null);
            setDeleteTarget(item);
          }}>
          <Trash2 aria-hidden="true" className="size-4" />
        </Button>
      </>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_360px] lg:items-start max-lg:min-w-0 max-lg:grid-cols-1">
      {/* -------------------------------------------------- category list --- */}
      <Panel className="max-sm:min-w-0 max-sm:p-3">
        <header className="mb-4 flex items-center gap-2">
          <FolderOpen aria-hidden="true" className="size-4" />
          <h2 className="text-base font-semibold tracking-tight">
            {parents.length} {parents.length === 1 ? "parent category" : "parent categories"}
            <span className="ml-2 text-sm font-normal text-ws-faint">{childCount} subcategories</span>
          </h2>
        </header>

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState message={`Unable to load ${plural}.`} onRetry={refetch} />
        ) : (items?.length ?? 0) === 0 ? (
          <p className="rounded-xl bg-ws-card-hover px-4 py-6 text-center text-base text-ws-faint">
            Nothing here yet. Add the first entry using the panel on the right.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {parents.map((parent) => {
              const children = (items ?? []).filter((item) => item.parentId === parent.id);
              const collapsed = collapsedIds.has(parent.id);
              return (
                <section key={parent.id} className="overflow-hidden rounded-xl border border-ws-line bg-ws-panel">
                  <div className="flex flex-wrap items-center gap-2 bg-ws-card px-3 py-3">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`${collapsed ? "Expand" : "Collapse"} ${parent.name}`}
                      aria-expanded={!collapsed}
                      aria-controls={`list-group-${parent.id}`}
                      onClick={() => setCollapsedIds((current) => {
                        const next = new Set(current);
                        if (next.has(parent.id)) next.delete(parent.id);
                        else next.add(parent.id);
                        return next;
                      })}
                    >
                      {collapsed ? <ChevronRight aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                    </Button>
                    <div className="min-w-0 flex-1 max-sm:basis-[calc(100%-3rem)]">
                      <h3 className="truncate text-base font-semibold max-sm:whitespace-normal max-sm:break-words">{parent.name}</h3>
                      <div className="mt-0.5 truncate text-sm text-ws-muted max-sm:whitespace-normal max-sm:break-words">{renderMeta(parent)}</div>
                      <p className="text-sm text-ws-faint">
                        {children.length} {children.length === 1 ? "subcategory" : "subcategories"}
                      </p>
                    </div>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Add subcategory to ${parent.name}`}
                      disabled={isSaving || isDeleting}
                      onClick={() => {
                        setEditingId(null);
                        setEntryLevel("Subcategory");
                        setForm({ ...emptyForm, parentId: parent.id });
                      }}
                    >
                      <Plus aria-hidden="true" />
                    </Button>
                    {itemActions(parent)}
                  </div>
                  <div id={`list-group-${parent.id}`} hidden={collapsed}>
                    {children.length === 0 ? (
                      <p className="px-5 py-5 text-base text-ws-faint">
                        No subcategories yet. Use the + button to add one.
                      </p>
                    ) : (
                      <ul className="divide-y divide-ws-line">
                        {children.map((item) => (
                          <li key={item.id} className={cn(
                            "flex items-center gap-3 px-4 py-3 sm:pl-8 max-sm:flex-wrap max-sm:px-3",
                            editingId === item.id && "bg-primary-tint",
                          )}>
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ws-card text-ws-muted">{icon}</span>
                            <div className="min-w-0 flex-1 max-sm:basis-[calc(100%-3rem)]">
                              <p className="truncate text-base font-semibold max-sm:whitespace-normal max-sm:break-words">{item.name}</p>
                              <div className="mt-0.5 truncate text-sm text-ws-faint max-sm:whitespace-normal max-sm:break-words">{renderMeta(item)}</div>
                            </div>
                            {itemActions(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </Panel>

      {/* -------------------------------------------------- add / edit panel --- */}
      <Panel className="lg:sticky lg:top-5">
        <header className="mb-1">
          <h2 className="text-base font-semibold tracking-tight">
            {editingId === null ? `Add ${entryLabel}` : `Edit ${entryLabel}`}
          </h2>
          <p className="mt-1 text-sm text-ws-faint">
            {editingId === null
              ? ADD_HINT[singular] ?? `Define how ${singular} entries are grouped.`
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
          {editingId === null ? (
            <PillTabs
              tabs={["Parent category", "Subcategory"]}
              value={entryLevel}
              onChange={(level) => {
                setEntryLevel(level);
                set("parentId", level === "Parent category" ? "" : parents[0]?.id ?? "");
              }}
              className="rounded-lg bg-ws-card-hover p-1"
            />
          ) : null}
          {entryLevel === "Subcategory" ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`parent-${singular.replaceAll(" ", "-")}`} className="text-sm font-medium text-ws-muted">Parent category</label>
              <Select
                id={`parent-${singular.replaceAll(" ", "-")}`}
                value={form.parentId ?? ""}
                onChange={(value) => set("parentId", value)}
                options={[
                  { value: "", label: "Choose a parent category" },
                  ...parents.map((parent) => ({ value: parent.id, label: parent.name })),
                ]}
                className="w-full"
              />
              {parents.length === 0 ? <p className="text-sm text-ws-muted">Add a parent category first.</p> : null}
            </div>
          ) : null}
          {fields.map((field) => (
            <label
              key={field.name}
              className="flex flex-col gap-1.5 text-sm font-medium text-ws-muted"
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
                <Select
                  value={form[field.name] ?? ""}
                  onChange={(value) => set(field.name, value)}
                  options={field.options ?? []}
                  className="w-full"
                />
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
                  ? `Add ${entryLabel}`
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

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title={`Delete ${deleteTarget?.parentId ? "subcategory" : "parent category"}?`}
        description="This entry will be permanently removed from the list. This cannot be undone."
      >
        <div className="my-5 flex items-center gap-3 rounded-lg border border-ws-line bg-ws-card px-4 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ws-muted">{humanizeEnum(singular)}</p>
            <p className="mt-0.5 text-base font-semibold break-words text-ws-fg">
              {deleteTarget?.name}
            </p>
          </div>
        </div>

        {deleteError ? (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-base leading-6 text-destructive"
          >
            <CircleAlert aria-hidden="true" className="mt-1 size-4 shrink-0" />
            <p>{deleteError}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2 border-t border-ws-line pt-4">
          <Button
            variant="outline"
            disabled={isDeleting}
            onClick={() => {
              setDeleteTarget(null);
              setDeleteError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void remove()}
          >
            {isDeleting ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Trash2 aria-hidden="true" className="size-4" />
            )}
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
