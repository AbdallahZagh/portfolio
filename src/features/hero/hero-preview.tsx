"use client";

import type { CSSProperties } from "react";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { useLocale, type Locale } from "@/components/locale-provider";
import { featuredProject } from "@/data/portfolio";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

const copy: Record<
  Locale,
  { label: string; pitch: string; view: string; stats: { value: string; label: string }[] }
> = {
  en: {
    label: "Featured project",
    pitch: "A task and collaboration platform I designed and built solo, across web, mobile, Windows and API.",
    view: "View project",
    stats: [
      { value: "4+", label: "years building" },
      { value: "EN + AR", label: "bilingual, RTL" },
      { value: "20+", label: "IoT modules shipped" },
    ],
  },
  ar: {
    label: "مشروع مميّز",
    pitch: "منصة للمهام والتعاون صمّمتُها وبنيتُها بمفردي للويب والجوال وWindows وAPI.",
    view: "عرض المشروع",
    stats: [
      { value: "4+", label: "سنوات من الخبرة" },
      { value: "EN + AR", label: "ثنائي اللغة، RTL" },
      { value: "20+", label: "وحدة IoT منجزة" },
    ],
  },
};

/**
 * Phones and tablets get this in place of the dashboard builder: one clear project card and three
 * facts. The builder needs a mouse and room, so it only appears from 1024px.
 */
export function HeroPreview({ className }: { className?: string }) {
  const { locale } = useLocale();
  const text = copy[locale];
  const project = featuredProject;
  const Arrow = locale === "ar" ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className={cn("flex w-full max-w-[640px] flex-col gap-4", className)}>
      <a
        href="#projects"
        className="hero-rise group block overflow-hidden rounded-[18px] border border-line bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        style={{ "--at": "280ms" } as CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath */}
        <img
          src={publicAsset(project.image.src)}
          alt={project.image.alt[locale]}
          width={project.image.width}
          height={project.image.height}
          decoding="sync"
          fetchPriority="high"
          draggable={false}
          className="block aspect-[1248/672] w-full object-cover"
        />
        <div className="flex flex-col gap-3 p-4">
          <p className="text-[13px] font-medium leading-4 text-muted">{text.label}</p>
          <h2 className="text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink rtl:leading-9 rtl:tracking-normal">
            {project.title[locale]}
          </h2>
          <p className="text-[16px] leading-6 text-muted">{text.pitch}</p>
          <span className="inline-flex h-11 items-center gap-2 self-start text-[16px] font-semibold text-brand-text">
            {text.view}
            <Arrow aria-hidden="true" className="size-4" strokeWidth={2} />
          </span>
        </div>
      </a>

      <dl
        className="hero-rise grid grid-cols-3 divide-x divide-line rounded-[14px] border border-line rtl:divide-x-reverse"
        style={{ "--at": "640ms" } as CSSProperties}
      >
        {text.stats.map((stat) => (
          <div key={stat.value} className="flex flex-col gap-1 px-3 py-4 text-center">
            <dt className="order-2 text-[12px] font-medium leading-4 text-muted">{stat.label}</dt>
            <dd className="text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink">
              <bdi dir="ltr">{stat.value}</bdi>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
