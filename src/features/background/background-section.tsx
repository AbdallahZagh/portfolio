"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { education, languages } from "@/data/portfolio";

const copy: Record<Locale, { title: string }> = {
  en: { title: "Education & Languages" },
  ar: { title: "التعليم واللغات" },
};

const cardClass = "flex flex-col rounded-[14px] border border-line bg-surface p-6 md:p-8";
const labelClass = "text-[14px] font-medium uppercase leading-[18px] tracking-[0.08em] text-brand-text rtl:normal-case rtl:tracking-normal";

/** Education and languages sit in their own section, on cards, so they do not read as more skill rows. */
export function BackgroundSection() {
  const { locale } = useLocale();

  return (
    <section id="background" aria-labelledby="background-title" className="scroll-mt-[88px] py-14 md:py-20">
      <Container>
        <SectionHead id="background-title" title={copy[locale].title} />
        <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-2">
          <Reveal variant="rise" className={cardClass}>
            <p className={labelClass}>{education.label[locale]}</p>
            <h3 className="mt-5 text-[24px] font-semibold leading-8 text-ink rtl:leading-[40px] md:text-[28px] md:leading-9 rtl:md:leading-[46px]">
              {education.degree[locale]}
            </h3>
            <p className="mt-3 text-[18px] leading-7 text-muted">{education.school[locale]}</p>
            <p className="mt-auto pt-8 font-mono text-[15px] leading-6 text-muted rtl:font-sans">
              <bdi>{education.date[locale]}</bdi>
            </p>
          </Reveal>

          <Reveal variant="rise" delay={80} className={cardClass}>
            <p className={labelClass}>{languages.label[locale]}</p>
            <ul className="mt-5">
              {languages.items.map((item) => (
                <li
                  key={item.name.en}
                  className="flex items-baseline justify-between gap-4 border-t border-line py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="text-[24px] font-semibold leading-8 text-ink rtl:leading-[40px] md:text-[28px] md:leading-9 rtl:md:leading-[46px]">
                    {item.name[locale]}
                  </span>
                  <span className="text-end text-[17px] leading-7 text-muted">
                    <bdi>{item.level[locale]}</bdi>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
