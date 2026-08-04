"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { Plus } from "lucide-react";
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
import { SelectField } from "@/components/shared/FormFields";
import {
  companyDocumentSchema,
  type CompanyDocumentFormValues,
} from "@/lib/validation/recruiter.schema";
import { useAddCompanyDocumentMutation } from "@/services/recruiterApi";

/** `documentType` is a free string in the API; these are the common ones. */
const documentTypeOptions = [
  { value: "BUSINESS_LICENSE", label: "Business license" },
  { value: "TAX_CERTIFICATE", label: "Tax certificate" },
  { value: "COMPANY_REGISTRATION", label: "Company registration" },
  { value: "OWNER_ID", label: "Owner identification" },
  { value: "OTHER", label: "Other" },
];

const defaultValues: CompanyDocumentFormValues = {
  documentType: documentTypeOptions[0].value,
  documentUrl: "",
};

export function CompanyDocumentForm({ companyId }: { companyId: number }) {
  const [addCompanyDocument, addition] = useAddCompanyDocumentMutation();
  const form = useForm<CompanyDocumentFormValues>({
    resolver: zodResolver(companyDocumentSchema),
    defaultValues,
  });

  const onSubmit = async (values: CompanyDocumentFormValues) => {
    try {
      await addCompanyDocument({ companyId, body: values }).unwrap();
      toast.success("Document added.");
      form.reset(defaultValues);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to add the document."));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <SelectField
          control={form.control}
          name="documentType"
          label="Document type"
          options={documentTypeOptions}
        />

        <FormField
          control={form.control}
          name="documentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document file</FormLabel>
              <FormControl>
                <FileDropzone value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-lg px-6"
            disabled={addition.isLoading}
          >
            <Plus aria-hidden="true" className="size-4" />
            {addition.isLoading ? "Adding…" : "Add document"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
