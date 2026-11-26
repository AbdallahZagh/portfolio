"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/** Bullets shown before the "Show all" toggle on phones. Wider screens always show every bullet. */
const PREVIEW_COUNT = 3;

type Props = {
  bullets: string[];
  showAll: (count: number) => string;
  showLess: string;
};

export function ExperienceBullets({ bullets, showAll, showLess }: Props) {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const head = bullets.slice(0, PREVIEW_COUNT);
  const rest = bullets.slice(PREVIEW_COUNT);

  const itemClass = "text-[17px] leading-[26px] text-muted";
  const listClass = "flex list-disc flex-col gap-2 ps-[18px] marker:text-line";

  return (
    <div className="flex w-full min-w-0 flex-col items-start">
      <ul className={cn(listClass, "w-full")}>
        {head.map((bullet) => (
          <li key={bullet} className={itemClass}>
            {bullet}
          </li>
        ))}
      </ul>

      {rest.length > 0 ? (
        <>
          {/* Collapsed on phones only: height eases open and the hidden bullets leave the tab order. */}
          <div
            id={extraId}
            className={cn(
              "grid w-full transition-[grid-template-rows,visibility] duration-[var(--duration-morph)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
              expanded ? "grid-rows-[1fr]" : "max-md:invisible max-md:grid-rows-[0fr]",
            )}
          >
            <ul className={cn(listClass, "min-h-0 overflow-hidden pt-2")}>
              {rest.map((bullet) => (
                <li key={bullet} className={itemClass}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={extraId}
            onClick={() => setExpanded((value) => !value)}
            className="mt-1 inline-flex min-h-11 items-center text-[16px] font-semibold leading-6 text-brand-text underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
          >
            {expanded ? showLess : showAll(rest.length + PREVIEW_COUNT)}
          </button>
        </>
      ) : null}
    </div>
  );
}
