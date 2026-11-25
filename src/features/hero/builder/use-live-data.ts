"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { useMounted } from "@/lib/use-mounted";

export { useMounted };

export function useMatchMedia(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function usePrefersReducedMotion() {
  return useReducedMotion() ?? false;
}

// ---------------------------------------------------------------------------
// Visitor telemetry: real cursor travel, scroll speed, time on page, connection.
// ---------------------------------------------------------------------------

export type TrailPoint = { x: number; y: number };

export type Telemetry = {
  status: "loading" | "live" | "nodata";
  meters: number;
  scrollPerSecond: number;
  seconds: number;
  net: string;
  trail: TrailPoint[];
};

const METERS_PER_PX = 0.000264583; // 1 CSS px = 1/96 inch
const TRAIL_LENGTH = 70;

export function useTelemetry(): Telemetry {
  const mounted = useMounted();
  const hasPointer = useMatchMedia("(hover: hover) and (pointer: fine)", true);
  const distance = useRef(0);
  const last = useRef<TrailPoint | null>(null);
  const trail = useRef<TrailPoint[]>([]);
  const lastScroll = useRef(0);
  const scrollSpeed = useRef(0);
  const startedAt = useRef(0);
  const [snapshot, setSnapshot] = useState<Omit<Telemetry, "status">>({
    meters: 0,
    scrollPerSecond: 0,
    seconds: 0,
    net: "—",
    trail: [],
  });

  useEffect(() => {
    startedAt.current = performance.now();
    lastScroll.current = window.scrollY;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const point = { x: event.clientX, y: event.clientY };
      if (last.current) {
        distance.current += Math.hypot(point.x - last.current.x, point.y - last.current.y);
      }
      last.current = point;
      trail.current.push({ x: point.x / window.innerWidth, y: point.y / window.innerHeight });
      if (trail.current.length > TRAIL_LENGTH) trail.current.shift();
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    const interval = window.setInterval(() => {
      const now = window.scrollY;
      const raw = Math.abs(now - lastScroll.current) / 0.2;
      lastScroll.current = now;
      scrollSpeed.current = scrollSpeed.current * 0.5 + raw * 0.5;

      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
        .connection;

      setSnapshot({
        meters: distance.current * METERS_PER_PX,
        scrollPerSecond: Math.round(scrollSpeed.current),
        seconds: Math.floor((performance.now() - startedAt.current) / 1000),
        net: connection?.effectiveType ?? "—",
        trail: trail.current.slice(),
      });
    }, 200);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(interval);
    };
  }, []);

  const status: Telemetry["status"] = !mounted ? "loading" : hasPointer ? "live" : "nodata";
  return { status, ...snapshot };
}

export function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Web vitals: this page's real LCP, CLS and INP from PerformanceObserver.
// ---------------------------------------------------------------------------

export type Vitals = {
  status: "loading" | "live" | "nodata";
  lcp?: number;
  cls?: number;
  inp?: number;
};

type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };
type EventTimingEntry = PerformanceEntry & { interactionId?: number; duration: number };

export function useWebVitals(): Vitals {
  const [vitals, setVitals] = useState<Vitals>({ status: "loading" });

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      const frame = requestAnimationFrame(() => setVitals({ status: "nodata" }));
      return () => cancelAnimationFrame(frame);
    }

    const supported = PerformanceObserver.supportedEntryTypes ?? [];
    if (!supported.includes("largest-contentful-paint")) {
      const frame = requestAnimationFrame(() => setVitals({ status: "nodata" }));
      return () => cancelAnimationFrame(frame);
    }

    let lcp: number | undefined;
    let cls = 0;
    let inp: number | undefined;
    const observers: PerformanceObserver[] = [];

    const publish = () =>
      setVitals({
        status: lcp === undefined ? "loading" : "live",
        lcp,
        cls: supported.includes("layout-shift") ? cls : undefined,
        inp,
      });

    const observe = (type: string, onEntries: (entries: PerformanceEntry[]) => void, options = {}) => {
      if (!supported.includes(type)) return;
      const observer = new PerformanceObserver((list) => {
        onEntries(list.getEntries());
        publish();
      });
      observer.observe({ type, buffered: true, ...options } as PerformanceObserverInit);
      observers.push(observer);
    };

    observe("largest-contentful-paint", (entries) => {
      const entry = entries[entries.length - 1];
      if (entry) lcp = entry.startTime / 1000;
    });
    observe("layout-shift", (entries) => {
      for (const entry of entries as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    });
    observe(
      "event",
      (entries) => {
        for (const entry of entries as EventTimingEntry[]) {
          if (entry.interactionId && (inp === undefined || entry.duration > inp)) inp = entry.duration;
        }
      },
      { durationThreshold: 16 },
    );

    const timeout = window.setTimeout(() => {
      if (lcp === undefined) setVitals({ status: "nodata" });
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return vitals;
}

// ---------------------------------------------------------------------------
// Message oscilloscope: plays a sample message, switches to the visitor's own typing.
// ---------------------------------------------------------------------------

export const SCOPE_SAMPLES = 64;

export type Signal = {
  status: "loading" | "demo" | "user" | "nodata";
  samples: number[];
  characters: number;
};

const IDLE_AFTER_MS = 2200;

function isTextField(target: EventTarget | null): target is HTMLInputElement | HTMLTextAreaElement {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

export function useTypingSignal(): Signal {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const energy = useRef(0);
  const lastTyped = useRef(0);
  const characters = useRef(0);
  const buffer = useRef<number[]>(Array.from({ length: SCOPE_SAMPLES }, () => 0));
  const [signal, setSignal] = useState<Signal>({
    status: "loading",
    samples: Array.from({ length: SCOPE_SAMPLES }, () => 0),
    characters: 0,
  });

  useEffect(() => {
    const onInput = (event: Event) => {
      if (!isTextField(event.target)) return;
      lastTyped.current = performance.now();
      characters.current = event.target.value.length;
      energy.current = Math.min(1, energy.current + 0.55);
    };
    document.addEventListener("input", onInput, true);

    let nextDemoKey = 0;
    const interval = window.setInterval(() => {
      const now = performance.now();
      const typing = now - lastTyped.current < IDLE_AFTER_MS;

      if (!typing && !reduced && now >= nextDemoKey) {
        energy.current = Math.min(1, energy.current + 0.45 + Math.random() * 0.25);
        nextDemoKey = now + 90 + Math.random() * 160;
      }

      energy.current *= 0.82;
      const amplitude = Math.max(typing || !reduced ? 0.06 : 0, energy.current);
      const sample = (Math.random() * 2 - 1) * amplitude;
      buffer.current.push(sample);
      if (buffer.current.length > SCOPE_SAMPLES) buffer.current.shift();

      const status: Signal["status"] = typing ? "user" : reduced ? "nodata" : "demo";
      setSignal({ status, samples: buffer.current.slice(), characters: characters.current });
    }, 70);

    return () => {
      document.removeEventListener("input", onInput, true);
      window.clearInterval(interval);
    };
  }, [reduced]);

  if (!mounted) return { ...signal, status: "loading" };
  return signal;
}

// ---------------------------------------------------------------------------
// Bug reactor: throw a bug, the core heats up, then it is patched.
// ---------------------------------------------------------------------------

export const CORE_IDLE = 36;
export const CORE_HOT = 92;

export type Reactor = {
  status: "loading" | "stable" | "patching" | "nodata";
  temperature: number;
  bugs: number;
  throwBug: () => void;
};

export function useReactor(): Reactor {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState({ temperature: CORE_IDLE, bugs: 0, patching: false });
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const throwBug = useCallback(() => {
    if (reduced) return;
    setState((current) => {
      if (current.patching) return current;
      return { temperature: CORE_HOT, bugs: 3, patching: true };
    });

    const cool = (temperature: number) => {
      timers.current.push(
        window.setTimeout(() => {
          const next = Math.max(CORE_IDLE, temperature - 8);
          setState((current) => ({ ...current, temperature: next }));
          if (next > CORE_IDLE) cool(next);
        }, 70),
      );
    };

    timers.current.push(
      window.setTimeout(() => {
        setState({ temperature: CORE_HOT, bugs: 0, patching: false });
        cool(CORE_HOT);
      }, 2200),
    );
  }, [reduced]);

  const status: Reactor["status"] = !mounted
    ? "loading"
    : reduced
      ? "nodata"
      : state.patching
        ? "patching"
        : "stable";

  return { status, temperature: state.temperature, bugs: state.bugs, throwBug };
}
