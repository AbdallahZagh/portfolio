"use client";

import { useSyncExternalStore } from "react";

/** True after hydration. Server and first client render both see `false`. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
