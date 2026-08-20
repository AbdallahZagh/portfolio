"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { projects } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <section id="projects" className="border-b border-border py-16 md:py-24">
      <Reveal className="page-wrap">
        <SectionHeading
          title="Projects"
          aside="Led by Nova — a Linear-style task platform across web, Expo, and NestJS — plus clinic, HR, and commerce systems."
        />

        <div className="divide-y divide-border">
          {projects.map((project) => (
            <RevealItem
              as="article"
              key={project.name}
              className="grid gap-4 py-10 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10"
            >
              <p className="pt-1 text-sm text-muted">{project.year}</p>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-primary">
                  {project.role} · {project.category}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {project.description}
                </p>
                {project.highlights?.length ? (
                  <ul className="mt-4 max-w-2xl space-y-2.5 text-sm leading-relaxed text-muted md:text-base">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-4 text-sm text-foreground/80">
                  {project.tools.join(" · ")}
                </p>
                {project.demo ? (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live demo
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
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
