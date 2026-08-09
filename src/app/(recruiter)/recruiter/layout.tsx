import {
  recruiterLinks,
  WorkspaceShell,
} from "@/components/layout/WorkspaceShell";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell role="recruiter" title="Recruiter" links={recruiterLinks}>
      {children}
    </WorkspaceShell>
  );
}
