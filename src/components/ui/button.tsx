import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
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
      ...props
    },
    ref 
  ) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-full font-display font-medium tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary hover:bg-primary/90 text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_55px_rgba(0,0,0,0.35)] hover:-translate-y-0.5":
          variant === "primary",
        "border border-primary/70 text-primary bg-background/80 hover:bg-primary/10":
          variant === "outline",
        "bg-secondary/15 text-secondary hover:bg-secondary/25":
          variant === "secondary",
        "bg-transparent text-foreground/80 hover:bg-card/70": variant === "ghost",
        "h-8 px-4 text-xs md:text-sm": size === "sm",
        "h-11 px-6 text-sm md:text-base": size === "md",
        "h-13 px-8 text-base md:text-lg": size === "lg",
      },
      className
    );

    if (href || asChild) {
      return (
        <a
          href={href}
          className={baseClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button className={baseClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
