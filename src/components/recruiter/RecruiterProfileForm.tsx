"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/shared/FormFields";
import {
  recruiterProfileSchema,
  type RecruiterProfileFormValues,
} from "@/lib/validation/recruiter.schema";
import { useUpdateRecruiterProfileMutation } from "@/services/recruiterApi";

const defaultValues: RecruiterProfileFormValues = {
  position: "",
  linkedinUrl: "",
};

export function RecruiterProfileForm() {
  const [updateRecruiterProfile, update] = useUpdateRecruiterProfileMutation();
  const form = useForm<RecruiterProfileFormValues>({
    resolver: zodResolver(recruiterProfileSchema),
    defaultValues,
  });

  const onSubmit = async (values: RecruiterProfileFormValues) => {
    try {
      await updateRecruiterProfile({
        position: values.position || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
      }).unwrap();
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update the profile."));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            control={form.control}
            name="position"
            label="Position"
            placeholder="Head of Talent"
          />
          <TextField
            control={form.control}
            name="linkedinUrl"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-lg px-8"
            disabled={update.isLoading}
          >
            {update.isLoading ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
