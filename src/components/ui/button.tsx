"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { magneticSpring } from "@/lib/animation-variants";
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
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
  target?: string;
  rel?: string;
  download?: string;
}

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
      ...props
    },
    ref
  ) => {
    const scaleOnHover = variant === "primary" || variant === "secondary";
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-xl font-display font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary text-primary-foreground hover:brightness-110":
          variant === "primary",
        "border border-border bg-transparent text-foreground transition-colors duration-200 hover:border-primary hover:bg-surface hover:text-primary":
          variant === "outline",
        "bg-secondary text-secondary-foreground hover:brightness-110":
          variant === "secondary",
        "bg-transparent text-foreground/80 transition-colors duration-200 hover:bg-surface hover:text-foreground":
          variant === "ghost",
        "h-9 px-3.5 text-sm": size === "sm",
        "h-11 px-5 text-sm md:text-base": size === "md",
        "h-12 px-6 text-base": size === "lg",
      },
      className
    );

    const motionProps = (
      scaleOnHover
        ? {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            transition: magneticSpring,
          }
        : {
            whileTap: { scale: 0.99 },
            transition: { duration: 0.15 },
          }
    ) satisfies Pick<
      HTMLMotionProps<"button">,
      "whileHover" | "whileTap" | "transition"
    >;

    if (href || asChild) {
      return (
        <motion.a
          href={href}
          target={target}
          rel={rel}
          download={download}
          className={baseClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...motionProps}
          {...(props as HTMLMotionProps<"a">)}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button
        className={baseClasses}
        ref={ref}
        {...motionProps}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
