"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  km: { short: "KH", full: "ខ្មែរ" },
};

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "/admin/images/language/english-flag1.png",
  km: "/admin/images/language/cambodia-flag.png",
};

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={t("language.switch")}
        aria-expanded={open}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-ws-line bg-ws-panel px-3 text-[16px] leading-none font-normal text-ws-fg transition-colors hover:bg-ws-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className,
        )}
      >
        <Image
          src={LOCALE_FLAGS[locale]}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0 rounded-sm object-cover"
        />
        <span>{LOCALE_LABELS[locale].short}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-3.5 text-ws-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl bg-ws-panel p-1.5 shadow-(--shadow-dropdown)">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setLocale(code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-ws-fg transition-colors hover:bg-ws-card"
            >
              <span className="flex items-center gap-2">
                <Image
                  src={LOCALE_FLAGS[code]}
                  alt=""
                  width={24}
                  height={16}
                  className="h-4 w-6 shrink-0 object-contain"
                />
                <span lang={code}>{LOCALE_LABELS[code].full}</span>
              </span>
              {locale === code ? (
                <Check aria-hidden="true" className="size-4 text-primary" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
