import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Verification — TalentPulse",
};

export default function VerificationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Compliance"
        title="Verification"
        subtitle="Track document and identity verification across your client entities."
      />
      <ComingSoon
        icon={BadgeCheck}
        title="Verification center coming soon"
        description="A single place to review document status, identity checks, and compliance flags for every company in your directory."
      />
    </>
  );
}