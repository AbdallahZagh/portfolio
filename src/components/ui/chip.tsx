import * as React from "react";
import { cn } from "@/lib/utils";

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-[10px] bg-tint px-3 text-sm font-semibold text-brand-text transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "hover:bg-tint active:bg-chip-press",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-fg",
          className,
        )}
        {...props}
      />
    );
  },
);
Chip.displayName = "Chip";

export { Chip };
