"use client";

import { m, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { ExperienceBullets } from "@/features/experience/experience-bullets";
import { CertificatePreview } from "@/features/experience/certificate-preview";
import { experiences } from "@/data/portfolio";

const copy: Record<
  Locale,
  { title: string; aside: string; certificate: string; dialog: string; close: string; showAll: (count: number) => string; showLess: string }
> = {
  en: {
    title: "Experience",
    aside:
      "Technical lead at Elathr Business, IoT and fire-safety platforms at Sama-Tech, Odoo ERP and web apps as a freelance software developer, and frontend leadership at PawsPalConnect.",
    certificate: "Internship certificate",
    dialog: "Internship certificate",
    close: "Close",
    showAll: (count) => `Show all (${count})`,
    showLess: "Show less",
  },
  ar: {
    title: "الخبرة",
    aside:
      "قيادة تقنية في Elathr Business، ومنصات IoT والسلامة من الحرائق في Sama-Tech، ونظام Odoo ERP وتطبيقات ويب كمطوّر مستقل، وقيادة الواجهات الأمامية في PawsPalConnect.",
    certificate: "شهادة التدريب",
    dialog: "شهادة إتمام التدريب",
    close: "إغلاق",
    showAll: (count) => `عرض الكل (${count})`,
    showLess: "عرض أقل",
  },
};

export function ExperienceSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });

  return (
    <section id="experience" aria-labelledby="experience-title" className="pt-20 md:pt-40">
      <Container>
        <SectionHead id="experience-title" title={text.title} aside={text.aside} />

        <div ref={listRef} className="relative">
          {/* Scroll-linked timeline: a hairline at the start edge that fills as the list scrolls past. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -start-3 hidden w-px bg-line min-[1100px]:block">
            <m.span
              className="absolute inset-x-0 top-0 h-full origin-top bg-brand"
              style={{ scaleY: reduce ? 1 : progress }}
            />
          </span>
        <ol>
          {experiences.map((job) => (
            <Reveal
              as="li"
              key={job.id}
              className="grid gap-4 border-b border-line py-8 lg:grid-cols-[minmax(0,312fr)_minmax(0,424fr)_minmax(0,536fr)] lg:gap-6"
            >
              <p className="reveal-start text-[16px] font-medium leading-5 text-muted rtl:leading-6">
                {job.period[locale]}
              </p>

              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink rtl:leading-[34px] rtl:tracking-normal lg:text-[28px] lg:leading-[34px] rtl:lg:leading-[42px]">
                  {job.title[locale]}
                </h3>
                {job.company ? (
                  <p className="text-[17px] font-medium leading-[22px] text-brand-text rtl:leading-[26px]">
                    {job.company[locale]}
                  </p>
                ) : null}
                <ul className="flex flex-wrap gap-2">
                  {job.tags[locale].map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-w-0 flex-col items-start gap-4">
                <ExperienceBullets bullets={job.bullets[locale]} showAll={text.showAll} showLess={text.showLess} />
                {job.certificate ? (
                  <CertificatePreview
                    src={job.certificate.src}
                    alt={job.certificate.alt[locale]}
                    label={text.certificate}
                    dialogTitle={text.dialog}
                    closeLabel={text.close}
                  />
                ) : null}
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </Container>
    </section>
  );
}
