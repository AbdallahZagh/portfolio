"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";

/**
 * Scroll reveal, once. The content is always in the server HTML and fully visible without JavaScript.
 * After hydration, anything that starts below the fold is parked ("pending") and released the first
 * time 15% of it is on screen. Anything already on screen is never hidden, so nothing flashes.
 * The look of each variant lives in globals.css (`.reveal`, `[data-reveal]`, `.reveal-item`).
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.dataset.state === "in") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      el.dataset.state = "in";
      return;
    }
    el.dataset.state = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Two frames so the parked state has been painted once and the transition really runs.
        requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.state = "in")));
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

type RevealProps = {
  as?: ElementType;
  /** rise: 14px up + fade. start: slides in from the inline-start side. scale: grows from .96. clip: wipes open from the top. fade: opacity only. plain: the block itself stays put and only its .reveal-item / .reveal-line children animate. */
  variant?: "rise" | "soft" | "start" | "scale" | "clip" | "fade" | "plain";
  /** Milliseconds before this block starts, for staggering siblings. */
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, "style">;

export function Reveal({ as = "div", variant = "rise", delay = 0, className, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: ["reveal", className].filter(Boolean).join(" "),
      "data-reveal": variant,
      style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
      ...rest,
    },
    children,
  );
}
