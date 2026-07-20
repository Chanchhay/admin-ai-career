
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white dark:bg-gray-950">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-0 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="KaWork Logo"
            width={80}
            height={80}
            priority
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
       
        </Link>

        {/* Navigation Menu - Desktop */}
        <div className="hidden md:block">
          <NavigationMenu className="gap-0">
            <NavigationMenuList className="gap-0">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/find-job"
                    className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 transition"
                  >
                    Find Job
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/post-job"
                    className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 transition"
                  >
                    Post Job
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about-us"
                    className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 transition"
                  >
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            aria-label="Language"
            className="hidden sm:block border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-slate-900 dark:text-white"
          >
            <option>EN</option>
            <option>Khmer</option>
          </select>

          {/* Dark Mode Toggle */}
          {/* <button
            onClick={() => {
              setDark((v) => !v);
              if (typeof document !== "undefined")
                document.documentElement.classList.toggle("dark");
            }}
            aria-label="Toggle dark mode"
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button> */}

          {/* Profile Icon linking to dashboard */}
          <Link
            href="/"
            aria-label="Dashboard"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Login Button */}
          <Link
            href="/auth/login"
            className="hidden sm:inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3 flex flex-col gap-2">
          <Link
            href="/find-job"
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Find Job
          </Link>
          <Link
            href="/post-job"
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Post Job
          </Link>
          <Link
            href="/about-us"
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            About Us
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-center font-medium transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

