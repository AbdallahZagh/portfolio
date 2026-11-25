"use client";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { CertificatePreview } from "@/features/experience/certificate-preview";
import { experiences } from "@/data/portfolio";

const copy: Record<
  Locale,
  { title: string; aside: string; certificate: string; dialog: string; close: string }
> = {
  en: {
    title: "Experience",
    aside:
      "Technical lead at Elathr Business, IoT and fire-safety platforms at Sama-Tech, Odoo ERP and web apps as a software developer, and frontend leadership at PawsPalConnect.",
    certificate: "Internship certificate",
    dialog: "Internship certificate",
    close: "Close",
  },
  ar: {
    title: "الخبرة",
    // AR? aside follows the CV facts (the Figma Arabic aside mentions "freelance", which the CV no longer says)
    aside:
      "قائد تقني في Elathr Business، ومنصات IoT والسلامة من الحرائق في Sama-Tech، وأنظمة Odoo ERP وتطبيقات ويب كمطوّر برمجيات، وقيادة الواجهات الأمامية في PawsPalConnect.",
    certificate: "شهادة التدريب",
    // AR? not in Figma
    dialog: "شهادة التدريب",
    close: "إغلاق",
  },
};

export function ExperienceSection() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section id="experience" aria-labelledby="experience-title" className="pt-20 md:pt-40">
      <Container>
        <SectionHead id="experience-title" title={text.title} aside={text.aside} />

        <ol>
          {experiences.map((job) => (
            <li
              key={job.id}
              className="grid gap-4 border-b border-line py-8 lg:grid-cols-[minmax(0,312fr)_minmax(0,424fr)_minmax(0,536fr)] lg:gap-6"
            >
              <p className="text-[16px] font-medium leading-5 text-muted rtl:leading-6">
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
                <ul className="flex list-disc flex-col gap-2 ps-[18px] marker:text-line">
                  {job.bullets[locale].map((bullet) => (
                    <li key={bullet} className="text-[17px] leading-[26px] text-muted">
                      {bullet}
                    </li>
                  ))}
                </ul>
                {job.certificate ? (
                  <CertificatePreview
                    src={job.certificate.src}
                    alt={job.certificate.alt}
                    label={text.certificate}
                    dialogTitle={text.dialog}
                    closeLabel={text.close}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
