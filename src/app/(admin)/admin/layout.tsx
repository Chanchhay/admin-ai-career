import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { adminNavigation } from "@/lib/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell role="admin" title="Admin" links={adminNavigation}>
      {children}
    </WorkspaceShell>
  );
}
