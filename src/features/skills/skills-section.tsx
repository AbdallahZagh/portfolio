"use client";

import { Container } from "@/components/ui/container";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { education, languages, skillGroups } from "@/data/portfolio";

const copy: Record<Locale, { title: string; aside: string }> = {
  en: {
    title: "Skills",
    aside: "The stack behind production dashboards, builders and bilingual RTL products.",
  },
  ar: {
    title: "المهارات",
    aside: "الحزمة التقنية وراء لوحات التحكم الإنتاجية والمنشئات والمنتجات ثنائية اللغة RTL.",
  },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-line py-5 lg:grid-cols-[312px_minmax(0,1fr)] lg:gap-6 lg:py-6">
      <dt className="text-[16px] font-medium leading-6 text-muted lg:leading-7">{label}</dt>
      <dd className="text-[18px] leading-[27px] text-ink lg:text-[20px] lg:leading-7">{children}</dd>
    </div>
  );
}

export function SkillsSection() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section id="skills" aria-labelledby="skills-title" className="pt-20 md:pt-40">
      <Container>
        <SectionHead id="skills-title" title={text.title} aside={text.aside} />
        <dl>
          {skillGroups.map((group) => (
            <Row key={group.id} label={group.label[locale]}>
              {/* Latin tool names stay LTR inside RTL text */}
              <span dir="ltr" className="block rtl:text-right">
                {group.items.join(" · ")}
              </span>
            </Row>
          ))}
          <Row label={education.label[locale]}>{education.value[locale]}</Row>
          <Row label={languages.label[locale]}>{languages.value[locale]}</Row>
        </dl>
      </Container>
    </section>
  );
}
