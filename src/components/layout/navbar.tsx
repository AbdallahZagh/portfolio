"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ArrowUpLeft, ArrowUpRight, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";
import { site } from "@/data/portfolio";
import { Cta } from "@/components/ui/cta";
import { IconButton } from "@/components/ui/icon-button";
import { useLocale, type Locale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { changeTheme } from "@/lib/theme-transition";

const NAV_OFFSET = -90;
const SECTION_IDS = ["experience", "projects", "skills", "contact"] as const;
/** The bar turns frosted after this much scroll. */
const FROST_AT = 24;
/** Time the sheet needs to finish its closing animation before it leaves the DOM. */
const SHEET_MS = 520;

const links = [
  { href: "#experience", en: "Experience", ar: "الخبرة" },
  { href: "#projects", en: "Projects", ar: "المشاريع" },
  { href: "#skills", en: "Skills", ar: "المهارات" },
] as const;

const copy = {
  en: {
    menu: "Menu",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    talk: "Get in touch",
    switchLanguage: "ع",
    switchLanguageLabel: "Switch language to Arabic",
    primary: "Primary",
    close: "Close menu",
    open: "Open menu",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    name: site.name,
  },
  ar: {
    menu: "القائمة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    language: "اللغة",
    talk: "تواصل معي",
    switchLanguage: "EN",
    switchLanguageLabel: "التبديل إلى الإنجليزية",
    primary: "التنقل الرئيسي",
    close: "إغلاق القائمة",
    open: "فتح القائمة",
    toLight: "التبديل إلى المظهر الفاتح",
    toDark: "التبديل إلى المظهر الداكن",
    name: "عبدالله زغلول",
  },
} as const;

/**
 * Which section is under the middle of the viewport. A thin band at mid-height means exactly one
 * section matches at a time, and none does on the hero, so nothing is highlighted at the top.
 */
function useActiveSection() {
  const [active, setActive] = useState("");
  const visible = useRef(new Set<string>());
  const lockedUntil = useRef(0);
  const settle = useRef<() => void>(() => {});

  useEffect(() => {
    const resolve = () => {
      const id = SECTION_IDS.find((section) => visible.current.has(section));
      setActive(id ? `#${id}` : "");
    };
    settle.current = resolve;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.current.add(entry.target.id);
          else visible.current.delete(entry.target.id);
        }
        // While a click-scroll is travelling, the clicked link stays active instead of flickering.
        if (Date.now() >= lockedUntil.current) resolve();
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  /** Mark a link active right away, and hand control back to the observer once the scroll lands. */
  const hold = useCallback((href: string, ms = 1300) => {
    lockedUntil.current = Date.now() + ms;
    setActive(href);
    window.setTimeout(() => settle.current(), ms + 20);
  }, []);

  return [active, hold] as const;
}

/** Frosted bar after FROST_AT px, and a collapsed name once the hero has scrolled away. */
function useBarState() {
  const [frosted, setFrosted] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setFrosted(window.scrollY >= FROST_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hero = document.getElementById("home");
    let observer: IntersectionObserver | undefined;
    if (hero) {
      observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
        rootMargin: "-56px 0px 0px 0px",
      });
      observer.observe(hero);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return { frosted, pastHero };
}

export function Navbar() {
  const { locale, setLocale } = useLocale();
  const [active, hold] = useActiveSection();
  const { frosted, pastHero } = useBarState();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const text = copy[locale];
  const menuTitleId = useId();

  // `mounted` keeps the sheet in the DOM while it animates out; `shown` is the real open state.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const burger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const openMenu = () => {
    window.clearTimeout(timer.current);
    const rect = burger.current?.getBoundingClientRect();
    if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setMounted(true);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setShown(true)));
  };

  const closeMenu = useCallback(() => {
    setShown(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMounted(false), SHEET_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Page scroll is locked only while the sheet is really open.
  useEffect(() => {
    if (!shown) return;
    lenis?.stop();
    const opener = burger.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, [shown, lenis, closeMenu]);

  // Leaving the mobile range with the sheet open would strand it.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (query.matches) {
        window.clearTimeout(timer.current);
        setShown(false);
        setMounted(false);
      }
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const trapTab = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panel.current) return;
    const items = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    if (href !== "#home") hold(href);
    if (lenis) {
      lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.05, force: true });
      return;
    }
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const follow = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (mounted) closeMenu();
    scrollTo(href);
  };

  const toggleLocale = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <>
      <header className="nav-drop fixed inset-x-0 top-0 z-40 h-14" data-frosted={frosted}>
        <div aria-hidden="true" className="nav-frost" />
        <nav
          aria-label={text.primary}
          className="relative mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 xl:px-14"
        >
          <Monogram name={text.name} collapsed={pastHero} onClick={(event) => follow(event, "#home")} />

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => follow(event, link.href)}
                  className={cn(
                    "relative inline-flex h-11 items-center rounded-full px-4 text-[16px] font-medium leading-5",
                    "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-glass-active ring-1 ring-inset ring-glass-stroke"
                      transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{locale === "ar" ? link.ar : link.en}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center rounded-full ring-1 ring-inset ring-line lg:flex">
              <ThemeIconButton />
              <span aria-hidden="true" className="h-5 w-px bg-line" />
              <button
                type="button"
                onClick={toggleLocale}
                aria-label={text.switchLanguageLabel}
                lang={locale === "en" ? "ar" : "en"}
                className={cn(
                  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-[15px] font-medium leading-5 text-ink",
                  "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:bg-glass-fill active:bg-glass-active",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  locale === "en" && "font-arabic text-[17px]",
                )}
              >
                {text.switchLanguage}
              </button>
            </div>

            <Cta
              href="#contact"
              size="sm"
              className="hidden min-[360px]:inline-flex"
              onClick={(event) => follow(event, "#contact")}
            >
              {text.talk}
            </Cta>
            <a
              href="#contact"
              aria-label={text.talk}
              onClick={(event) => follow(event, "#contact")}
              className="inline-flex size-11 items-center justify-center rounded-full bg-brand text-on-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg min-[360px]:hidden"
            >
              <Mail className="size-5" aria-hidden="true" />
            </a>

            <IconButton
              ref={burger}
              className="lg:hidden"
              aria-expanded={shown}
              aria-controls={menuTitleId}
              onClick={openMenu}
            >
              <Menu className="block size-5" aria-hidden="true" />
              <span className="sr-only">{text.open}</span>
            </IconButton>
          </div>
        </nav>
      </header>

      {mounted ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
          onKeyDown={trapTab}
        >
          <div
            aria-hidden="true"
            data-open={shown}
            onClick={closeMenu}
            className="menu-scrim absolute inset-0 hidden bg-ink/40 md:block"
          />
          <div
            ref={panel}
            data-open={shown}
            style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px` } as CSSProperties}
            className="menu-panel flex flex-col overflow-y-auto bg-bg text-ink"
          >
            <div className="flex h-[76px] shrink-0 items-center justify-between px-5 sm:px-8 md:px-6">
              <Monogram name={text.name} onClick={(event) => follow(event, "#home")} />
              <IconButton ref={closeButton} glass onClick={closeMenu}>
                <X className="block size-5" aria-hidden="true" />
                <span className="sr-only">{text.close}</span>
              </IconButton>
            </div>

            <div className="flex w-full flex-1 flex-col px-5 pb-8 sm:px-8 md:px-6">
              <p
                id={menuTitleId}
                className={cn(
                  "pb-3 text-[14px] text-muted",
                  locale === "ar" ? "font-arabic" : "font-mono uppercase tracking-[0.14em]",
                )}
              >
                {text.menu}
              </p>
              <ul>
                {links.map((link, index) => {
                  const isActive = active === link.href;
                  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
                  return (
                    <li
                      key={link.href}
                      className="menu-item border-b border-line"
                      style={{ "--i": index } as CSSProperties}
                    >
                      <a
                        href={link.href}
                        aria-current={isActive ? "true" : undefined}
                        onClick={(event) => follow(event, link.href)}
                        className="flex h-20 items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        <span className="flex items-center gap-4">
                          <span className="font-mono text-[14px] text-brand-text">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[40px] font-semibold leading-[44px] text-ink">
                            {locale === "ar" ? link.ar : link.en}
                          </span>
                        </span>
                        <span className="flex items-center gap-3">
                          {isActive ? (
                            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
                          ) : null}
                          <Arrow
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className={cn("size-[22px] shrink-0", isActive ? "text-brand-text" : "text-muted")}
                          />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div
                className="menu-item mt-8 flex flex-col gap-4 border-t border-line pt-6"
                style={{ "--i": links.length } as CSSProperties}
              >
                <SettingRow label={text.theme}>
                  <ThemeSegment locale={locale} />
                </SettingRow>
                <SettingRow label={text.language}>
                  <Segment
                    value={locale}
                    onChange={setLocale}
                    options={[
                      { value: "en", label: "EN" },
                      { value: "ar", label: "عربي", arabic: true },
                    ]}
                  />
                </SettingRow>
                <Cta
                  href="#contact"
                  size="lg"
                  fullWidth
                  onClick={(event) => follow(event, "#contact")}
                >
                  {text.talk}
                </Cta>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Monogram({
  name,
  collapsed = false,
  onClick,
}: {
  name: string;
  /** Hides the written name, leaving the AZ mark. Only the header bar uses it. */
  collapsed?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const showsName = collapsed !== undefined;
  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label={name}
      className="flex h-11 min-w-11 items-center justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand text-[16px] font-semibold leading-5 text-on-brand"
      >
        AZ
      </span>
      {showsName ? (
        <span
          aria-hidden="true"
          data-collapsed={collapsed}
          className="nav-name whitespace-nowrap text-[17px] font-medium leading-[22px] text-ink"
        >
          {name}
        </span>
      ) : null}
    </a>
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-[54px] items-center justify-between gap-3">
      <span className="text-[15px] font-medium text-muted">{label}</span>
      {children}
    </div>
  );
}

function Segment<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; arabic?: boolean; icon?: ReactNode }[];
}) {
  return (
    <div className="flex h-[54px] w-[212px] shrink-0 items-center gap-1 rounded-full p-[5px] ring-1 ring-inset ring-line">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-11 w-[99px] items-center justify-center gap-2 rounded-full text-[15px] font-medium leading-5",
              "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              option.arabic && "font-arabic",
              selected ? "bg-brand text-on-brand" : "text-ink",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ThemeSegment({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const current = mounted && theme === "light" ? "light" : "dark";
  const text = copy[locale];

  return (
    <Segment
      value={current}
      onChange={(next) => changeTheme(() => setTheme(next))}
      options={[
        { value: "light", label: text.light, icon: <Sun className="block size-[18px]" aria-hidden="true" /> },
        { value: "dark", label: text.dark, icon: <Moon className="block size-[18px]" aria-hidden="true" /> },
      ]}
    />
  );
}

function ThemeIconButton({ className }: { className?: string }) {
  const { locale } = useLocale();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && theme === "dark";
  const text = copy[locale];

  return (
    <IconButton
      className={className}
      aria-label={isDark ? text.toLight : text.toDark}
      onClick={(event) =>
        mounted && changeTheme(() => setTheme(isDark ? "light" : "dark"), event.currentTarget)
      }
    >
      {isDark ? <Sun className="block size-5" /> : <Moon className="block size-5" />}
    </IconButton>
  );
}
