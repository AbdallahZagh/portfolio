import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glass?: boolean;
}

/**
 * 44x44 round button with a 20px icon (Figma "Theme button", "Menu button", "Close button").
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, glass = false, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-full p-0 leading-none text-ink",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "disabled:pointer-events-none disabled:text-disabled-fg",
          glass ? "liquid-glass-pill" : "hover:bg-glass-fill active:bg-glass-active",
          className,
        )}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton };
