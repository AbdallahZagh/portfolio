"use client";

import { useEffect, useRef, useState } from "react";
import { ContactForm } from "./contact-form";
import { Container } from "@/components/ui/container";
import { useLocale, type Locale } from "@/components/locale-provider";
import { site, socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type ContactCopy = {
  eyebrow: string;
  lede: string;
  copy: string;
  copied: string;
  phone: string;
  github: string;
  linkedin: string;
  basedIn: string;
  basedInValue: string;
  arrow: string;
};

const copy: Record<Locale, ContactCopy> = {
  en: {
    eyebrow: "Contact",
    lede: "Let's build something. The quickest way is email.",
    copy: "Copy",
    copied: "Copied",
    phone: "Phone",
    github: "GitHub",
    linkedin: "LinkedIn",
    basedIn: "Based in",
    basedInValue: "Damascus · UTC+3 · remote worldwide",
    arrow: "↗",
  },
  ar: {
    eyebrow: "تواصل",
    lede: "لنبنِ شيئًا معًا. أسرع طريقة هي البريد الإلكتروني.",
    copy: "نسخ",
    copied: "تم النسخ",
    phone: "الهاتف",
    github: "GitHub",
    linkedin: "LinkedIn",
    basedIn: "المقر",
    basedInValue: "دمشق · UTC+3 · عن بُعد من أي مكان",
    arrow: "↖",
  },
};

const linkedinShort = "in/abdallah-zagh";

/** Lets long URLs wrap after a slash (as in Figma) instead of in the middle of a word. */
const breakable = (value: string) => value.replace(/\//g, "/\u200b");

function CopyButton({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) {
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setTouched(true);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex h-10 shrink-0 items-center rounded-full border border-contact-line px-[17px] text-[14px] font-semibold leading-[18px] text-contact-ink transition-colors duration-[var(--duration-hover)] hover:border-contact-accent hover:text-contact-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contact-accent"
    >
      <span aria-live="polite">
        <span key={String(copied)} className={touched ? "swap-in" : undefined}>
          {copied ? doneLabel : label}
        </span>
      </span>
    </button>
  );
}

const rowClass =
  "group flex min-h-16 items-center gap-4 border-b border-contact-line py-1.5 transition-colors duration-[var(--duration-hover)]";
const kindClass = "w-20 shrink-0 text-[15px] font-medium leading-5 text-contact-muted lg:w-24";
const labelClass =
  "min-w-0 flex-1 text-[17px] leading-[26px] text-contact-ink [overflow-wrap:break-word] md:text-[18px] md:leading-[27px]";

function LinkRow({
  kind,
  href,
  external,
  arrow,
  children,
}: {
  kind: string;
  href: string;
  external?: boolean;
  arrow: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(rowClass, "hover:border-contact-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contact-accent")}
    >
      <span className={kindClass}>{kind}</span>
      {/* Latin text and numbers stay LTR inside RTL, aligned to the reading start */}
      <span dir="ltr" className={cn(labelClass, "transition-colors group-hover:text-contact-accent rtl:text-right")}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-[17px] leading-[26px] text-contact-muted transition-transform duration-[var(--duration-hover)] group-hover:-translate-y-0.5 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 md:text-[18px] md:leading-[27px]"
      >
        {arrow}
      </span>
    </a>
  );
}

export function ContactSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const github = socialLinks.find((link) => link.name === "GitHub");
  const linkedin = socialLinks.find((link) => link.name === "LinkedIn");

  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-20 md:pt-40">
      <Container>
        <div className="rounded-[28px] border border-contact-border bg-contact-bg px-6 py-10 sm:px-10 lg:px-14 lg:py-20">
          <div className="flex flex-col gap-4">
            <h2 id="contact-title" className="text-[15px] font-medium leading-5 text-contact-accent">
              {text.eyebrow}
            </h2>
            <p className="max-w-[444px] text-[20px] leading-9 text-contact-muted lg:max-w-none">{text.lede}</p>
            {/* The address is Latin, so this row stays left-to-right; in Arabic the button moves to the left edge as in Figma */}
            <div dir="ltr" className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-8 rtl:lg:flex-row-reverse rtl:lg:justify-end">
              <a
                href={`mailto:${site.email}`}
                className="min-w-0 text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-contact-ink transition-colors duration-[var(--duration-hover)] hover:text-contact-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-contact-accent sm:text-[44px] sm:leading-[48px] sm:tracking-[-0.03em] lg:text-[72px] lg:leading-[68px] lg:tracking-[-0.045em]"
              >
                {/* zero-width space lets the address wrap on very narrow screens */}
                {site.email.replace("@", "@\u200b")}
              </a>
              <CopyButton value={site.email} label={text.copy} doneLabel={text.copied} />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-10 pt-8 lg:grid lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col lg:justify-between">
              <LinkRow kind={text.phone} href={site.phoneHref} arrow={text.arrow}>
                {site.phone}
              </LinkRow>
              {github ? (
                <LinkRow kind={text.github} href={github.url} external arrow={text.arrow}>
                  {breakable(github.label)}
                </LinkRow>
              ) : null}
              {linkedin ? (
                <LinkRow kind={text.linkedin} href={linkedin.url} external arrow={text.arrow}>
                  <span className="sm:hidden">{linkedinShort}</span>
                  <span className="hidden sm:inline">{breakable(linkedin.label)}</span>
                </LinkRow>
              ) : null}
              <div className={rowClass}>
                <span className={kindClass}>{text.basedIn}</span>
                <span className={labelClass}>{text.basedInValue}</span>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
