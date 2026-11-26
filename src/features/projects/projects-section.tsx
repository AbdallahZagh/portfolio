"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHead } from "@/components/ui/section-heading";
import { useLocale, type Locale } from "@/components/locale-provider";
import { featuredProject, projectRows, type ProjectRow } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { NovaGallery } from "@/features/projects/nova-gallery";
import { ProjectPreview, type PreviewContent } from "@/features/projects/project-preview";

const copy: Record<
  Locale,
  {
    title: string;
    aside: string;
    demo: string;
    github: string;
    gallery: string;
    whatItDoes: string;
    whatIBuilt: string;
    stack: string;
  }
> = {
  en: {
    title: "Projects",
    aside:
      "Led by Nova, built solo across web, mobile, Windows and API, plus a university ERP on Odoo, the Figma MCP Bridge, the clinic dashboards and an e-commerce frontend.",
    demo: "Live demo",
    github: "GitHub",
    gallery: "Nova screenshots",
    whatItDoes: "What it does",
    whatIBuilt: "What I built",
    stack: "Stack",
  },
  ar: {
    title: "المشاريع",
    aside:
      "يتصدّرها Nova الذي بنيتُه بمفردي للويب والجوال وWindows وAPI، إضافةً إلى نظام ERP جامعي على Odoo وFigma MCP Bridge وأعمال سابقة في لوحات العيادات والتجارة الإلكترونية.",
    demo: "عرض مباشر",
    github: "GitHub",
    gallery: "لقطات شاشة من Nova",
    whatItDoes: "ما يفعله",
    whatIBuilt: "ما بنيتُه",
    stack: "التقنيات",
  },
};

function ExternalArrow() {
  return <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" strokeWidth={2} />;
}

function FeaturedProject({ text }: { text: (typeof copy)[Locale] }) {
  const { locale } = useLocale();
  const project = featuredProject;

  return (
    <article className="grid items-center gap-6 border-b border-line py-8 lg:grid-cols-[648px_minmax(0,1fr)] lg:gap-6 lg:py-14">
      <Reveal variant="soft" className="min-w-0 overflow-visible">
        <NovaGallery
          main={project.image}
          left={project.sideImages.left}
          right={project.sideImages.right}
          label={text.gallery}
        />
      </Reveal>

      <div className="flex min-w-0 flex-col items-start gap-4">
        <p className="text-[16px] font-medium leading-5 text-muted rtl:leading-6">{project.kicker[locale]}</p>
        <h3 className="text-[32px] font-semibold leading-[34px] tracking-[-0.03em] text-ink rtl:leading-[48px] rtl:tracking-normal lg:text-[48px] lg:leading-[50px] rtl:lg:leading-[68px]">
          {project.title[locale]}
        </h3>
        <p className="max-w-[560px] text-[17px] leading-[26px] text-muted lg:text-[18px] lg:leading-[27px]">
          {project.description[locale]}
        </p>
        <ul className="flex max-w-[560px] list-disc flex-col gap-2 ps-[18px] marker:text-line">
          {project.bullets[locale].map((bullet) => (
            <li key={bullet} className="text-[16px] leading-6 text-muted">
              {bullet}
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <Button
            href={project.demoHref}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            aria-label={`${text.demo}: Nova`}
          >
            {text.demo}
            <ExternalArrow />
          </Button>
        </div>
      </div>
    </article>
  );
}

function BulletGroup({ heading, items }: { heading?: string; items: string[] }) {
  return (
    <div className="flex max-w-[680px] flex-col gap-3">
      {heading ? (
        <p className="text-[14px] font-medium uppercase leading-[18px] tracking-[0.08em] text-brand-text rtl:normal-case rtl:tracking-normal">
          {heading}
        </p>
      ) : null}
      <ul className="flex list-disc flex-col gap-2 ps-[18px] marker:text-line">
        {items.map((item) => (
          <li key={item} className="text-[17px] leading-[26px] text-muted">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({
  row,
  open,
  onToggle,
  githubLabel,
  labels,
  delay = 0,
}: {
  row: ProjectRow;
  open: boolean;
  onToggle: () => void;
  githubLabel: string;
  labels: { whatItDoes: string; whatIBuilt: string; stack: string };
  delay?: number;
}) {
  const { locale } = useLocale();
  const panelId = useId();

  return (
    <Reveal as="li" delay={delay} className="border-b border-line">
      <button
        type="button"
        data-project-row={row.id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "group relative flex min-h-14 w-full cursor-pointer flex-col gap-2 rounded-lg px-4 py-5 pe-12 text-start",
          "transition-[padding,background-color] duration-[var(--duration-row-indent)] ease-[var(--ease-standard)]",
          "active:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "lg:flex-row lg:items-center lg:gap-0 lg:py-8 lg:hover:ps-6 lg:aria-expanded:ps-6 motion-reduce:lg:hover:ps-4 motion-reduce:lg:aria-expanded:ps-4",
        )}
      >
        <span className="hidden w-20 shrink-0 text-[18px] leading-[27px] text-muted lg:block">{row.index}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span
            className={cn(
              "text-[32px] font-semibold leading-[34px] tracking-[-0.03em] text-ink rtl:leading-[48px] rtl:tracking-normal",
              "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
              "group-hover:text-brand-text group-aria-expanded:text-brand-text",
              "lg:text-[48px] lg:leading-[53px] rtl:lg:leading-[68px]",
            )}
          >
            {row.title[locale]}
          </span>
          {row.tags ? (
            <span className="text-[15px] leading-[22px] text-muted">
              {labels.stack} · <bdi>{row.tags.join(" · ")}</bdi>
            </span>
          ) : null}
        </span>
        <span className="text-[15px] font-medium leading-5 text-muted lg:hidden">
          {row.index} · {row.category[locale]}
        </span>
        <span className="hidden w-[240px] shrink-0 text-end text-[18px] leading-[27px] text-muted lg:block">
          {row.category[locale]}
        </span>
        <ArrowUpRight
          aria-hidden
          strokeWidth={2}
          className="absolute end-4 top-6 size-6 text-muted transition-[translate,color] duration-[var(--duration-hover)] ease-[var(--ease-standard)] group-hover:-translate-y-0.5 group-hover:text-brand-text group-aria-expanded:text-brand-text rtl:-scale-x-100 lg:top-1/2 lg:-mt-3 motion-reduce:transition-none"
        />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-[var(--duration-morph)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-start gap-5 px-4 pb-8 lg:ps-[120px] lg:pe-4">
            {row.description ? (
              <p className="max-w-[680px] text-[18px] leading-[27px] text-ink">{row.description[locale]}</p>
            ) : null}
            <BulletGroup
              heading={row.contribution ? labels.whatItDoes : undefined}
              items={row.bullets[locale]}
            />
            {row.contribution ? (
              <BulletGroup heading={labels.whatIBuilt} items={row.contribution[locale]} />
            ) : null}
            {row.href ? (
              <Button href={row.href} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                {githubLabel}
                <ExternalArrow />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ProjectsSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const [openId, setOpenId] = useState<string | null>(null);
  /** Row currently under the mouse, resolved by hit-testing so scrolling can never leave it stale. */
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  /** Last hovered row, kept so the card keeps its text while it fades out. */
  const [lastId, setLastId] = useState<string | null>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });

  const resolve = useCallback(() => {
    const { x, y, active } = pointer.current;
    const hit = active ? document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-project-row]") : null;
    const id = hit?.dataset.projectRow ?? null;
    setHoveredId((current) => (current === id ? current : id));
    if (id) setLastId((current) => (current === id ? current : id));
  }, []);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(resolve);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = { x: event.clientX, y: event.clientY, active: true };
      schedule();
    };
    const onLeave = () => {
      pointer.current.active = false;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [resolve]);

  const preview = useMemo<PreviewContent | null>(() => {
    const row = projectRows.find((item) => item.id === lastId);
    if (!row) return null;
    return {
      kicker: `${row.index} · ${row.category[locale]}`,
      title: row.title[locale],
      // First sentence of the description when there is one, else the first bullet.
      text: row.description
        ? (row.description[locale].split(/(?<=\.)\s/)[0] ?? "")
        : (row.bullets[locale][0] ?? ""),
    };
  }, [lastId, locale]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-[88px] py-14 md:py-20">
      <Container>
        <SectionHead id="projects-title" title={text.title} aside={text.aside} />
        <FeaturedProject text={text} />
        <ul>
          {projectRows.map((row, index) => (
            <Row
              key={row.id}
              delay={index * 60}
              row={row}
              open={openId === row.id}
              onToggle={() => setOpenId((current) => (current === row.id ? null : row.id))}
              githubLabel={text.github}
              labels={text}
            />
          ))}
        </ul>
      </Container>
      <ProjectPreview
        content={preview}
        visible={hoveredId !== null && openId !== hoveredId}
        targetRef={pointer}
      />
    </section>
  );
}
