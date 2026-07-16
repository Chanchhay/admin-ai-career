import type { Metadata } from "next";
import { Kanban } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "ATS Board — TalentPulse",
};

export default function AtsBoardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="ATS Board"
        subtitle="Move candidates through every stage of your hiring process."
      />
      <ComingSoon
        icon={Kanban}
        title="Drag-and-drop pipeline coming soon"
        description="A visual board to move candidates from applied to hired, with stage-by-stage tracking and quick actions."
      />
    </>
  );
}