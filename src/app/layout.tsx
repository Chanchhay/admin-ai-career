import type { Metadata } from "next";
import { asset } from "@/lib/base-path";
import { AdminShell } from "@/components/layout/AdminShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { inter, notoSansKhmer } from "./fonts";
import "./globals.css";

/*
 * Icon paths go through `asset()` for the same reason the brand images do:
 * Next does not apply the base path to metadata icons, so a bare
 * `/images/**` href is served by the gateway from the seeker app and 404s.
 */
export const metadata: Metadata = {
  title: "AI Career Admin",
  description:
    "Company verification, candidate review, and reference data for the AI Career Platform.",
  icons: {
    icon: asset("/images/brand/favicon-64.png"),
    shortcut: asset("/images/brand/favicon-64.png"),
    apple: asset("/images/brand/apple-icon-180.png"),
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
    <html
      lang="en"
      className={`${inter.variable} ${notoSansKhmer.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-canvas" suppressHydrationWarning>
        <ThemeProvider>
          <LocaleProvider>
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
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
