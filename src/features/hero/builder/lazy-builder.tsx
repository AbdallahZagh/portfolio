"use client";

import dynamic from "next/dynamic";
import { useMatchMedia } from "./use-live-data";

/**
 * The builder (drag engine, 8 widgets, live data hooks) is the heaviest part of the page and only exists
 * from 1024px up, so its code is fetched on demand and never on phones. The placeholder keeps the column
 * the same height while it loads, so nothing below the hero jumps.
 */
const DashboardBuilder = dynamic(() => import("./dashboard-builder").then((module) => module.DashboardBuilder), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="liquid-glass-pill h-[624px] w-full max-w-[840px] rounded-[24px] xl:ms-auto xl:max-w-[600px]"
    />
  ),
});

export function LazyBuilder({ className }: { className?: string }) {
  const desktop = useMatchMedia("(min-width: 1024px)", true);
  return desktop ? <DashboardBuilder className={className} /> : null;
}
