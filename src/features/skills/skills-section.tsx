"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { education, languages, skillGroups } from "@/data/portfolio";

export function SkillsSection() {
  return (
    <section id="skills" className="border-b border-border py-16 md:py-24">
      <Reveal className="page-wrap">
        <SectionHeading
          title="Skills"
          aside="Frontend, motion, backend, and mobile — the stack behind production dashboards, marketing sites, and Nova."
        />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <RevealItem key={group.title}>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {group.skills.join(" · ")}
              </p>
            </RevealItem>
          ))}
        </div>

        <div className="mt-16 grid gap-12 border-t border-border pt-12 md:grid-cols-2">
          <RevealItem>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Academic History
            </h3>
            <p className="mt-3 text-sm text-muted">{education.date}</p>
            <p className="mt-1 font-medium">{education.degree}</p>
            <p className="mt-1 text-sm text-muted">{education.institution}</p>
          </RevealItem>
          <RevealItem>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Languages
            </h3>
            <ul className="mt-3 space-y-2">
              {languages.map((language) => (
                <li
                  key={language.name}
                  className="flex items-baseline justify-between gap-4 text-sm md:justify-start md:gap-8"
                >
                  <span className="font-medium">{language.name}</span>
                  <span className="text-muted">{language.level}</span>
                </li>
              ))}
            </ul>
          </RevealItem>
        </div>
      </Reveal>
    </section>
  );
}
