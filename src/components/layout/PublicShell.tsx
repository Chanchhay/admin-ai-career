"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Camera, Globe2, Mail, MapPin, Menu, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarAccount } from "@/components/auth/NavbarAccount";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNavigationOpen } from "@/store/uiSlice";

const landingNavigation = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Find Job" },
    { href: "/recruiter/jobs/new", label: "Post Job" },
    { href: "/about-us", label: "About Us" },
];

export function PublicShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const mobileNavigationOpen = useAppSelector(
        (state) => state.ui.mobileNavigationOpen,
    );

    return (
        <div className="min-h-screen overflow-x-hidden bg-surface text-heading">
            <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-xl">
                <div className="mx-auto flex h-[78px] max-w-[1408px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight text-brand outline-none focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/30"
                        aria-label="AI Career home"
                    >
                        <Image
                            src="/figma/brand-logo.png"
                            alt="AI Career"
                            width={250}
                            height={135}
                            loading="eager"
                            unoptimized
                            className="h-auto w-[230px] object-contain object-left"
                        />
                    </Link>

                    <nav
                        aria-label="Public navigation"
                        className="hidden items-center gap-12 lg:flex"
                    >
                        {landingNavigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={
                                    pathname === link.href ? "page" : undefined
                                }
                                className={cn(
                                    "text-[20px] font-normal text-heading transition-colors hover:text-brand",
                                    pathname === link.href && "text-brand",
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <ThemeToggle />
                        <NavbarAccount />
                    </div>

                    <Sheet
                        open={mobileNavigationOpen}
                        onOpenChange={(open) =>
                            dispatch(setMobileNavigationOpen(open))
                        }
                    >
                        <div className="flex items-center gap-1 lg:hidden">
                            <ThemeToggle />
                            <SheetTrigger
                                render={<Button variant="ghost" size="icon" />}
                            >
                                <Menu aria-hidden="true" />
                                <span className="sr-only">Open navigation</span>
                            </SheetTrigger>
                        </div>
                        <SheetContent
                            side="right"
                            className="w-[min(22rem,calc(100vw-2rem))]"
                        >
                            <SheetHeader>
                                <SheetTitle>Navigation</SheetTitle>
                            </SheetHeader>
                            <nav
                                aria-label="Mobile public navigation"
                                className="grid gap-1 px-4"
                            >
                                {landingNavigation.map((link) => (
                                    <SheetClose
                                        key={link.href}
                                        render={<Link href={link.href} />}
                                    >
                                        <span
                                            className={cn(
                                                "block rounded-md px-3 py-2 text-sm font-medium text-body hover:bg-surface-muted hover:text-heading",
                                                pathname === link.href &&
                                                    "bg-surface-muted text-brand",
                                            )}
                                        >
                                            {link.label}
                                        </span>
                                    </SheetClose>
                                ))}
                                <NavbarAccount
                                    mobile
                                    onNavigate={() =>
                                        dispatch(setMobileNavigationOpen(false))
                                    }
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
            {children}
        </div>
    );
}

export function PublicFooter() {
    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_.7fr_1fr] lg:px-8">
                <div>
                    <Link href="/" className="block w-fit">
                        <Image
                            src="/figma/brand-logo.png"
                            alt="AI Career"
                            width={250}
                            height={135}
                            loading="eager"
                            unoptimized
                            className="h-auto w-[230px] object-contain object-left"
                        />
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-6 text-body">
                        Empowering learners through innovative education and
                        technology. Providing the latest methodology with
                        high-quality training and mentoring.
                    </p>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Follow us
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm text-body">
                        <li className="flex items-center gap-2">
                            <Phone className="size-4 text-brand" />
                            Customer Service: +855-81697501
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="size-4 text-brand" />
                            Working Hours: 08:30 - 18:00
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                            No. 24, Street 562, Sangkat Kak I, Khan Toul Kork,
                            Phnom Penh.
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Explore
                    </h2>
                    <nav
                        className="mt-4 grid gap-3 text-sm text-body"
                        aria-label="Footer navigation"
                    >
                        {landingNavigation.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="w-fit hover:text-brand"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="text-base font-semibold text-brand">
                        Sponsor and organize
                    </h2>
                    {/* The white wordmark disappears on the light surface, so each theme
              gets its own file rather than a filter. */}
                    <div className="relative mt-4 h-24 w-52">
                        <Image
                            src="/landing-assets/istad-logo-color.png"
                            alt="ISTAD"
                            fill
                            sizes="208px"
                            loading="eager"
                            unoptimized
                            className="object-contain object-left dark:hidden"
                        />
                        <Image
                            src="/landing-assets/istad-logo.png"
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="208px"
                            loading="eager"
                            unoptimized
                            className="hidden object-contain object-left dark:block"
                        />
                    </div>
                    <div className="mt-5 flex gap-2">
                        {[Camera, Globe2, Video].map((Icon, index) => (
                            <span
                                key={index}
                                aria-label={
                                    ["Instagram", "Website", "YouTube"][index]
                                }
                                role="img"
                                className="flex size-9 items-center justify-center rounded-full border border-border text-brand"
                            >
                                <Icon className="size-4" />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-t border-border px-4 py-4 text-center text-xs text-body">
                © 2026 ការងារ | Sponsored and organized by ISTAD
            </div>
        </footer>
    );
}
