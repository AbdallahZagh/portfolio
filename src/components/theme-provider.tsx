"use client";

import * as React from "react";
import { LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** The animation engine (layout + gestures) arrives in its own chunk after first paint instead of blocking it. */
const loadMotionFeatures = () => import("framer-motion").then((module) => module.domMax);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="data-theme" {...props}>
      <LazyMotion features={loadMotionFeatures}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </NextThemesProvider>
  );
}
