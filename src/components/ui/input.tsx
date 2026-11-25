import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tone?: "surface" | "on-deep";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, tone = "surface", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[52px] w-full rounded-[12px] border px-4 text-[18px] outline-none transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          tone === "on-deep"
            ? "border-field-line bg-field text-on-deep placeholder:text-on-deep placeholder:opacity-70 focus-visible:ring-offset-deep disabled:bg-disabled-bg disabled:text-disabled-fg aria-invalid:border-error-on-deep"
            : "border-line bg-surface text-ink placeholder:text-muted focus-visible:ring-offset-bg disabled:bg-disabled-bg disabled:text-disabled-fg aria-invalid:border-brand",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
