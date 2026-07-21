import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Career Platform",
  description:
    "Public jobs, job seeker workspace, and recruiter hiring tools for the AI Career Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            classNames: {
              success: "!bg-brand !text-white !border-brand",
            },
          }}
        />
      </body>
    </html>
  );
}
