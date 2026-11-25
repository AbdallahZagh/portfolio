"use client";

import { useCallback, useEffect, useId, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowUpLeft, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";
import { site } from "@/data/portfolio";
import { Cta } from "@/components/ui/cta";
import { IconButton } from "@/components/ui/icon-button";
import { NavPillLink } from "@/components/ui/nav-pill-link";
import { useLocale, type Locale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { changeTheme } from "@/lib/theme-transition";

const NAV_OFFSET = -90;
const SECTION_IDS = ["home", "experience", "projects", "skills", "contact"];

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
    switchLanguage: "عربي",
    close: "Close menu",
    open: "Open menu",
  },
  ar: {
    menu: "القائمة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    language: "اللغة",
    talk: "تواصل معي",
    switchLanguage: "EN",
    close: "إغلاق القائمة",
    open: "فتح القائمة",
  },
} as const;

function activeFromScroll() {
  const probe = 110;
  let current = SECTION_IDS[0];

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) current = id;
  }

  const doc = document.documentElement;
  if (window.innerHeight + doc.scrollTop >= doc.scrollHeight - 48) {
    current = "contact";
  }

  return `#${current}`;
}

function useScrolledSection() {
  const [active, setActive] = useState("#experience");
  const syncActive = useCallback(() => {
    setActive(activeFromScroll());
  }, []);

  useLenis(syncActive);

  useEffect(() => {
    const frame = window.requestAnimationFrame(syncActive);
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [syncActive]);

  return [active, setActive] as const;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const [active, setActive] = useScrolledSection();
  const lenis = useLenis();
  const text = copy[locale];
  const menuTitleId = useId();

  useEffect(() => {
    if (!lenis) return;
    if (isOpen) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const scrollTo = (href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    setActive(href);
    if (lenis) {
      lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.05 });
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const follow = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(false);
    scrollTo(href);
  };

  const toggleLocale = () => setLocale(locale === "en" ? "ar" : "en");

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 bg-transparent px-4 pt-3 lg:px-8 lg:pt-4">
        <nav
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary"}
          className="nav-drop liquid-glass-pill pointer-events-auto relative mx-auto flex h-16 w-full max-w-[1328px] items-center justify-between rounded-full px-3 lg:h-[70px] lg:px-4"
        >
          <Monogram withName onClick={(event) => follow(event, "#home")} />

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive =
                active === link.href || (link.href === "#experience" && active === "#home");
              return (
                <NavPillLink
                  key={link.href}
                  href={link.href}
                  active={isActive}
                  onClick={(event) => follow(event, link.href)}
                >
                  {locale === "ar" ? link.ar : link.en}
                </NavPillLink>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <ThemeIconButton className="hidden lg:inline-flex" />
            <button
              type="button"
              onClick={toggleLocale}
              className={cn(
                "hidden h-11 min-w-14 items-center justify-center rounded-full px-3 text-[16px] font-medium leading-5 text-ink lg:inline-flex",
                "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:bg-glass-fill active:bg-glass-active",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                locale === "en" && "font-arabic",
              )}
            >
              {text.switchLanguage}
            </button>
            <Cta href="#contact" onClick={(event) => follow(event, "#contact")}>
              {text.talk}
            </Cta>
            <IconButton
              className="lg:hidden"
              aria-expanded={isOpen}
              aria-controls={menuTitleId}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="block size-5" aria-hidden="true" />
              <span className="sr-only">{text.open}</span>
            </IconButton>
          </div>
        </nav>
      </header>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-bg text-ink lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
        >
          <div className="mx-auto flex h-[76px] w-full max-w-[390px] items-center justify-between px-3">
            <Monogram onClick={(event) => follow(event, "#home")} />
            <IconButton glass onClick={() => setIsOpen(false)}>
              <X className="block size-5" aria-hidden="true" />
              <span className="sr-only">{text.close}</span>
            </IconButton>
          </div>

          <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col px-5 pb-6">
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
                const isActive =
                  active === link.href || (link.href === "#experience" && active === "#home");
                const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
                return (
                  <li key={link.href} className="border-b border-line">
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
                      <Arrow
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className={cn("size-[22px] shrink-0", isActive ? "text-brand-text" : "text-muted")}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-4 border-t border-line pt-6">
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
      ) : null}
    </>
  );
}

function Monogram({
  withName = false,
  onClick,
}: {
  withName?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href="#home"
      onClick={onClick}
      aria-label={site.name}
      className="flex items-center gap-3 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand text-[17px] font-semibold leading-5 text-on-brand"
      >
        AZ
      </span>
      {withName ? (
        <span className="hidden text-[17px] font-medium leading-[22px] text-ink sm:inline">{site.name}</span>
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
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && theme === "dark";

  return (
    <IconButton
      className={className}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={(event) =>
        mounted && changeTheme(() => setTheme(isDark ? "light" : "dark"), event.currentTarget)
      }
    >
      {isDark ? <Sun className="block size-5" /> : <Moon className="block size-5" />}
    </IconButton>
  );
}
