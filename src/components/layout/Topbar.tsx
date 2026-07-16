"use client";

import Image from "next/image";
import { Bell, HelpCircle, Mail, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "./MobileNav";

type TopbarProps = {
  searchPlaceholder?: string;
};

const ACTIONS = [
  { icon: Bell, label: "Notifications", dot: true },
  { icon: Mail, label: "Messages", dot: false },
  { icon: HelpCircle, label: "Help center", dot: false },
  { icon: Settings, label: "Settings", dot: false },
];

export function Topbar({
  searchPlaceholder = "Search companies, industries, or registration IDs...",
}: TopbarProps) {
  return (
    <header className="flex items-center gap-3 pb-6">
      <MobileNav />

      <div className="relative w-full max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />
        <Input
          type="search"
          aria-label="Search"
          placeholder={searchPlaceholder}
          className="field-input h-10 rounded-full border-slate-200 bg-slate-50 pl-10"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <div className="hidden items-center gap-1 md:flex">
          {ACTIONS.map(({ icon: Icon, label, dot }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              aria-label={label}
              title={label}
              className="relative text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-heading"
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {dot ? (
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 size-1.5 rounded-full bg-brand ring-2 ring-white"
                />
              ) : null}
            </Button>
          ))}
        </div>

        <Separator
          orientation="vertical"
          className="mx-2 hidden h-8 bg-slate-200 md:block"
        />

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold text-heading">Alex Rivera</p>
            <p className="text-xs text-slate-500">Senior Talent Lead</p>
          </div>
          <Image
            src="https://i.pravatar.cc/80?img=13"
            alt="Alex Rivera"
            width={40}
            height={40}
            className="size-10 rounded-lg object-cover ring-2 ring-brand/40 ring-offset-2 ring-offset-white"
          />
        </div>
      </div>
    </header>
  );
}