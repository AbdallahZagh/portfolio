"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpLeft, ArrowUpRight, Check, Copy, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { ltr, site, socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type ContactCopy = {
  title: string;
  aside: string;
  chip: string;
  headline: string;
  copy: string;
  copied: string;
  copyLabel: string;
  formTitle: string;
  phone: string;
  location: string;
  locationValue: string;
};

const copy: Record<Locale, ContactCopy> = {
  en: {
    title: "Contact",
    aside: "Open to remote roles worldwide. Write here or reach me directly.",
    chip: "Available for worldwide remote roles",
    headline: "Let's build something together.",
    copy: "Copy",
    copied: "Copied",
    copyLabel: "Copy email address",
    formTitle: "Send a message",
    phone: "Phone",
    location: "Based in",
    locationValue: "Damascus · UTC+3",
  },
  ar: {
    title: "تواصل",
    aside: "متاح لفرص العمل عن بُعد حول العالم. اكتب لي هنا أو راسلني مباشرة.",
    chip: "متاح لفرص العمل عن بُعد حول العالم",
    headline: "لنبنِ شيئًا معًا.",
    copy: "نسخ",
    copied: "تم النسخ",
    copyLabel: "نسخ عنوان البريد",
    formTitle: "أرسل رسالة",
    phone: "الهاتف",
    location: "الموقع",
    locationValue: `دمشق · ${ltr("UTC+3")}`,
  },
};

/** Short, readable handles for the list; the full URLs stay on the links. */
const handles: Record<string, string> = { LinkedIn: "abdallah-zagh", GitHub: "AbdallahZagh" };

const hoverEase = "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]";

/** Copy the address; `copied` stays true for two seconds so the button can confirm it. */
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

/** One line of the contact list: icon, label, value, hairline underneath. */
function Row({
  icon,
  label,
  value,
  href,
  external,
  arrow,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  arrow?: ReactNode;
}) {
  const body = (
    <>
      <span className="flex items-center gap-3 text-[16px] font-medium leading-6 text-muted">
        <span aria-hidden="true" className="grid size-5 place-items-center">
          {icon}
        </span>
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-2 text-[17px] font-medium leading-6 text-ink">
        <bdi dir="ltr" className="truncate whitespace-nowrap">
          {value}
        </bdi>
        {arrow}
      </span>
    </>
  );
  const rowClass = "flex min-h-14 items-center justify-between gap-4 border-b border-line py-3";

  if (!href) return <li className={rowClass}>{body}</li>;
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          rowClass,
          hoverEase,
          "group hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {body}
      </a>
    </li>
  );
}

export function ContactSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;
  const { copied, copyEmail } = useCopyEmail();
  const profiles = ["LinkedIn", "GitHub"].map((name) => socialLinks.find((link) => link.name === name)).filter((link) => link !== undefined);

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[88px] py-14 md:py-20">
      <Container>
        <SectionHead id="contact-title" title={text.title} aside={text.aside} />

        <div className="grid gap-x-12 gap-y-10 pt-10 lg:grid-cols-12 lg:pt-14">
          {/* Who and how: availability, headline, the address with a one-tap copy. */}
          <Reveal className="flex flex-col items-start gap-6 lg:col-span-5 lg:self-start">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium leading-5 text-ink">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              {text.chip}
            </p>

            <h3 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink rtl:leading-[1.5] rtl:tracking-normal md:text-[40px]">
              {text.headline}
            </h3>

            <div className="flex w-full flex-col items-start gap-3">
              <a
                href={`mailto:${site.email}`}
                dir="ltr"
                className={cn(
                  "max-w-full break-all text-[22px] font-semibold leading-8 tracking-[-0.01em] text-brand-text underline decoration-line decoration-2 underline-offset-[6px] min-[420px]:text-[26px] md:text-[30px] md:leading-10 lg:text-[24px] xl:text-[30px]",
                  hoverEase,
                  "hover:decoration-brand focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                )}
              >
                {site.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={text.copyLabel}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[15px] font-semibold leading-5 text-ink",
                  "after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']",
                  "transition-[background-color,border-color,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-brand hover:bg-tint active:scale-[0.97] motion-reduce:active:scale-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                )}
              >
                {copied ? (
                  <Check className="size-4 text-brand-text" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                <span>{copied ? text.copied : text.copy}</span>
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? text.copied : ""}
              </span>
            </div>
          </Reveal>

          {/* The form is always on the page; on phones it follows the address, on desktop it sits beside it. */}
          <Reveal
            className="rounded-[24px] border border-line bg-surface p-5 min-[375px]:p-6 md:p-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:p-10"
            delay={80}
          >
            <h3 className="mb-6 text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink rtl:leading-9 rtl:tracking-normal">
              {text.formTitle}
            </h3>
            <ContactForm />
          </Reveal>

          <Reveal className="lg:col-span-5 lg:self-end" delay={60}>
            <ul className="border-t border-line">
              {profiles.map((link) => (
                <Row
                  key={link.name}
                  icon={<link.icon className="size-5" strokeWidth={1.75} />}
                  label={link.name}
                  value={handles[link.name] ?? link.name}
                  href={link.url}
                  external
                  arrow={
                    <Arrow
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted transition-transform duration-[var(--duration-hover)] group-hover:-translate-y-0.5 group-hover:text-brand-text motion-reduce:transition-none"
                      strokeWidth={2}
                    />
                  }
                />
              ))}
              <Row
                icon={<Phone className="size-5" strokeWidth={1.75} />}
                label={text.phone}
                value={site.phone}
                href={site.phoneHref}
              />
              <Row
                icon={<MapPin className="size-5" strokeWidth={1.75} />}
                label={text.location}
                value={text.locationValue}
              />
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
