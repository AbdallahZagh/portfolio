"use client";

import { type CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { skillChipGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type SkillsCopy = { title: string; aside: string };

const copy: Record<Locale, SkillsCopy> = {
  en: {
    title: "Skills",
    aside: "The stack behind production dashboards, builders and bilingual RTL products.",
  },
  ar: {
    title: "المهارات",
    aside: "التقنيات التي أعتمد عليها في لوحات التحكم الإنتاجية وأدوات البناء والمنتجات ثنائية اللغة ذات الاتجاه من اليمين إلى اليسار.",
  },
};

const chipClass =
  "inline-flex min-h-9 items-center rounded-[18px] border border-line px-3.5 py-1.5 text-[15px] font-medium leading-5 text-ink";

/** One labelled row of skill chips. */
function ChipRow({ label, items }: { label: string; items: string[] }) {
  return (
    <Reveal variant="plain" className="relative grid gap-3 py-6 lg:grid-cols-[312px_minmax(0,1fr)] lg:gap-6 lg:py-7">
      <span aria-hidden="true" className="reveal-line absolute inset-x-0 bottom-0 h-px bg-line" />
      <dt className="text-[16px] font-medium leading-6 text-muted lg:leading-9">{label}</dt>
      <dd className="min-w-0">
        <ul className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li key={item} className="reveal-item min-w-0" style={{ "--i": index, "--step": "20ms" } as CSSProperties}>
              <bdi className={cn(chipClass)}>{item}</bdi>
            </li>
          ))}
        </ul>
      </dd>
    </Reveal>
  );
}
export function SkillsSection() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-[88px] py-14 md:py-20">
      <Container>
        <SectionHead id="skills-title" title={text.title} aside={text.aside} />
        <dl>
          {skillChipGroups.map((group) => (
            <ChipRow key={group.id} label={group.label[locale]} items={group.items[locale]} />
          ))}
        </dl>
      </Container>
    </section>
  );
}
