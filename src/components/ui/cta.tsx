import * as React from "react";
import { cn } from "@/lib/utils";

export interface CtaProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "md" | "lg";
  fullWidth?: boolean;
}

/**
 * Figma "CTA" component set: pill with a label and an arrow disc.
 * M = 137x44 with a 32px disc, L = 153x56 with a 40px disc.
 */
const Cta = React.forwardRef<HTMLAnchorElement, CtaProps>(
  ({ className, size = "md", fullWidth = false, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-between gap-3 rounded-full bg-brand text-[17px] font-semibold leading-5 text-on-brand",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "hover:bg-brand-hover active:bg-brand-press",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          size === "md" ? "h-11 ps-4 pe-2" : "h-14 ps-6 pe-2",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "grid shrink-0 place-items-center rounded-full bg-on-brand text-brand-text",
            size === "md" ? "size-8" : "size-10",
          )}
        >
          <span className="rtl:hidden">↗</span>
          <span className="hidden rtl:inline">↖</span>
        </span>
      </a>
    );
  },
);
Cta.displayName = "Cta";

export { Cta };
