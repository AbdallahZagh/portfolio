"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      disabled={disabled || !mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-11 w-16 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed",
        className,
      )}
    >
      <span className="flex h-8 w-14 items-center rounded-full bg-tint px-1">
        <span
          className={cn(
            "size-6 rounded-full bg-brand transition-transform duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
            isDark ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}
