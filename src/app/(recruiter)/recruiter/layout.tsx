import {
  recruiterLinks,
  RoleShell,
} from "@/components/layout/RoleShell";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleShell role="recruiter" title="Recruiter" links={recruiterLinks}>
      {children}
    </RoleShell>
  );
}
