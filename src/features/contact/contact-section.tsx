"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { ArrowUpLeft, ArrowUpRight, Check, Copy, Mail, MessageSquare, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { ContactForm } from "./contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { useLocale, type Locale } from "@/components/locale-provider";
import { ltr, site, socialLinks } from "@/data/portfolio";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

type ContactCopy = {
  eyebrow: string;
  chip: string;
  headline: string;
  emailMe: string;
  copy: string;
  copied: string;
  copyLabel: string;
  openMail: string;
  phone: string;
  basedInValue: string;
  write: string;
  sheetTitle: string;
  close: string;
};

const copy: Record<Locale, ContactCopy> = {
  en: {
    eyebrow: "Contact",
    chip: "Available for worldwide remote roles",
    headline: "Let's build something together.",
    emailMe: "Email me",
    copy: "Copy",
    copied: "Copied",
    copyLabel: "Copy email address",
    openMail: "Open in your email app",
    phone: "Phone",
    basedInValue: "Damascus · UTC+3 · remote worldwide",
    write: "Write a message",
    sheetTitle: "Send a message",
    close: "Close",
  },
  ar: {
    eyebrow: "تواصل",
    chip: "متاح لفرص العمل عن بُعد حول العالم",
    headline: "لنبنِ شيئًا معًا.",
    emailMe: "راسلني بالبريد",
    copy: "نسخ",
    copied: "تم النسخ",
    copyLabel: "نسخ عنوان البريد",
    openMail: "فتح في تطبيق البريد",
    phone: "الهاتف",
    basedInValue: `دمشق · ${ltr("UTC+3")} · عن بُعد من أي مكان`,
    write: "اكتب رسالة",
    sheetTitle: "أرسل رسالة",
    close: "إغلاق",
  },
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contact-accent";
const hoverEase = "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]";

/** Copy the address; `copied` stays true for two seconds so the button label and the toast can show it. */
function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = useCallback(async () => {
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
  }, []);

  return { copied, copyEmail };
}

function CopyButton({
  text,
  copied,
  onCopy,
  className,
}: {
  text: ContactCopy;
  copied: boolean;
  onCopy: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={text.copyLabel}
      className={cn(
        "relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-contact-btn px-3.5 text-[14px] font-semibold leading-5 text-contact-btn-fg",
        // Grows the touch target to 44px without growing the pill.
        "after:absolute after:-inset-y-1 after:inset-x-0 after:content-['']",
        "transition-[filter,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:brightness-110 active:scale-[0.97] motion-reduce:active:scale-100",
        focusRing,
        className,
      )}
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      <span>{copied ? text.copied : text.copy}</span>
    </button>
  );
}

function ProfileLink({
  href,
  name,
  Icon,
  Arrow,
}: {
  href: string;
  name: string;
  Icon: (typeof socialLinks)[number]["icon"];
  Arrow: typeof ArrowUpRight;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-contact-line px-5 text-[16px] font-semibold leading-5 text-contact-ink lg:flex-none lg:px-6",
        hoverEase,
        "hover:border-contact-accent hover:text-contact-accent",
        focusRing,
      )}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      <bdi dir="ltr">{name}</bdi>
      <Arrow aria-hidden="true" className="size-4 opacity-70" strokeWidth={2} />
    </a>
  );
}

/**
 * Below 1024px the form lives in a bottom sheet: drag handle, swipe down / Esc / back to close, focus kept
 * inside, lifted above the on-screen keyboard. It is portalled to <body> so nothing (navbar included) can sit
 * above it, and it stays mounted (inert while shut) so a half-written message survives closing.
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
  const mounted = useMounted();
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
    setDragging(false);
    if (offset > 96) requestClose();
    setOffset(0);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="contact-sheet fixed inset-0 z-[100] lg:hidden" data-open={open} inert={!open}>
      <div
        aria-hidden="true"
        onClick={requestClose}
        className="contact-sheet-scrim absolute inset-0 bg-black/60 backdrop-blur-[12px]"
      />
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
    </div>,
    document.body,
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
  const { copied, copyEmail } = useCopyEmail();

  return (
    <>
      <Reveal
        as="section"
        variant="scale"
        id="contact"
        aria-labelledby="contact-title"
        className="mt-14 scroll-mt-[88px] rounded-t-[28px] bg-contact-bg text-contact-ink md:mt-20"
      >
        <Container className="pb-12 pt-16 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-x-8 lg:gap-y-0">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-7 lg:gap-8">
              <p className="inline-flex items-center gap-2.5 self-start rounded-full border border-contact-line px-4 py-2 text-[15px] font-medium leading-5 text-contact-ink">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-contact-btn" />
                {text.chip}
              </p>

              <h2
                id="contact-title"
                className="text-balance text-[clamp(30px,9.2vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-contact-ink rtl:leading-[1.45] rtl:tracking-normal md:text-[56px] lg:text-[72px] lg:leading-[1.04] rtl:lg:leading-[1.35]"
              >
                {text.headline.split(" ").map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="reveal-item me-[0.26em] inline-block"
                    style={{ "--i": index, "--step": "60ms" } as CSSProperties}
                  >
                    {word}
                  </span>
                ))}
              </h2>
              <span aria-hidden="true" className="reveal-line h-0.5 w-16 bg-contact-btn" />

              {/* Phones and tablet: one primary action, then the address with a small Copy button. */}
              <div className="flex flex-col gap-4 lg:hidden">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    "inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-contact-btn text-[17px] font-semibold leading-5 text-contact-btn-fg",
                    "transition-[filter,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:brightness-110 active:scale-[0.98] motion-reduce:active:scale-100",
                    focusRing,
                  )}
                >
                  <Mail className="size-5" aria-hidden="true" />
                  {text.emailMe}
                </a>
                <div dir="ltr" className="flex items-center justify-between gap-3">
                  <span className="min-w-0 font-mono text-[15px] leading-6 text-contact-ink [overflow-wrap:anywhere]">
                    {site.email}
                  </span>
                  <CopyButton text={text} copied={copied} onCopy={copyEmail} />
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  aria-haspopup="dialog"
                  className={cn(
                    "inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-contact-line text-[17px] font-semibold leading-5 text-contact-ink",
                    hoverEase,
                    "hover:border-contact-accent active:scale-[0.98] motion-reduce:active:scale-100",
                    focusRing,
                  )}
                >
                  <MessageSquare className="size-5" aria-hidden="true" />
                  {text.write}
                </button>
              </div>

              {/* Desktop: the address itself is the big link; Copy appears on hover and keyboard focus. */}
              <div dir="ltr" className="group/email hidden items-center gap-4 lg:flex">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    "min-w-0 text-[40px] font-semibold leading-[1.15] tracking-[-0.02em] text-contact-ink underline decoration-contact-line decoration-2 underline-offset-[10px]",
                    hoverEase,
                    "hover:text-contact-accent hover:decoration-contact-accent",
                    focusRing,
                  )}
                >
                  {site.email}
                </a>
                <CopyButton
                  text={text}
                  copied={copied}
                  onCopy={copyEmail}
                  className="opacity-0 transition-opacity group-focus-within/email:opacity-100 group-hover/email:opacity-100 focus-visible:opacity-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap">
                {linkedin ? (
                  <ProfileLink href={linkedin.url} name={linkedin.name} Icon={linkedin.icon} Arrow={Arrow} />
                ) : null}
                {github ? <ProfileLink href={github.url} name={github.name} Icon={github.icon} Arrow={Arrow} /> : null}
              </div>

              <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-[15px] leading-6 text-contact-muted">
                <span aria-hidden="true" className="reveal-line absolute inset-x-0 top-0 h-px bg-contact-line" />
                <a
                  href={site.phoneHref}
                  className={cn("inline-flex min-h-11 items-center text-contact-ink hover:text-contact-accent", hoverEase, focusRing)}
                >
                  <span className="sr-only">{text.phone}: </span>
                  <bdi dir="ltr" className="whitespace-nowrap">
                    {site.phone}
                  </bdi>
                </a>
                <span>{text.basedInValue}</span>
              </div>
            </div>

            <div className="hidden rounded-[24px] border border-line bg-surface p-8 text-ink lg:col-span-5 lg:block">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Reveal>

      <ContactSheet open={sheetOpen} onClose={closeSheet} title={text.sheetTitle} closeLabel={text.close}>
        <ContactForm />
      </ContactSheet>

      {/* "Copied" toast: polite status, bottom centre, above the sheet-free page. */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4 transition-[opacity,translate] duration-[var(--duration-hover)] ease-[var(--ease-out-expo)]",
          copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <span className="rounded-full bg-ink px-4 py-2 text-[15px] font-medium leading-5 text-bg shadow-lg">
          {copied ? text.copied : ""}
        </span>
      </div>
    </>
  );
}
