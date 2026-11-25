"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export type PreviewContent = { kicker: string; title: string; text: string };

/** Figma motion: preview follows the cursor with lerp 0.14, scales 0.92 → 1 in 300ms. Desktop pointer only. */
const LERP = 0.14;
const OFFSET_X = 32;

export function ProjectPreview({
  content,
  visible,
  targetRef,
}: {
  /** Last hovered row, kept while the card fades out. */
  content: PreviewContent | null;
  visible: boolean;
  /** Latest pointer position, written by the list. */
  targetRef: RefObject<{ x: number; y: number }>;
}) {
  const mounted = useMounted();
  const reduced = useReducedMotion() ?? false;
  const elRef = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 0, y: 0, primed: false });

  useEffect(() => {
    const el = elRef.current;
    if (!el || !visible) {
      current.current.primed = false;
      return;
    }

    let frame = 0;
    const place = () => {
      const target = targetRef.current;
      const state = current.current;
      if (!state.primed || reduced) {
        state.x = target.x;
        state.y = target.y;
        state.primed = true;
      } else {
        state.x += (target.x - state.x) * LERP;
        state.y += (target.y - state.y) * LERP;
      }
      const rtl = document.documentElement.dir === "rtl";
      const x = rtl ? state.x - OFFSET_X - el.offsetWidth : state.x + OFFSET_X;
      const y = state.y - el.offsetHeight / 2;
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      frame = requestAnimationFrame(place);
    };
    frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, targetRef]);

  if (!mounted) return null;

  return (
    <div ref={elRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block">
      <div
        className={cn(
          "w-[320px] rounded-[14px] border border-line bg-surface p-4 shadow-[0_24px_48px_-24px_rgb(21_23_16/0.35)]",
          "transition-[opacity,transform] duration-[var(--duration-preview)] ease-[var(--ease-out-expo)]",
          reduced ? "duration-150" : visible ? "scale-100" : "scale-[0.92]",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="text-[14px] font-medium leading-[18px] text-muted">{content?.kicker}</p>
        <p className="mt-2 text-[22px] font-semibold leading-7 tracking-[-0.02em] text-ink rtl:tracking-normal">
          {content?.title}
        </p>
        <p className="mt-2 line-clamp-4 text-[15px] leading-[22px] text-muted">{content?.text}</p>
      </div>
    </div>
  );
}
