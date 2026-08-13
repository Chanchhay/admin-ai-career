import { adminLinks, WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell role="admin" title="Admin" links={adminLinks}>
      {children}
    </WorkspaceShell>
  );
}
