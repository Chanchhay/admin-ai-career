import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/redux/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentPulse — AI Recruitment Engine",
  description:
    "Enterprise recruitment workspace for talent leads and executive headhunters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-canvas">
        <StoreProvider>
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
        </StoreProvider>
      </body>
    </html>
  );
}
