import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  error,
  tone = "surface",
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  tone?: "surface" | "on-deep";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-[17px] leading-none",
          tone === "on-deep" ? "text-on-deep" : "text-ink",
        )}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          className={cn(
            "text-[17px] leading-snug",
            tone === "on-deep" ? "text-error-on-deep" : "text-brand-text",
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
