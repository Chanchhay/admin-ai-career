import type { Metadata } from "next";
import { AdminShell } from "@/components/layout/AdminShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Career Admin",
  description:
    "Company verification, candidate review, and reference data for the AI Career Platform.",
  icons: {
    icon: "/figma/brand-logo.png",
    shortcut: "/figma/brand-logo.png",
    apple: "/figma/brand-logo.png",
  },
};

/**
 * Every route in this app is a console screen, so the shell is mounted here
 * rather than by a per-section layout — error and not-found pages included.
 *
 * There is no signed-out branch: the gateway requires a session for /admin/**
 * before a request ever reaches Next.js.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-canvas" suppressHydrationWarning>
        <ThemeProvider>
          <StoreProvider>
            <AdminShell>{children}</AdminShell>
            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                classNames: {
                  success: "!bg-brand !text-white !border-brand",
                },
              }}
            />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
