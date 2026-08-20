"use client";

import { CertificatePreview } from "@/features/experience/certificate-preview";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { experiences } from "@/data/portfolio";

export function ExperienceSection() {
  return (
    <section id="experience" className="border-b border-border py-16 md:py-24">
      <Reveal className="page-wrap">
        <SectionHeading
          title="Work Experience"
          aside="IoT dashboards and marketing sites at Sama-Tech, freelance product work, and frontend leadership at PawsPalConnect."
        />

        <div className="divide-y divide-border">
          {experiences.map((exp) => (
            <RevealItem
              as="article"
              key={`${exp.company}-${exp.period}`}
              className="grid gap-4 py-10 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10"
            >
              <p className="pt-1 text-sm text-muted">{exp.period}</p>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  {exp.title}
                </h3>
                <p className="mt-1 text-primary">
                  {exp.company} · {exp.location}
                </p>
                <p className="mt-3 text-sm text-muted">{exp.tags.join(" · ")}</p>
                <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-muted md:text-base">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                {exp.certificate ? (
                  <div className="mt-6 max-w-lg">
                    <CertificatePreview
                      src={exp.certificate.src}
                      alt={exp.certificate.alt}
                    />
                  </div>
                ) : null}
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
