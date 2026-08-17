"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelHeader } from "@/components/workspace/primitives";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

/**
 * Industries, job categories and skills are the same resource in three
 * flavours: a flat list, a name, a second free-text field, no paging. This
 * screen is that shape once, configured by the field list a caller passes.
 *
 * The editor is inline rather than a modal — the list is short, and keeping the
 * row visible while editing it is what makes a rename obviously safe.
 */

export type TaxonomyField<TForm> = {
  name: keyof TForm & string;
  label: string;
  kind?: "text" | "textarea" | "select";
  /** Required for `kind: "select"`; ignored otherwise. */
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type TaxonomyItem = { id: number; name: string };

export function TaxonomyScreen<
  TItem extends TaxonomyItem,
  TForm extends Record<string, string>,
>({
  title,
  description,
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
}: {
  title: string;
  description: string;
  items: TItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  fields: readonly TaxonomyField<TForm>[];
  emptyForm: TForm;
  toForm: (item: TItem) => TForm;
  /** Secondary line under the name — type, status, whatever the row carries. */
  renderMeta: (item: TItem) => ReactNode;
  onCreate: (form: TForm) => Promise<unknown>;
  onUpdate: (id: number, form: TForm) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  isSaving: boolean;
}) {
  // `null` = closed, `"new"` = the create form, a number = that row's editor.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing("new");
  };

  const openEdit = (item: TItem) => {
    setForm(toForm(item));
    setEditing(item.id);
  };

  const close = () => setEditing(null);

  const submit = async () => {
    const missing = fields.find(
      (field) => field.required && !form[field.name]?.trim(),
    );
    if (missing) {
      toast.error(`${missing.label} is required.`);
      return;
    }

    try {
      if (editing === "new") {
        await onCreate(form);
        toast.success(`${title} entry created.`);
      } else if (typeof editing === "number") {
        await onUpdate(editing, form);
        toast.success("Changes saved.");
      }
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to save this entry."));
    }
  };

  const remove = async (item: TItem) => {
    // Deleting reference data breaks any company or job still pointing at it,
    // so this asks before firing rather than offering an undo it cannot honour.
    const confirmed = window.confirm(
      `Delete "${item.name}"? Anything still referencing it will lose the link.`,
    );
    if (!confirmed) return;

    try {
      await onDelete(item.id);
      toast.success(`"${item.name}" deleted.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete this entry."));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Panel tone="soft">
        <p className="text-sm leading-6">{description}</p>
      </Panel>

      <Panel>
        <PanelHeader
          title={`${items?.length ?? 0} ${title.toLowerCase()}`}
          action={
            editing === "new" ? null : (
              <Button size="sm" onClick={openCreate}>
                <Plus aria-hidden="true" className="size-4" />
                Add
              </Button>
            )
          }
        />

        {editing === "new" ? (
          <TaxonomyForm
            fields={fields}
            form={form}
            onChange={setForm}
            onSubmit={submit}
            onCancel={close}
            isSaving={isSaving}
            submitLabel="Create"
            className="mb-4"
          />
        ) : null}

        {isLoading ? (
          <LoadingState rows={5} />
        ) : isError ? (
          <ErrorState
            message={`Unable to load ${title.toLowerCase()}.`}
            onRetry={refetch}
          />
        ) : (items?.length ?? 0) === 0 ? (
          <p className="rounded-[22px] bg-ws-card-hover px-5 py-8 text-center text-sm text-ws-faint">
            Nothing here yet. Add the first entry.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items?.map((item) =>
              editing === item.id ? (
                <li key={item.id}>
                  <TaxonomyForm
                    fields={fields}
                    form={form}
                    onChange={setForm}
                    onSubmit={submit}
                    onCancel={close}
                    isSaving={isSaving}
                    submitLabel="Save"
                  />
                </li>
              ) : (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-[18px] bg-ws-card-hover px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ws-fg">
                      {item.name}
                    </p>
                    <div className="mt-0.5 text-xs text-ws-faint">
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
              ),
            )}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function TaxonomyForm<TForm extends Record<string, string>>({
  fields,
  form,
  onChange,
  onSubmit,
  onCancel,
  isSaving,
  submitLabel,
  className,
}: {
  fields: readonly TaxonomyField<TForm>[];
  form: TForm;
  onChange: (form: TForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSaving: boolean;
  submitLabel: string;
  className?: string;
}) {
  const set = (name: string, value: string) =>
    onChange({ ...form, [name]: value });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn("rounded-[22px] bg-ws-card-hover p-4", className)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className={cn(
              "flex flex-col gap-1.5 text-xs font-medium text-ws-muted",
              field.kind === "textarea" && "sm:col-span-2",
            )}
          >
            {field.label}
            {field.kind === "textarea" ? (
              <Textarea
                value={form[field.name] ?? ""}
                onChange={(event) => set(field.name, event.target.value)}
                placeholder={field.placeholder}
                className="min-h-20"
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
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X aria-hidden="true" className="size-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
