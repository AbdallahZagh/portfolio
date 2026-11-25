import * as React from "react";
import { cn } from "@/lib/utils";

export interface NavPillLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

/**
 * Figma "Nav pill link": 44px tall, 16px side padding, 16px Medium label.
 * Active uses the glass-active token (white 70% light, white 12% dark).
 */
const NavPillLink = React.forwardRef<HTMLAnchorElement, NavPillLinkProps>(
  ({ className, active = false, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={active ? "true" : undefined}
        className={cn(
          "inline-flex h-11 items-center rounded-full px-4 text-[16px] font-medium leading-5",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          active ? "bg-glass-active text-ink" : "text-muted hover:text-ink",
          className,
        )}
        {...props}
      />
    );
  },
);
NavPillLink.displayName = "NavPillLink";

export { NavPillLink };
