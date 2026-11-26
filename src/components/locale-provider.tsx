"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LOCALE_STORAGE_KEY } from "@/lib/locale-boot";

export type Locale = "en" | "ar";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  isRtl: false,
});

const listeners = new Set<() => void>();
let memoryLocale: Locale = "en"; // fallback when storage is unavailable (private mode)

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    /* fall through */
  }
  return memoryLocale;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getServerLocale = (): Locale => "en";

function applyToDocument(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "ar" ? "rtl" : "ltr";
  root.removeAttribute("data-locale-pending");
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // The server (and static export) always render English; during hydration React uses the
  // server snapshot, then switches to the stored choice before the browser paints.
  const locale = useSyncExternalStore(subscribe, readStoredLocale, getServerLocale);

  useLayoutEffect(() => {
    applyToDocument(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    memoryLocale = next;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* the choice just lasts for this visit */
    }
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, isRtl: locale === "ar" }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale() {
  return useContext(LocaleContext);
}
