"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PageHeading = { title: string; description?: string };

type PageHeadingStore = {
  heading: PageHeading | null;
  setHeading: (heading: PageHeading | null) => void;
};

const PageHeadingContext = createContext<PageHeadingStore | null>(null);

/**
 * Lets a page declare its title/description while the shell renders them in the
 * header, next to the search and account controls, instead of the page body.
 */
export function PageHeadingProvider({ children }: { children: ReactNode }) {
  const [heading, setHeading] = useState<PageHeading | null>(null);
  const value = useMemo(() => ({ heading, setHeading }), [heading]);

  return (
    <PageHeadingContext.Provider value={value}>
      {children}
    </PageHeadingContext.Provider>
  );
}

export function usePageHeading() {
  return useContext(PageHeadingContext)?.heading ?? null;
}

/**
 * Publishes a heading for as long as the calling page is mounted. Only the
 * strings are tracked, so an unstable `action` element can never loop renders.
 */
export function useSetPageHeading(title: string, description?: string) {
  const store = useContext(PageHeadingContext);
  const setHeading = store?.setHeading;
  const clear = useCallback(() => setHeading?.(null), [setHeading]);

  useEffect(() => {
    if (!setHeading) return;
    setHeading({ title, description });
    return clear;
  }, [title, description, setHeading, clear]);
}
