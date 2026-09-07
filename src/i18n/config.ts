import en from "./en.json";
import km from "./km.json";

export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const localeStorageKey = "kagea-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function flattenDictionary(value: unknown, prefix = "", output: Record<string, string> = {}) {
  if (typeof value === "string") { output[prefix] = value; return output; }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flattenDictionary(child, prefix ? `${prefix}.${key}` : key, output);
    }
  }
  return output;
}

export const flatDictionaries = { en: flattenDictionary(en), km: flattenDictionary(km) };

export const dictionaries: Record<Locale, unknown> = { en, km };

export function resolvePath(value: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object") return (node as Record<string, unknown>)[segment];
    return undefined;
  }, value);
}
