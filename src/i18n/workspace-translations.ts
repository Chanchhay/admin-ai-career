import { flatDictionaries, type Locale } from "./config";
import khmer from "./workspace-km.json";

const translations: Record<string, string> = {};
for (const [key, english] of Object.entries(flatDictionaries.en)) {
  const translation = flatDictionaries.km[key];
  if (translation) translations[english.trim().toLowerCase()] = translation;
}
for (const [english, translation] of Object.entries(khmer)) {
  translations[english.trim().toLowerCase()] = translation;
}

export function translateWorkspaceText(value: string, locale: Locale, params?: Record<string, unknown>): string {
  const interpolate = (text: string) => text.replace(/\{(\w+)\}/g, (match, key: string) =>
    params && Object.hasOwn(params, key) ? String(params[key] ?? "") : match);
  if (locale === "en") return interpolate(value);
  const trimmed = value.trim();
  const translated = translations[trimmed.toLowerCase()] ?? translations[trimmed.toLowerCase().replaceAll("_", " ")];
  if (!translated) return interpolate(value);
  return interpolate(value.slice(0, value.indexOf(trimmed)) + translated + value.slice(value.indexOf(trimmed) + trimmed.length));
}
