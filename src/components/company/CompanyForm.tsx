"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Link2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SectionCard } from "@/components/layout/SectionCard";
import { FieldWrapper } from "@/components/shared/FieldWrapper";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_SIZE_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants";
import { toApiError } from "@/lib/api-error";
import {
  companyFormDefaults,
  companySchema,
  type CompanyFormValues,
} from "@/lib/schemas/company.schema";
import { useCreateCompanyMutation } from "@/redux/api/companyApi";
import { GlobalConnectivityCard } from "./GlobalConnectivityCard";
import { PortfolioQualityCard } from "./PortfolioQualityCard";
import { RequiredDocsCard } from "./RequiredDocsCard";
import { VerificationPanel } from "./VerificationPanel";

const FORM_ID = "company-form";

const FIELD_NAMES: readonly (keyof CompanyFormValues)[] = [
  "name",
  "websiteUrl",
  "industry",
  "size",
  "logo",
  "selfVerified",
];

function isFormField(field: string): field is keyof CompanyFormValues {
  return (FIELD_NAMES as readonly string[]).includes(field);
}

export function CompanyForm() {
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    mode: "onBlur",
    defaultValues: companyFormDefaults as CompanyFormValues,
  });

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      const company = await createCompany({
        name: values.name,
        websiteUrl: values.websiteUrl,
        industry: values.industry,
        size: values.size,
        selfVerified: values.selfVerified,
        logo: values.logo ?? null,
      }).unwrap();
      toast.success(`${company.name} added to your directory.`);
      form.reset(companyFormDefaults as CompanyFormValues);
    } catch (error) {
      const apiError = toApiError(error);
      if (apiError.field && isFormField(apiError.field)) {
        form.setError(apiError.field, { message: apiError.message });
        return;
      }
      toast.error(apiError.message);
    }
  };

  const handleDiscard = () => {
    form.reset(companyFormDefaults as CompanyFormValues);
    toast("Draft discarded.");
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            disabled={isLoading}
            className="h-10"
          >
            Discard Draft
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isLoading}
            className="h-10 bg-brand font-semibold text-white hover:bg-brand-hover"
          >
            {isLoading ? (
              <>
                <Loader2
                  aria-hidden="true"
                  className="mr-2 size-4 animate-spin"
                />
                Adding...
              </>
            ) : (
              "Add Company"
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <form
              id={FORM_ID}
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              <SectionCard
                title="General Information"
                icon={<Info aria-hidden="true" className="size-4 text-brand" />}
                bodyClassName="p-5 sm:p-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FieldWrapper label="Company Name">
                        <Input
                          {...field}
                          placeholder="e.g. Nebula Systems"
                          aria-invalid={fieldState.invalid}
                          className="field-input"
                        />
                      </FieldWrapper>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field, fieldState }) => (
                      <FieldWrapper label="Website URL">
                        <div className="relative">
                          <Link2
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                          />
                          <Input
                            {...field}
                            placeholder="https:// nebula.io"
                            aria-invalid={fieldState.invalid}
                            className="field-input pl-9"
                          />
                        </div>
                      </FieldWrapper>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field, fieldState }) => (
                      <FieldWrapper label="Industry">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            aria-invalid={fieldState.invalid}
                            className="field-input w-full"
                          >
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldWrapper>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field, fieldState }) => (
                      <FieldWrapper label="Company Size">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            aria-invalid={fieldState.invalid}
                            className="field-input w-full"
                          >
                            <SelectValue placeholder="Select headcount" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPANY_SIZE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldWrapper>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field, fieldState }) => (
                      <FieldWrapper
                        label="Company Logo"
                        className="sm:col-span-2"
                      >
                        <FileDropzone
                          value={field.value ?? null}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                        />
                      </FieldWrapper>
                    )}
                  />
                </div>
              </SectionCard>

              <FormField
                control={form.control}
                name="selfVerified"
                render={({ field }) => (
                  <VerificationPanel
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </form>
          </div>

          <aside className="space-y-6">
            <PortfolioQualityCard />
            <RequiredDocsCard />
            <GlobalConnectivityCard />
          </aside>
        </div>
      </div>
    </Form>
  );
}
