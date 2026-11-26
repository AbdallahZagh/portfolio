"use client";

import { m, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
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
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-[88px] py-14 md:py-20">
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
          {experiences.map((job, jobIndex) => (
            <Reveal
              as="li"
              key={job.id}
              className="border-b border-line py-8"
            >
              <div className="lg:grid lg:grid-cols-[minmax(0,312fr)_minmax(0,424fr)_minmax(0,536fr)] lg:items-start lg:gap-6">
              {/* Date and title stay pinned while this role's bullets scroll past. One block on phones; two columns from lg. */}
              <div className="sticky top-[84px] z-10 flex flex-col gap-4 bg-bg lg:contents">
              <p className="reveal-start text-[16px] font-medium leading-5 text-muted lg:sticky lg:top-[96px] lg:z-10 lg:self-start lg:bg-bg rtl:leading-6">
                {job.period[locale]}
              </p>

              <div className="flex min-w-0 flex-col gap-2 lg:sticky lg:top-[96px] lg:z-10 lg:self-start lg:bg-bg">
                <h3 className="text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink rtl:leading-[34px] rtl:tracking-normal lg:text-[28px] lg:leading-[34px] rtl:lg:leading-[42px]">
                  {job.title[locale]}
                </h3>
                {job.company ? (
                  <p className="text-[17px] font-medium leading-[22px] text-brand-text rtl:leading-[26px]">
                    {job.company[locale]}
                  </p>
                ) : null}
                <ul className={cn("flex flex-wrap gap-2", jobIndex >= 3 && "max-md:hidden")}>
                  {job.tags[locale].map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              </div>

              <div className="mt-4 flex min-w-0 flex-col items-start gap-4 lg:mt-0">
                <ExperienceBullets
                  bullets={job.bullets[locale]}
                  showAll={text.showAll}
                  showLess={text.showLess}
                  // Older roles open as title, dates and a single line on phones.
                  previewCount={jobIndex >= 3 ? 1 : 2}
                />
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
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </Container>
    </section>
  );
}
