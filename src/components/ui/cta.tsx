import * as React from "react";
import { cn } from "@/lib/utils";

export interface CtaProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `responsive` is M on mobile and L from the sm breakpoint up (Figma hero). */
  size?: "sm" | "md" | "lg" | "responsive";
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
          "transition-[color,background-color,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "hover:bg-brand-hover active:scale-[0.98] active:bg-brand-press motion-reduce:active:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          // sm is 36px tall to look light in the bar; the ::after stretches the hit area to 44px.
          size === "sm" &&
            "relative h-9 ps-3.5 pe-1.5 text-[15px] after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
          size === "md" && "h-11 ps-4 pe-2",
          size === "lg" && "h-14 ps-6 pe-2",
          size === "responsive" && "h-11 ps-4 pe-2 md:h-14 md:ps-6",
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
            size === "sm" && "size-6 text-[13px]",
            size === "md" && "size-8",
            size === "lg" && "size-10",
            size === "responsive" && "size-8 md:size-10",
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
