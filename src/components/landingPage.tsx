"use client";
import React, { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

// Helper Icons
const UsersIcon = () => (
    <svg
        className="h-4 w-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg
        className="h-5 w-5 text-slate-600 dark:text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
        />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        className="h-5 w-5 text-slate-600 dark:text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="h-5 w-5 text-[#008A1E]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
    </svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="h-6 w-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
    </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="h-5 w-5 text-[#008A1E]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
        />
    </svg>
);

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

export default function LandingPage() {
    const tabs = ["All", "Development", "Design", "Marketing", "Accounting"];
    const [activeTab, setActiveTab] = useState("All");

    const jobs = [
        { id: 1, title: "Full Stack Developer", company: "ABA Bank" },
        { id: 2, title: "UI/UX Designer", company: "Cellcard" },
        { id: 3, title: "Project Manager", company: "ACLEDA Bank" },
        { id: 4, title: "Data Analyst", company: "Wing Bank" },
        { id: 5, title: "Web Designer", company: "Metfone" },
        { id: 6, title: "Accounting Officer", company: "Amret" },
    ];

    const jobCategoriesRow1 = [
        "Project Manager",
        "Data Entry",
        "Customer Service",
        "Web Design",
        "Bookkeeping",
        "App Development",
    ];
    const jobCategoriesRow2 = [
        "Communication",
        "Analyst",
        "Graphic Design",
        "Education",
        "Sales",
        "Virtual Assistant",
    ];
    const jobCategoriesRow3 = [
        "Developer",
        "UI/UX Design",
        "Marketing",
        "Call Center",
        "Accounting",
    ];

    const avatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    ];

    const companies = [
        {
            name: "ACLEDA",
            location: "PhnomPenh",
            featured: true,
            bg: "bg-[#002B49]",
            text: "text-amber-400",
            logoText: "ACLEDA",
        },
        {
            name: "SiemReap Hotel",
            location: "Siem Reap",
            featured: false,
            bg: "bg-amber-600",
            text: "text-white",
            logoText: "HOTEL",
        },
        {
            name: "ABA",
            location: "PhnomPenh",
            featured: false,
            highlighted: true,
            bg: "bg-[#003B5C]",
            text: "text-white",
            logoText: "ABA",
        },
        {
            name: "Amret",
            location: "Banteaymeanchey",
            featured: false,
            bg: "bg-[#006837]",
            text: "text-white",
            logoText: "Amret",
        },
        {
            name: "Wing",
            location: "Kompot",
            featured: true,
            bg: "bg-[#8CC63F]",
            text: "text-white",
            logoText: "Wing",
        },
        {
            name: "APD",
            location: "PhnomPenh",
            featured: false,
            bg: "bg-[#0B2545]",
            text: "text-white",
            logoText: "APD",
        },
        {
            name: "Cellcard",
            location: "Kompongsom",
            featured: false,
            bg: "bg-[#FF6B00]",
            text: "text-white",
            logoText: "cellcard",
        },
        {
            name: "Metfone",
            location: "Siemreap",
            featured: false,
            bg: "bg-[#ED1C24]",
            text: "text-white",
            logoText: "metfone",
        },
    ];

    return (
        <>
            <Navbar />
            <div className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
                {/* Decorative Wavy Lines */}
                <div className="pointer-events-none absolute left-0 top-32 hidden lg:block">
                    <svg
                        width="240"
                        height="200"
                        viewBox="0 0 240 200"
                        fill="none"
                    >
                        <path
                            d="M-40,20 C40,10 80,110 140,120 C200,130 180,180 220,180"
                            stroke="#4DD0E1"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
                <div className="pointer-events-none absolute right-0 top-16 hidden lg:block">
                    <svg
                        width="200"
                        height="240"
                        viewBox="0 0 200 240"
                        fill="none"
                    >
                        <path
                            d="M220,20 C140,10 160,110 200,160 C240,210 160,200 120,230"
                            stroke="#34D399"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <section className="text-center pt-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                            <span className="text-[#008A1E]">Explore new</span>{" "}
                            <span className="text-[#F3BE00]">
                                job vacancies
                            </span>
                            <br />
                            <span className="text-[#F3BE00]">
                                all over the world
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-slate-400 dark:text-slate-400 font-medium leading-relaxed">
                            Our platform features more than 1.2 million job
                            vacancies worldwide, connecting you with employers
                            who value your skills and experience.
                        </p>

                        {/* Testimonials */}
                        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
                            {[
                                "Superb job matching service",
                                "Found my perfect role fast",
                                "Helped me find work quickly",
                            ].map((quote) => (
                                <div
                                    key={quote}
                                    className="rounded-2xl bg-[#EEF6F0] px-6 py-3 dark:bg-slate-900 border border-transparent dark:border-slate-800"
                                >
                                    <div className="flex justify-center text-amber-400 text-sm mb-0.5">
                                        ★★★★★
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">
                                        “{quote}”
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Search Box Section */}
                    <section className="mt-8 flex flex-col items-center">
                        <div className="flex w-full max-w-2xl flex-col sm:flex-row items-center rounded-2xl bg-[#EEF6F0] p-1.5 dark:bg-slate-900 gap-2">
                            {/* Keyword Input */}
                            <div className="flex flex-1 items-center gap-3 px-4 py-2 w-full">
                                <SearchIcon className="h-5 w-5 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Company or industry"
                                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                                />
                            </div>

                            {/* Separator */}
                            <div className="hidden sm:block h-6 w-[1px] bg-slate-300 dark:bg-slate-700" />

                            {/* Radius Select */}
                            <div className="relative flex items-center px-3 py-2 shrink-0">
                                <select className="appearance-none bg-transparent pr-6 text-sm font-medium text-slate-700 outline-none dark:text-slate-200 cursor-pointer">
                                    <option>20 mi</option>
                                    <option>10 mi</option>
                                    <option>50 mi</option>
                                </select>
                                <ChevronDownIcon className="pointer-events-none absolute right-2 h-4 w-4 text-slate-500" />
                            </div>

                            {/* Submit Button */}
                            <button className="w-full sm:w-auto rounded-xl bg-[#00921A] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#007A16] shrink-0">
                                Search
                            </button>
                        </div>

                        {/* Filter Tags */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                            {[
                                "Remote",
                                "Work from home",
                                "Part-time",
                                "Design",
                            ].map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-xl bg-[#EEF6F0] px-4 py-2 text-xs font-semibold text-[#008A1E] dark:bg-slate-900 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 dark:hover:bg-slate-800 transition"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Top Companies Section */}
                    <section className="mt-20">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Top companies
                        </h2>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {companies.map((company) => (
                                <div
                                    key={company.name}
                                    className={`relative flex flex-col justify-between rounded-2xl border p-5 transition bg-white dark:bg-slate-900 ${
                                        company.highlighted
                                            ? "border-[#00921A] ring-1 ring-[#00921A]"
                                            : "border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-12 w-12 rounded-lg ${company.bg} ${company.text} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm`}
                                            >
                                                {company.logoText}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                                                    {company.name}
                                                </p>
                                                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                                                    <MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>
                                                        {company.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {company.featured && (
                                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-400 dark:bg-red-950/30 shrink-0">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className={`w-full rounded-xl py-3 text-xs font-bold transition ${
                                            company.highlighted
                                                ? "bg-[#00921A] text-white hover:bg-[#007A16]"
                                                : "bg-[#EBF3F9] text-[#008A1E] hover:bg-[#E0ECF5] dark:bg-slate-800 dark:text-emerald-400"
                                        }`}
                                    >
                                        Open Position
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <div className="w-full bg-white px-4 py-12 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl space-y-24">
                        {/* PROFILE / CANDIDATE WHEEL */}
                        <section className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="relative flex aspect-square w-full items-center justify-center rounded-3xl bg-[#EEF6F0] p-6 dark:bg-slate-900/60">
                                <div className="relative flex h-full w-full items-center justify-center">
                                    <div className="absolute h-52 w-52 rounded-full border-4 border-[#F3BE00] sm:h-64 sm:w-64" />
                                    <div className="absolute h-48 w-48 rounded-full border border-dashed border-emerald-300 sm:h-60 sm:w-60" />

                                    <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#00921A] shadow-md sm:h-24 sm:w-24">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-6 w-6 rounded-full bg-white opacity-90" />
                                            <div className="h-6 w-6 rounded-full bg-[#F3BE00]" />
                                        </div>
                                    </div>

                                    <div className="absolute -top-2 flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                ⚙
                                            </span>{" "}
                                            SKILLS
                                        </div>
                                        <div className="h-6 w-0.5 bg-emerald-500" />
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                    </div>

                                    <div className="absolute right-2 top-8 flex items-center gap-2 sm:right-6">
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            EXPERIENCE{" "}
                                            <span className="text-emerald-600">
                                                💼
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            PORTFOLIO{" "}
                                            <span className="text-emerald-600">
                                                📁
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-12 right-2 flex items-center gap-2 sm:right-6">
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            EDUCATION{" "}
                                            <span className="text-emerald-600">
                                                🎓
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-2 right-12 flex flex-col items-center">
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                        <div className="h-4 w-0.5 bg-emerald-500" />
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            PUBLICATIONS{" "}
                                            <span className="text-emerald-600">
                                                📄
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-2 left-1/3 flex flex-col items-center">
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                        <div className="h-4 w-0.5 bg-emerald-500" />
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                🎯
                                            </span>{" "}
                                            GOALS
                                        </div>
                                    </div>

                                    <div className="absolute bottom-12 left-2 flex items-center gap-2 sm:left-6">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                🏆
                                            </span>{" "}
                                            ACHIEVEMENTS
                                        </div>
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                    </div>

                                    <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                🌐
                                            </span>{" "}
                                            LANGUAGES
                                        </div>
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                    </div>

                                    <div className="absolute left-2 top-20 flex items-center gap-2 sm:left-6">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                🏛
                                            </span>{" "}
                                            PROJECTS
                                        </div>
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                    </div>

                                    <div className="absolute left-8 top-8 flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#008A1E] shadow-sm dark:bg-slate-800">
                                            <span className="text-emerald-600">
                                                💎
                                            </span>{" "}
                                            NETWORKING
                                        </div>
                                        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#00921A]" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start space-y-6">
                                <span className="rounded-full bg-[#EEF6F0] px-4 py-1 text-xs font-semibold text-[#008A1E] dark:bg-slate-800 dark:text-emerald-400">
                                    Profile
                                </span>

                                <h2 className="text-3xl font-extrabold leading-tight text-[#F3BE00] sm:text-4xl lg:text-5xl">
                                    Be the candidate employers are looking for
                                </h2>

                                <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                                    <p>
                                        Create a comprehensive profile and start
                                        receiving interview invites and job
                                        offers that align with your unique
                                        skills.
                                    </p>
                                    <p>
                                        Don’t miss out on your dream job—get
                                        started today and make your profile
                                        stand out.
                                    </p>
                                </div>

                                <button className="rounded-xl bg-[#00921A] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#007A16]">
                                    Create now
                                </button>
                            </div>
                        </section>

                        {/* TOP COMPANIES TRUSTED */}
                        <section className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="flex flex-col items-start space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-[#EEF6F0] px-4 py-1 text-xs font-semibold text-[#008A1E] dark:bg-slate-800 dark:text-emerald-400">
                                        Companies
                                    </span>
                                    <span className="text-xs font-bold text-[#F3BE00]">
                                        trusted by top companies
                                    </span>
                                </div>

                                <h2 className="text-3xl font-extrabold leading-tight text-[#F3BE00] sm:text-4xl lg:text-5xl">
                                    Get noticed by leading companies
                                </h2>

                                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                                    We collaborate with top organizations to
                                    bring you the best job opportunities,
                                    connecting you with leading employers who
                                    value your skills and expertise.
                                </p>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">
                                            Over 150,000 new job postings added
                                            every month
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">
                                            Access job listings from 1,200+
                                            leading companies
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 sm:text-sm">
                                            Receive personalized job alerts for
                                            100+ job categories.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#EEF6F0] p-8 dark:bg-slate-900/60">
                                <p className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-[#F3BE00]">
                                    TOP COMPANIES
                                </p>

                                <div className="grid grid-cols-3 gap-y-8 gap-x-4 items-center justify-items-center">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                                        <span className="text-lg text-[#95BF47]">
                                            🛍
                                        </span>
                                        <span className="text-sm sm:text-base font-extrabold">
                                            shopify
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                        <span className="text-xl font-black">
                                            Medium
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 font-extrabold text-slate-800 dark:text-white">
                                        <span className="text-emerald-500">
                                            #
                                        </span>
                                        <span className="text-sm sm:text-base">
                                            slack
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-white">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-black">
                                            P
                                        </span>
                                        <span className="text-sm font-semibold">
                                            Pinterest
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-[#F3BE00] font-black text-base sm:text-lg">
                                        <span>7</span>
                                        <span className="text-slate-800 dark:text-white">
                                            wise
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                                        <span>amazon</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
                                        <span className="text-emerald-500 text-lg">
                                            approx
                                        </span>
                                        <span className="text-sm font-bold">
                                            Spotify
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-white">
                                        <span className="text-sm font-bold">
                                            Walmart
                                        </span>
                                        <span className="text-[#F3BE00] font-bold text-xs">
                                            ☀️
                                        </span>
                                    </div>

                                    <div className="flex items-center font-bold text-[#F3BE00] text-sm sm:text-base">
                                        DocuSign
                                    </div>

                                    <div className="flex items-center gap-1.5 font-bold text-[#F3BE00]">
                                        <span className="font-extrabold">
                                            Framer
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 font-bold text-[#00A3FF]">
                                        <span className="text-sm font-extrabold">
                                            Webflow
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                        <span className="border border-current px-1 py-0.5 text-xs font-black rounded">
                                            N
                                        </span>
                                        <span className="text-sm font-bold">
                                            Notion
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="w-full bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
                    {/* POPULAR JOBS IN CAMBODIA */}
                    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <h2 className="mb-10 text-center text-3xl font-black text-[#F3BE00] sm:text-4xl">
                            Popular jobs in Cambodia
                        </h2>

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                                {jobCategoriesRow1.map((title) => (
                                    <button
                                        key={title}
                                        className="rounded-lg bg-[#008A1E] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#007018]"
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                                {jobCategoriesRow2.map((title) => (
                                    <button
                                        key={title}
                                        className="rounded-lg bg-[#008A1E] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#007018]"
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
                                {jobCategoriesRow3.map((title) => (
                                    <button
                                        key={title}
                                        className="rounded-lg bg-[#008A1E] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#007018]"
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* HOW FIND WORK */}
                    <section className="w-full bg-[#FFFBEA] py-16 dark:bg-slate-900/80">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h2 className="mb-14 text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                                How Find work
                            </h2>

                            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                                <div className="pointer-events-none absolute left-0 right-0 top-10 hidden lg:block">
                                    <svg
                                        className="w-full h-16"
                                        viewBox="0 0 1000 60"
                                        fill="none"
                                    >
                                        <path
                                            d="M 170 30 Q 280 0 380 30"
                                            stroke="#34D399"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            fill="none"
                                        />
                                        <path
                                            d="M 420 30 Q 530 60 630 30"
                                            stroke="#34D399"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            fill="none"
                                        />
                                        <path
                                            d="M 670 30 Q 780 0 880 30"
                                            stroke="#34D399"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            fill="none"
                                        />
                                    </svg>
                                </div>

                                <div className="relative flex flex-col items-center text-center p-4">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm dark:bg-slate-800">
                                        <UserPlusIcon />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Create account
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-400 max-w-[200px]">
                                        Aliquam facilisis egestas sapien, nec
                                        tempor leo tristique at.
                                    </p>
                                </div>

                                <div className="relative flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-slate-800">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#008A1E] shadow-md">
                                        <UploadIcon />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Upload CV/Resume
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-400 max-w-[200px]">
                                        Curabitur sit amet maximus ligula. Nam a
                                        nulla ante. Nam sodales.
                                    </p>
                                </div>

                                <div className="relative flex flex-col items-center text-center p-4">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm dark:bg-slate-800">
                                        <SearchIcon className="h-5 w-5 text-[#008A1E]" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Find suitable job
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-400 max-w-[200px]">
                                        Phasellus quis eleifend ex. Morbi nec
                                        fringilla nibh.
                                    </p>
                                </div>

                                <div className="relative flex flex-col items-center text-center p-4">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm dark:bg-slate-800">
                                        <CheckIcon />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Apply job
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-400 max-w-[200px]">
                                        Curabitur sit amet maximus ligula. Nam a
                                        nulla ante. Nam sodales purus.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* COUNTRIES FOR JOB SEEKERS */}
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mb-6 text-center lg:text-left">
                            <span className="text-2xl font-extrabold text-[#008A1E]">
                                Countries for Job Seekers
                            </span>
                        </div>

                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="flex flex-col items-start space-y-6">
                                <h2 className="text-3xl font-extrabold leading-tight text-[#008A1E] sm:text-4xl lg:text-5xl">
                                    So Many People Are{" "}
                                    <span className="text-[#F3BE00]">
                                        Engaged
                                    </span>{" "}
                                    All Over The World
                                </h2>

                                <p className="max-w-lg text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:text-sm">
                                    A Land Of Opportunity With A Diverse Job
                                    Market And A Wide Range Of Industries
                                    Offering Countless Career Paths.
                                </p>

                                <button className="mt-4 rounded-xl bg-[#F3BE00] px-8 py-3.5 text-xs font-extrabold text-[#008A1E] transition hover:bg-[#e2af00]">
                                    Post A Job
                                </button>
                            </div>

                            <div className="relative flex aspect-square w-full items-center justify-center">
                                <div className="absolute h-72 w-72 rounded-full border border-dashed border-[#F3BE00] sm:h-96 sm:w-96" />
                                <div className="absolute h-44 w-44 rounded-full border border-dashed border-[#F3BE00] sm:h-56 sm:w-56" />

                                <img
                                    src={avatars[0]}
                                    alt="User"
                                    className="absolute -top-1 h-10 w-10 rounded-full border-2 border-white object-cover shadow-md sm:h-12 sm:w-12"
                                />
                                <img
                                    src={avatars[1]}
                                    alt="User"
                                    className="absolute right-6 top-24 h-10 w-10 rounded-full border-2 border-white object-cover shadow-md sm:right-10 sm:h-12 sm:w-12"
                                />
                                <img
                                    src={avatars[2]}
                                    alt="User"
                                    className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-white object-cover shadow-md sm:h-12 sm:w-12"
                                />
                                <img
                                    src={avatars[3]}
                                    alt="User"
                                    className="absolute bottom-6 right-12 h-10 w-10 rounded-full border-2 border-white object-cover shadow-md sm:h-12 sm:w-12"
                                />
                                <img
                                    src={avatars[4]}
                                    alt="User"
                                    className="absolute bottom-6 left-12 h-10 w-10 rounded-full border-2 border-white object-cover shadow-md sm:h-12 sm:w-12"
                                />

                                <img
                                    src={avatars[5]}
                                    alt="User"
                                    className="absolute top-16 h-9 w-9 rounded-full border-2 border-white object-cover shadow-md"
                                />
                                <img
                                    src={avatars[6]}
                                    alt="User"
                                    className="absolute bottom-20 h-9 w-9 rounded-full border-2 border-white object-cover shadow-md"
                                />
                                <img
                                    src={avatars[7]}
                                    alt="User"
                                    className="absolute bottom-24 right-20 h-9 w-9 rounded-full border-2 border-white object-cover shadow-md"
                                />
                                <img
                                    src={avatars[1]}
                                    alt="User"
                                    className="absolute left-20 top-28 h-9 w-9 rounded-full border-2 border-white object-cover shadow-md"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* NEWEST JOBS FOR YOU */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-[#008A1E] sm:text-4xl">
                            Newest <span className="text-[#F3BE00]">Jobs</span>{" "}
                            For You
                        </h2>
                        <p className="mt-2 text-xs font-semibold text-[#008A1E] sm:text-sm">
                            Get The Fastest Application So That Your Name Is
                            Above Other Application
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mt-8 flex justify-center border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative pb-3 text-xs sm:text-sm font-semibold transition ${
                                        activeTab === tab
                                            ? "text-[#008A1E] dark:text-emerald-400"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#008A1E] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Job Cards Grid */}
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="relative overflow-hidden rounded-2xl bg-[#00921A] p-6 text-white shadow-md transition hover:shadow-lg flex flex-col justify-between h-56"
                            >
                                <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#007F16] opacity-60 blur-xl" />
                                <div className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-emerald-500/20" />

                                <div className="flex items-center gap-2">
                                    <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                        Fulltime
                                    </span>
                                    <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                        Onsite
                                    </span>
                                    <span className="rounded-lg border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                        $200K
                                    </span>
                                </div>

                                <div className="z-10 mt-4">
                                    <h3 className="text-xl font-bold tracking-tight text-white">
                                        {job.title}
                                    </h3>
                                    <p className="text-xs text-white/80 mt-1">
                                        {job.company}
                                    </p>
                                </div>

                                <div className="z-10 mt-6 flex items-center justify-between">
                                    <button className="rounded-lg bg-[#F3BE00] px-6 py-2 text-xs font-bold text-slate-900 transition hover:bg-[#e0af00]">
                                        Apply
                                    </button>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
                                        <UsersIcon />
                                        <span>24 Applied</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CLIENTS TESTIMONIAL */}
                <section className="mx-auto max-w-5xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
                    <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                        Clients Testimonial
                    </h2>

                    <div className="mt-6 flex justify-center items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#008A1E]/30" />
                        <span className="h-2 w-2 rounded-full bg-[#008A1E]/30" />
                        <span className="h-2 w-6 rounded-full bg-[#008A1E]" />
                        <span className="h-2 w-2 rounded-full bg-[#008A1E]/30" />
                        <span className="h-2 w-2 rounded-full bg-[#008A1E]/30" />
                    </div>

                    <div className="relative mt-12 flex items-center justify-between">
                        <button className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md transition hover:bg-slate-50 dark:hover:bg-slate-700">
                            <ChevronLeftIcon />
                        </button>

                        <div className="mx-auto flex flex-col items-center gap-8 lg:flex-row lg:gap-12 max-w-3xl">
                            <div className="relative shrink-0">
                                <div className="relative flex h-52 w-52 items-center justify-center rounded-[50px] bg-[#008A1E] p-2 shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                                        alt="Lut Lyna"
                                        className="h-44 w-44 rounded-[40px] object-cover border-2 border-white"
                                    />
                                </div>

                                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#E53E3E] text-white shadow-md">
                                    <span className="text-sm font-serif font-black">
                                        ”
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                                <h3 className="text-2xl font-bold text-[#F3BE00]">
                                    Lut Lyna
                                </h3>
                                <p className="mt-0.5 text-sm font-semibold text-[#E55B5B]">
                                    Fullstack Developer
                                </p>

                                <blockquote className="relative mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                    <span className="text-2xl font-serif text-slate-300 dark:text-slate-700 select-none mr-1">
                                        “
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        ការងារ
                                    </span>{" "}
                                    is a good website for learning IT with a
                                    great environment and mentors. A perfect
                                    place to start your IT career."
                                </blockquote>
                            </div>
                        </div>

                        <button className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md transition hover:bg-slate-50 dark:hover:bg-slate-700">
                            <ChevronRightIcon />
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
