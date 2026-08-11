import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Career Platform",
    description:
        "Public jobs, job seeker workspace, and recruiter hiring tools for the AI Career Platform.",
    icons: {
        icon: "/figma/brand-logo.png",
        shortcut: "/figma/brand-logo.png",
        apple: "/figma/brand-logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-canvas" suppressHydrationWarning>
                <ThemeProvider>
                    <StoreProvider>
                        {children}
                        <Toaster
                            richColors
                            position="top-right"
                            toastOptions={{
                                classNames: {
                                    success:
                                        "!bg-brand !text-white !border-brand",
                                },
                            }}
                        />
                    </StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
