"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CompanyResponse } from "@/contracts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SectionLabel } from "@/components/shared/ApiCards";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/shared/FormFields";
import {
  companySchema,
  type CompanyFormValues,
} from "@/lib/validation/recruiter.schema";
import { useGetPublicIndustriesQuery } from "@/services/publicApi";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/services/recruiterApi";

const NO_INDUSTRY = "none";

function toFormValues(company?: CompanyResponse): CompanyFormValues {
  return {
    name: company?.name ?? "",
    industryId: company?.industryId ? String(company.industryId) : NO_INDUSTRY,
    description: company?.description ?? "",
    websiteUrl: company?.websiteUrl ?? "",
    address: company?.address ?? "",
    contactEmail: company?.contactEmail ?? "",
    contactPhone: company?.contactPhone ?? "",
    logoUrl: company?.logoUrl ?? "",
    businessRegistrationNo: company?.businessRegistrationNo ?? "",
  };
}

export function CompanyForm({
  company,
  onDone,
}: {
  company?: CompanyResponse;
  onDone?: () => void;
}) {
  const industries = useGetPublicIndustriesQuery();
  const [createCompany, creation] = useCreateCompanyMutation();
  const [updateCompany, update] = useUpdateCompanyMutation();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    values: toFormValues(company),
  });

  const isSaving = creation.isLoading || update.isLoading;

  const onSubmit = async (values: CompanyFormValues) => {
    const body = {
      name: values.name,
      industryId:
        values.industryId === NO_INDUSTRY ? undefined : Number(values.industryId),
      description: values.description || undefined,
      websiteUrl: values.websiteUrl || undefined,
      address: values.address || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      logoUrl: values.logoUrl || undefined,
      businessRegistrationNo: values.businessRegistrationNo || undefined,
    };

    try {
      if (company) {
        await updateCompany({ id: company.id, body }).unwrap();
        toast.success("Company updated.");
      } else {
        await createCompany(body).unwrap();
        toast.success("Company created.");
      }
      onDone?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          company
            ? "Unable to update the company."
            : "Unable to create the company.",
        ),
      );
    }
  };

  const industryOptions = [
    { value: NO_INDUSTRY, label: "Not specified" },
    ...(industries.data ?? []).map((industry) => ({
      value: String(industry.id),
      label: industry.name,
    })),
  ];

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <section>
          <SectionLabel>Company identity</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="name"
              label="Legal name"
              placeholder="ISTAD Store"
            />
            <SelectField
              control={form.control}
              name="industryId"
              label="Industry"
              options={industryOptions}
            />
          </div>
          <div className="mt-5">
            <TextAreaField
              control={form.control}
              name="description"
              label="Public description"
              placeholder="What your company does."
            />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="businessRegistrationNo"
              label="Business registration number"
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company logo</FormLabel>
                  <FormControl>
                    <FileDropzone
                      value={field.value}
                      onChange={field.onChange}
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      hint="PNG, JPG, WebP or SVG up to 5 MB."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section>
          <SectionLabel>Contact information</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              control={form.control}
              name="contactEmail"
              label="Email address"
              type="email"
              placeholder="hello@company.com"
            />
            <TextField
              control={form.control}
              name="contactPhone"
              label="Phone number"
            />
            <TextField
              control={form.control}
              name="websiteUrl"
              label="Website"
              placeholder="https://…"
            />
            <TextField control={form.control} name="address" label="Address" />
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          {onDone ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg px-6"
              onClick={onDone}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            className="h-11 rounded-lg px-8"
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : company ? "Save changes" : "Create company"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
