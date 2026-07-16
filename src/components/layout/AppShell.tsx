import type { ReactNode } from "react";
import { AppFooter } from "./AppFooter";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-360 gap-2 p-3 lg:p-4">
      <Sidebar className="hidden w-60 shrink-0 lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-5 shadow-sm lg:p-8">
        <Topbar />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}