import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CompanyForm } from "@/components/company/CompanyForm";

export const metadata: Metadata = {
  title: "Add New Company — TalentPulse",
};

export default function AddCompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enterprise Directory"
        title="Add New Company"
        subtitle="Initialize a new client entity in your recruitment pipeline with verified documentation and compliance checks."
      />
      <CompanyForm />
    </>
  );
}
