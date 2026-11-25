"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type MotionConflictKeys =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd";

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "ref" | MotionConflictKeys
  > {
  variant?: "primary" | "outline" | "on-deep" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
  target?: string;
  rel?: string;
  download?: string;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      asChild,
      children,
      target,
      rel,
      download,
      type,
      ...props
    },
    ref,
  ) => {
    const resolved = variant === "secondary" ? "primary" : variant;
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-full px-5 font-semibold leading-none transition-[color,background-color,border-color,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] active:scale-[0.98] motion-reduce:active:scale-100 disabled:pointer-events-none",
      focusRing,
      {
        "bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-press disabled:bg-disabled-bg disabled:text-disabled-fg":
          resolved === "primary",
        "border border-line bg-bg text-ink hover:border-ink active:border-ink active:bg-tint disabled:border-transparent disabled:bg-disabled-bg disabled:text-disabled-fg":
          resolved === "outline",
        "bg-on-deep text-brand hover:bg-on-deep-hover active:bg-on-deep-press disabled:bg-disabled-bg disabled:text-disabled-fg":
          resolved === "on-deep",
        "bg-transparent text-ink hover:bg-tint active:bg-chip-press disabled:text-disabled-fg":
          resolved === "ghost",
        "h-11 text-[15px]": size === "sm",
        "h-[52px] text-[17px]": size === "md",
        "h-14 text-[17px]": size === "lg",
      },
      className,
    );

    if (href || asChild) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          download={download}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} type={type ?? "button"} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
