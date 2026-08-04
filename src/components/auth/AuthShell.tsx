import type { ReactNode } from "react";
import Link from "next/link";
import {
    BadgeCheck,
    BriefcaseBusiness,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type AuthShellProps = {
    title: string;
    description: string;
    children: ReactNode;
    className?: string;
};

export function AuthShell({
    title,
    description,
    children,
    className,
}: AuthShellProps) {
    return (
        <main className="relative overflow-hidden bg-brand-tint px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="pointer-events-none absolute -left-28 top-12 size-64 rounded-full border border-brand/20" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 size-80 rounded-full border border-warning/40" />

            <div
                className={cn(
                    "relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[32px] border border-border bg-surface shadow-[var(--shadow-dropdown)] lg:grid-cols-[minmax(0,.9fr)_minmax(430px,1.1fr)]",
                    className,
                )}
            >
                <section className="relative hidden min-h-[700px] overflow-hidden bg-[#eef8ed] p-10 dark:bg-[#17361a] lg:flex lg:flex-col lg:justify-between">
                    <Link
                        href="/"
                        className="relative z-10 text-2xl font-bold text-brand"
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

                    <div className="relative mx-auto flex aspect-square w-full max-w-[430px] items-center justify-center">
                        <div className="absolute inset-[4%] rounded-full border border-brand/30" />
                        <div className="absolute inset-[18%] rounded-full border-2 border-dashed border-warning" />
                        <div className="relative z-10 w-[230px] rounded-[28px] border border-brand/20 bg-surface p-6 shadow-[var(--shadow-dropdown)]">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-white">
                                <ShieldCheck
                                    aria-hidden="true"
                                    className="size-8"
                                />
                            </div>
                            <p className="mt-5 text-center text-lg font-semibold text-heading">
                                Your career starts here
                            </p>
                            <div className="mt-5 space-y-3">
                                <div className="h-10 rounded-xl bg-brand-tint" />
                                <div className="h-10 rounded-xl bg-brand-tint" />
                                <div className="mx-auto h-11 w-32 rounded-full bg-warning" />
                            </div>
                        </div>

                        {[
                            {
                                Icon: UserRound,
                                className: "left-[2%] top-[23%] bg-brand",
                            },
                            {
                                Icon: Search,
                                className: "right-[3%] top-[20%] bg-warning",
                            },
                            {
                                Icon: BriefcaseBusiness,
                                className: "bottom-[13%] left-[10%] bg-warning",
                            },
                            {
                                Icon: BadgeCheck,
                                className: "bottom-[8%] right-[12%] bg-brand",
                            },
                        ].map(({ Icon, className }, index) => (
                            <span
                                key={index}
                                className={cn(
                                    "absolute flex size-14 items-center justify-center rounded-full border-4 border-[#eef8ed] text-white shadow-[var(--shadow-card)] dark:border-[#17361a]",
                                    className,
                                )}
                            >
                                <Icon aria-hidden="true" className="size-6" />
                            </span>
                        ))}
                    </div>

                    <div className="relative z-10">
                        <p className="flex items-center gap-2 text-sm font-semibold text-brand">
                            <Sparkles aria-hidden="true" className="size-4" />
                            AI Career Platform
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-body">
                            Secure access to public opportunities, personalized
                            career tools, and recruiter workflows.
                        </p>
                    </div>
                </section>

                <section className="flex items-center p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto w-full max-w-[520px]">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold uppercase tracking-[.12em] text-brand">
                            <ShieldCheck
                                aria-hidden="true"
                                className="size-4"
                            />
                            Secure access
                        </span>
                        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-heading">
                            {title}
                        </h1>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-body sm:text-base">
                            {description}
                        </p>
                        <div className="mt-8">{children}</div>
                    </div>
                </section>
            </div>
        </main>
    );
}
