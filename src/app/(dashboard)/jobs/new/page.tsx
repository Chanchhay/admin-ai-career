import { JobForm } from "@/components/jobs/JobForm";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Post New Job — TalentPulse",
};

export default function PostJobPage() {
  return <JobForm />;
}