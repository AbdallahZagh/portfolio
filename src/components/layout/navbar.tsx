"use client";

import { useCallback, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { navLinks, site } from "@/data/portfolio";

const NAV_OFFSET = -80;
const SECTION_IDS = ["home", ...navLinks.map((link) => link.href.slice(1))];

function activeFromScroll() {
  const probe = 96;
  let current = SECTION_IDS[0];

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= probe) current = id;
  }

  const doc = document.documentElement;
  if (window.innerHeight + doc.scrollTop >= doc.scrollHeight - 48) {
    current = SECTION_IDS[SECTION_IDS.length - 1];
  }

  return `#${current}`;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const lenis = useLenis();

  const syncActive = useCallback(() => {
    setActive(activeFromScroll());
  }, []);

  useLenis(syncActive);

  useEffect(() => {
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);
    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
    };
  }, [syncActive]);

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

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-sm">
        <div className="page-wrap flex h-16 items-center justify-between">
          <a
            href="#home"
            className="font-display text-sm font-semibold tracking-tight text-transparent bg-gradient-to-r from-muted to-primary bg-clip-text"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              scrollTo("#home");
            }}
          >
            {site.name}
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <div className="relative flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      scrollTo(link.href);
                    }}
                    className={`relative py-1 text-sm transition-colors ${
                      isActive ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-0 -bottom-1 h-px bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    ) : null}
                    {link.label}
                  </a>
                );
              })}
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background pt-16 md:hidden"
          >
            <div className="page-wrap flex flex-col gap-1 pt-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`py-3 font-display text-2xl ${
                    active === link.href ? "text-primary" : "text-foreground"
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpen(false);
                    scrollTo(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
