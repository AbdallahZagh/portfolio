"use client";

import { useId, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { education, languages, skillChipGroups, type SkillChipGroup } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Chips visible before a group folds the rest behind "+N". */
const VISIBLE = 8;

type SkillsCopy = { title: string; aside: string; more: (count: number) => string; less: string };

const copy: Record<Locale, SkillsCopy> = {
  en: {
    title: "Skills",
    aside: "The stack behind production dashboards, builders and bilingual RTL products.",
    more: (count) => `+${count} more`,
    less: "Show less",
  },
  ar: {
    title: "المهارات",
    aside: "الحزمة التقنية وراء لوحات التحكم الإنتاجية وأدوات البناء والمنتجات ثنائية اللغة الداعمة لـ RTL.",
    more: (count) => `+${count} أخرى`,
    less: "عرض أقل",
  },
};

const chipClass =
  "inline-flex h-9 items-center rounded-full border border-line px-3.5 text-[15px] font-medium leading-5 text-ink";

function Group({ group, text }: { group: SkillChipGroup; text: SkillsCopy }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const items = group.items[locale];
  // Folding one or two chips behind a button saves nothing, so short overflows stay open.
  const folded = items.length - VISIBLE >= 3;
  const rest = folded ? items.length - VISIBLE : 0;

  return (
    <Reveal variant="plain" className="relative grid gap-3 py-6 lg:grid-cols-[312px_minmax(0,1fr)] lg:gap-6 lg:py-7">
      <span aria-hidden="true" className="reveal-line absolute inset-x-0 bottom-0 h-px bg-line" />
      <dt className="text-[16px] font-medium leading-6 text-muted lg:leading-9">{group.label[locale]}</dt>
      <dd>
        <ul id={regionId} className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <li
              key={item}
              // Folded chips stay in the page for search and screen readers once opened; until then they are hidden.
              hidden={folded && !open && index >= VISIBLE}
              className="reveal-item"
              style={{ "--i": index, "--step": "20ms" } as CSSProperties}
            >
              <bdi className={cn(chipClass)}>{item}</bdi>
            </li>
          ))}
          {rest > 0 ? (
            <li>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setOpen((value) => !value)}
                className={cn(
                  chipClass,
                  "relative border-transparent bg-tint text-brand-text after:absolute after:-inset-y-1 after:inset-x-0 after:content-[''] transition-colors duration-[var(--duration-hover)] hover:border-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                )}
              >
                {open ? text.less : text.more(rest)}
              </button>
            </li>
          ) : null}
        </ul>
      </dd>
    </Reveal>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[15px] font-medium leading-5 text-muted rtl:leading-6">{label}</dt>
      <dd className="text-[17px] leading-[26px] text-ink">{value}</dd>
    </div>
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
            <Group key={group.id} group={group} text={text} />
          ))}
        </dl>
        <dl className="grid gap-6 pt-8 md:grid-cols-2 md:gap-10">
          <Fact label={education.label[locale]} value={education.value[locale]} />
          <Fact label={languages.label[locale]} value={languages.value[locale]} />
        </dl>
      </Container>
    </section>
  );
}
