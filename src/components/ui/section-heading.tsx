"use client";

import { useEffect, useRef } from "react";

/**
 * Figma "Section head": big title, short aside at the end, hairline underneath.
 * Heads that start below the fold settle 12px into place, once, when they first
 * scroll into view. The text is always visible; only its position changes.
 */
export function SectionHead({
  id,
  title,
  aside,
}: {
  id?: string;
  title: string;
  aside?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.dataset.settle === "done") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      el.dataset.settle = "done";
      el.style.transition = "none";
      return;
    }
    el.dataset.settle = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.settle = "done";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref} className="flex flex-col gap-3 border-b border-line pb-[25px] md:flex-row md:items-end md:justify-between md:gap-10">
      <h2
        id={id}
        className="text-[40px] leading-[44px] font-semibold tracking-[-0.04em] text-ink md:text-[56px] md:leading-[60px] lg:text-[72px] lg:leading-[75px] rtl:tracking-normal rtl:leading-[56px] rtl:md:leading-[78px] rtl:lg:leading-[94px]"
      >
        {title}
      </h2>
      {aside ? (
        <p className="text-start text-[17px] leading-[26px] text-muted md:max-w-[540px] md:text-[18px] md:leading-[27px]">
          {aside}
        </p>
      ) : null}
    </header>
  );
}