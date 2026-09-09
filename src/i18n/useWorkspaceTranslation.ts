"use client";

import { useCallback } from "react";
import { useLocale } from "./LocaleProvider";
import { translateWorkspaceText } from "./workspace-translations";

/** Translate presentation copy without changing form values or API identifiers. */
export function useWorkspaceTranslation() {
  const { locale } = useLocale();
  return useCallback(<T,>(value: T, params?: Record<string, unknown>): T => {
    return (typeof value === "string" ? translateWorkspaceText(value, locale, params) : value) as T;
  }, [locale]);
}
