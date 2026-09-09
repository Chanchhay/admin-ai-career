"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import {
    defaultLocale,
    dictionaries,
    flatDictionaries,
    isLocale,
    localeStorageKey,
    resolvePath,
    type Locale,
} from "./config";

type LocaleContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    tArray: (key: string) => string[];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/*
 * `storage` only fires in *other* tabs, so a same-tab change is broadcast on
 * this event too -- both feed the same useSyncExternalStore subscription.
 */
const LOCALE_CHANGE_EVENT = "kagea-locale-change";

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(LOCALE_CHANGE_EVENT, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
    };
}

function getSnapshot(): Locale {
    const stored = window.localStorage.getItem(localeStorageKey);
    return isLocale(stored) ? stored : defaultLocale;
}

function getServerSnapshot(): Locale {
    return defaultLocale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    /*
     * useSyncExternalStore (not useState+useEffect) reads localStorage: the
     * server and first client render both use `getServerSnapshot`
     * (`defaultLocale`), so hydration always matches, and the real value
     * swaps in right after via React's own re-render -- no manual setState
     * in an effect.
     */
    const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = useCallback((next: Locale) => {
        window.localStorage.setItem(localeStorageKey, next);
        window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
    }, []);

    const t = useCallback(
        (key: string) =>
            flatDictionaries[locale][key] ??
            flatDictionaries[defaultLocale][key] ??
            key,
        [locale],
    );

    const tArray = useCallback(
        (key: string) => {
            const value = resolvePath(dictionaries[locale], key) ?? resolvePath(dictionaries[defaultLocale], key);
            return Array.isArray(value) ? (value as string[]) : [];
        },
        [locale],
    );

    const value = useMemo(
        () => ({ locale, setLocale, t, tArray }),
        [locale, setLocale, t, tArray],
    );

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}
