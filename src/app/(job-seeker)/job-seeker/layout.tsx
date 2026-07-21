import {
  jobSeekerLinks,
  RoleShell,
} from "@/components/layout/RoleShell";

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleShell role="job-seeker" title="Job seeker" links={jobSeekerLinks}>
      {children}
    </RoleShell>
  );
}
