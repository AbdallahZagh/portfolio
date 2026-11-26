"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpLeft, ArrowUpRight, Check, Copy, Mail, MessageSquare, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { ContactForm } from "./contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { useLocale, type Locale } from "@/components/locale-provider";
import { ltr, site, socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type ContactCopy = {
  eyebrow: string;
  headline: string;
  availability: string;
  emailLabel: string;
  copy: string;
  copied: string;
  openMail: string;
  phone: string;
  basedIn: string;
  basedInValue: string;
  write: string;
  sheetTitle: string;
  close: string;
};

const copy: Record<Locale, ContactCopy> = {
  en: {
    eyebrow: "Contact",
    headline: "Let's build something together.",
    availability: "Available for worldwide remote opportunities.",
    emailLabel: "Email",
    copy: "Copy",
    copied: "Copied",
    openMail: "Open in your email app",
    phone: "Phone",
    basedIn: "Based in",
    basedInValue: "Damascus · UTC+3 · remote worldwide",
    write: "Write a message",
    sheetTitle: "Send a message",
    close: "Close",
  },
  ar: {
    eyebrow: "تواصل",
    headline: "لنبنِ شيئًا معًا.",
    availability: "متاح لفرص العمل عن بُعد حول العالم.",
    emailLabel: "البريد الإلكتروني",
    copy: "نسخ",
    copied: "تم النسخ",
    openMail: "فتح في تطبيق البريد",
    phone: "الهاتف",
    basedIn: "المقر",
    basedInValue: `دمشق · ${ltr("UTC+3")} · عن بُعد من أي مكان`,
    write: "اكتب رسالة",
    sheetTitle: "أرسل رسالة",
    close: "إغلاق",
  },
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contact-accent";

/** The address as one large line: tap to copy, label flips to "Copied" for two seconds. */
function EmailCopy({ text }: { text: ContactCopy }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const area = document.createElement("textarea");
      area.value = site.email;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="ltr" className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "group flex min-h-14 min-w-0 flex-1 items-center justify-between gap-3 rounded-[14px] border border-contact-line px-4 text-start",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-contact-accent",
          focusRing,
        )}
      >
        <span className="min-w-0 text-[15px] font-semibold leading-6 tracking-[-0.01em] text-contact-ink min-[360px]:text-[17px] min-[400px]:text-[19px] sm:text-[24px] sm:leading-8 lg:text-[26px]">
          {site.email}
        </span>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold leading-5 text-contact-accent"
          aria-live="polite"
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          <span className="sr-only sm:not-sr-only">{copied ? text.copied : text.copy}</span>
        </span>
      </button>
      <a
        href={`mailto:${site.email}`}
        aria-label={text.openMail}
        title={text.openMail}
        className={cn(
          "inline-flex size-14 shrink-0 items-center justify-center rounded-[14px] border border-contact-line text-contact-ink",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-contact-accent hover:text-contact-accent",
          focusRing,
        )}
      >
        <Mail className="size-5" aria-hidden="true" />
      </a>
    </div>
  );
}

function ProfileLink({ href, label, Arrow }: { href: string; label: string; Arrow: typeof ArrowUpRight }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-contact-line px-5 text-[16px] font-semibold leading-5 text-contact-ink sm:flex-none",
        "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-contact-accent hover:text-contact-accent",
        focusRing,
      )}
    >
      <bdi dir="ltr">{label}</bdi>
      <Arrow aria-hidden="true" className="size-4" strokeWidth={2} />
    </a>
  );
}

/**
 * Phones get the form in a bottom sheet: drag handle, swipe down / Esc / back to close, focus kept inside,
 * lifted above the on-screen keyboard. It stays mounted (inert while shut) so a half-written message survives.
 */
function ContactSheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [keyboard, setKeyboard] = useState(0);
  const titleId = useId();

  /** Closing from inside the sheet goes through history so the browser back button agrees with it. */
  const requestClose = useCallback(() => {
    if (window.history.state?.contactSheet) window.history.back();
    else onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    window.history.pushState({ contactSheet: true }, "");
    const onPop = () => onClose();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([tabindex="-1"]):not([disabled]), textarea:not([disabled])',
      );
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
    window.addEventListener("popstate", onPop);
    document.addEventListener("keydown", onKey);
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.focus({ preventScroll: true });

    const viewport = window.visualViewport;
    const onViewport = () => {
      if (!viewport) return;
      setKeyboard(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));
    };
    viewport?.addEventListener("resize", onViewport);
    viewport?.addEventListener("scroll", onViewport);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("keydown", onKey);
      viewport?.removeEventListener("resize", onViewport);
      viewport?.removeEventListener("scroll", onViewport);
      document.body.style.overflow = previous;
      lenis?.start();
      setKeyboard(0);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose, requestClose, lenis]);

  const onHandleDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onHandleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current === null) return;
    setOffset(Math.max(0, event.clientY - drag.current));
  };
  const onHandleUp = () => {
    if (drag.current === null) return;
    drag.current = null;
    if (offset > 96) requestClose();
    setOffset(0);
  };

  return (
    <div className="contact-sheet fixed inset-0 z-50 md:hidden" data-open={open} inert={!open}>
      <div aria-hidden="true" onClick={requestClose} className="contact-sheet-scrim absolute inset-0 bg-ink/50" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          bottom: keyboard,
          transform: open ? `translateY(${offset}px)` : undefined,
          transition: dragging ? "none" : undefined,
        }}
        className="contact-sheet-panel absolute inset-x-0 flex max-h-[90dvh] flex-col rounded-t-[24px] border border-b-0 border-line bg-surface text-ink outline-none"
      >
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          className="flex h-8 shrink-0 cursor-grab touch-none items-center justify-center"
        >
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 pb-2">
          <h3 id={titleId} className="text-[20px] font-semibold leading-7 tracking-[-0.02em] rtl:tracking-normal">
            {title}
          </h3>
          <button
            type="button"
            onClick={requestClose}
            aria-label={closeLabel}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const github = socialLinks.find((link) => link.name === "GitHub");
  const linkedin = socialLinks.find((link) => link.name === "LinkedIn");
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <>
    <Reveal
      as="section"
      variant="scale"
      id="contact"
      aria-labelledby="contact-title"
      className="mt-14 scroll-mt-[88px] bg-contact-bg text-contact-ink md:mt-20"
    >
      <Container className="py-16 md:py-24 lg:py-[120px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 id="contact-title" className="text-[15px] font-medium leading-5 text-contact-accent">
                {text.eyebrow}
              </h2>
              <p className="text-[40px] font-semibold leading-[44px] tracking-[-0.03em] text-contact-ink rtl:leading-[56px] rtl:tracking-normal sm:text-[56px] sm:leading-[58px] rtl:sm:leading-[74px] lg:text-[64px] lg:leading-[66px] rtl:lg:leading-[84px]">
                {text.headline.split(" ").map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="reveal-item me-[0.26em] inline-block"
                    style={{ "--i": index, "--step": "60ms" } as CSSProperties}
                  >
                    {word}
                  </span>
                ))}
              </p>
              <p className="max-w-[460px] text-[18px] leading-[27px] text-contact-muted">{text.availability}</p>
              <span aria-hidden="true" className="reveal-line h-0.5 w-16 bg-contact-accent" />
            </div>

            <EmailCopy text={text} />

            <div className="flex gap-3">
              {linkedin ? <ProfileLink href={linkedin.url} label={linkedin.name} Arrow={Arrow} /> : null}
              {github ? <ProfileLink href={github.url} label={github.name} Arrow={Arrow} /> : null}
            </div>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className={cn(
                "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-contact-btn text-[17px] font-semibold leading-5 text-contact-btn-fg md:hidden",
                "transition-[filter,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:brightness-110 active:scale-[0.98]",
                focusRing,
              )}
            >
              <MessageSquare className="size-5" aria-hidden="true" />
              {text.write}
            </button>

            <dl className="relative flex flex-col gap-3 pt-6 text-[16px] leading-6">
              <span aria-hidden="true" className="reveal-line absolute inset-x-0 top-0 h-px bg-contact-line" />
              <div className="flex flex-wrap items-baseline gap-x-4">
                <dt className="w-24 shrink-0 text-contact-muted">{text.phone}</dt>
                <dd>
                  <a
                    href={site.phoneHref}
                    dir="ltr"
                    className={cn("inline-flex min-h-11 items-center text-contact-ink transition-colors hover:text-contact-accent", focusRing)}
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4">
                <dt className="w-24 shrink-0 text-contact-muted">{text.basedIn}</dt>
                <dd className="text-contact-ink">{text.basedInValue}</dd>
              </div>
            </dl>
          </div>

          <div className="hidden rounded-[24px] border border-line bg-surface p-6 text-ink md:block lg:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Reveal>

    {/* Outside the section: a scaling ancestor would otherwise become the fixed sheet's containing block. */}
    <ContactSheet open={sheetOpen} onClose={closeSheet} title={text.sheetTitle} closeLabel={text.close}>
      <ContactForm />
    </ContactSheet>
    </>
  );
}
