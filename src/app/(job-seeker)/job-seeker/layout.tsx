import { jobSeekerLinks, WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell role="job-seeker" title="Job seeker" links={jobSeekerLinks}>
      {children}
    </WorkspaceShell>
  );
}
