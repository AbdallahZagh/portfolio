"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HeroCopy } from "../hero-copy";
import type { Size, WidgetId } from "./layout";
import {
  SCOPE_SAMPLES,
  formatClock,
  useCountUp,
  useReactor,
  useTelemetry,
  useTypingSignal,
  useWebVitals,
  usePrefersReducedMotion,
  useMounted,
  type TrailPoint,
} from "./use-live-data";

export type WidgetProps = {
  copy: HeroCopy;
  size: Size;
  dragging: boolean;
};

type Tone = "live" | "idle";

function Head({ title, status, tone }: { title: string; status: string; tone: Tone }) {
  return (
    <div className="flex h-4 items-center justify-between gap-2 pe-3.5 text-[12px] font-medium leading-4">
      <span className="truncate text-muted">{title}</span>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 whitespace-nowrap",
          tone === "live" ? "text-brand-text" : "text-muted",
        )}
      >
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", tone === "live" ? "bg-brand" : "bg-muted/60")}
        />
        {status}
      </span>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-[6px] bg-tint", className)} />;
}

// ---------------------------------------------------------------------------
// Message oscilloscope
// ---------------------------------------------------------------------------

function ScopeWidget({ copy, size }: WidgetProps) {
  const text = copy.widgets.scope;
  const signal = useTypingSignal();
  const compact = size.w < 4;

  const points = signal.samples
    .map((sample, index) => {
      const x = 4 + (index / (SCOPE_SAMPLES - 1)) * 456;
      const y = 23 - sample * 19;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const status =
    signal.status === "loading"
      ? copy.status.loading
      : signal.status === "user"
        ? copy.status.sending
        : signal.status === "demo"
          ? copy.status.typing
          : copy.status.noData;

  const caption =
    signal.status === "loading"
      ? text.warming
      : signal.status === "user"
        ? text.transmitting(signal.characters)
        : signal.status === "demo"
          ? text.sample
          : text.empty;

  return (
    <>
      <Head
        title={text.title}
        status={status}
        tone={signal.status === "demo" || signal.status === "user" ? "live" : "idle"}
      />
      <div className="mt-2 h-[46px] overflow-hidden rounded-[8px] bg-ink dark:bg-bg dark:ring-1 dark:ring-inset dark:ring-line">
        <svg
          viewBox="0 0 464 46"
          preserveAspectRatio="none"
          className="size-full"
          role="img"
          aria-label={text.title}
        >
          <g className="stroke-muted/70 dark:stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {[46, 93, 139, 186, 232, 278, 325, 371, 418].map((x) => (
              <line key={x} x1={x} x2={x} y1="4" y2="42" vectorEffect="non-scaling-stroke" />
            ))}
            {[12, 23, 35].map((y) => (
              <line key={y} x1="4" x2="460" y1={y} y2={y} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          {signal.status === "loading" ? null : (
            <polyline
              points={points}
              fill="none"
              className="stroke-tint dark:stroke-brand"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
      <p
        className={cn(
          "mt-2 truncate text-[12px] font-medium leading-4",
          signal.status === "demo" || signal.status === "user" ? "text-ink" : "text-muted",
        )}
      >
        {compact && signal.status === "demo" ? text.sample : caption}
      </p>
    </>
  );
}

// ---------------------------------------------------------------------------
// Visitor telemetry
// ---------------------------------------------------------------------------

const SAMPLE_PATH =
  "M26 88 C 40 72, 58 34, 96 40 C 130 46, 150 78, 128 66 C 108 56, 128 18, 160 30 C 176 36, 170 62, 150 64";

function trailToPath(trail: TrailPoint[]) {
  return trail
    .map((point, index) => `${index === 0 ? "M" : "L"}${(point.x * 214).toFixed(1)} ${(point.y * 98).toFixed(1)}`)
    .join(" ");
}

function PageOutline({ trail, dim }: { trail: TrailPoint[]; dim?: boolean }) {
  const live = trail.length > 1;
  const last = live ? trail[trail.length - 1] : { x: 124 / 214, y: 65 / 98 };

  return (
    <svg
      viewBox="0 0 214 98"
      className={cn("block h-[98px] w-full rounded-[6px] bg-surface", dim && "opacity-60")}
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="213" height="97" rx="5.5" className="fill-surface stroke-line" />
      <rect x="8" y="8" width="47" height="4" rx="2" className="fill-line" />
      <rect x="118" y="8" width="81" height="4" rx="2" className="fill-line" />
      <rect x="8" y="26" width="107" height="14" rx="2" className="fill-grid" />
      <rect x="8" y="47" width="133" height="3" rx="1.5" className="fill-grid" />
      <rect x="8" y="57" width="107" height="3" rx="1.5" className="fill-grid" />
      <rect x="8" y="67" width="81" height="3" rx="1.5" className="fill-grid" />
      <rect x="141" y="26" width="58" height="59" rx="3" className="fill-grid" />
      {dim ? null : (
        <>
          <path
            d={live ? trailToPath(trail) : SAMPLE_PATH}
            fill="none"
            className="stroke-brand"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 0 L0 11 L3 8 L5 13 L7 12 L5 7 L9 7 Z"
            transform={`translate(${(last.x * 214).toFixed(1)} ${(last.y * 98).toFixed(1)})`}
            className="fill-ink stroke-surface"
            strokeWidth="1"
          />
        </>
      )}
    </svg>
  );
}

function TelemetryWidget({ copy }: WidgetProps) {
  const text = copy.widgets.telemetry;
  const data = useTelemetry();
  const status =
    data.status === "loading" ? copy.status.loading : data.status === "live" ? copy.status.live : copy.status.noData;

  return (
    <>
      <Head title={text.title} status={status} tone={data.status === "live" ? "live" : "idle"} />
      <div className="mt-[5px]">
        <PageOutline trail={data.status === "live" ? data.trail : []} dim={data.status !== "live"} />
      </div>

      {data.status === "loading" ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : data.status === "nodata" ? (
        <div className="mt-3">
          <p className="text-[24px] font-semibold leading-8 text-ink">{text.noCursor}</p>
          <p className="mt-1 text-[13px] leading-[18px] text-muted">{text.noCursorHint}</p>
        </div>
      ) : (
        <>
          <p className="mt-2 flex items-baseline gap-2" dir="ltr">
            <span className="text-[34px] font-semibold leading-9 tabular-nums text-ink">
              {data.meters.toFixed(1)}
            </span>
            <span className="text-[12px] font-medium text-muted" dir="auto">
              {text.unit}
            </span>
          </p>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-[12px] font-medium leading-4">
            {[
              [text.scroll, `${data.scrollPerSecond}/s`],
              [text.onPage, formatClock(data.seconds)],
              [text.net, data.net],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="font-mono text-[13px] text-ink" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Stack tanks
// ---------------------------------------------------------------------------

function Tube({ value, empty, index = 0 }: { value: number | null; empty?: boolean; index?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block h-3 flex-1 rounded-full border bg-bg",
        empty ? "border-dashed border-line" : "border-line",
      )}
    >
      {value === null ? null : (
        <span
          className="tube-fill absolute inset-y-[2px] start-[2px] rounded-full bg-brand"
          style={{ width: `calc(${value}% - 4px)`, "--i": index } as React.CSSProperties}
        >
          <span className="absolute inset-x-1.5 top-[1px] h-px rounded-full bg-white/50" />
        </span>
      )}
    </span>
  );
}

const WAVE_PATH = "M0 8 Q 15 0 30 8 T 60 8 T 90 8 T 120 8 L 120 16 L 0 16 Z";

function Capsule({
  label,
  value,
  sloshing,
  reduced,
  loading,
  index,
}: {
  label: string;
  value: number;
  index: number;
  sloshing: boolean;
  reduced: boolean;
  loading: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div
        aria-hidden="true"
        className="relative w-full flex-1 overflow-hidden rounded-full border border-line bg-bg"
      >
        {loading ? null : (
          <div
            className="tank-fill absolute inset-x-0 bottom-0 bg-brand transition-[height] duration-[var(--duration-snap)] ease-[var(--ease-out-expo)]"
            style={{ height: `${value}%`, "--i": index } as React.CSSProperties}
          >
            <svg
              viewBox="0 0 120 16"
              preserveAspectRatio="none"
              className={cn(
                "tank-wave absolute -top-[7px] left-0 h-4 w-[200%] fill-brand",
                reduced && "hidden",
              )}
              style={{ ["--wave-speed" as string]: sloshing ? "0.9s" : "3.2s" } as React.CSSProperties}
            >
              <path d={WAVE_PATH} />
              <path d={WAVE_PATH} transform="translate(120 0)" />
            </svg>
            <span className="absolute bottom-3 start-[34%] size-1 rounded-full bg-white/50" />
            <span className="absolute bottom-6 end-[30%] size-[3px] rounded-full bg-white/40" />
          </div>
        )}
      </div>
      <span className="text-[12px] font-medium leading-4 text-muted">{label}</span>
    </div>
  );
}

function TanksWidget({ copy, size, dragging }: WidgetProps) {
  const text = copy.widgets.tanks;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const capsules = size.h > 1;

  const status = !mounted
    ? copy.status.loading
    : reduced
      ? copy.status.paused
      : dragging
        ? copy.status.sloshing
        : copy.status.physicsOn;

  return (
    <>
      <Head title={text.title} status={status} tone={mounted && !reduced ? "live" : "idle"} />
      {capsules ? (
        <div className="mt-2 flex min-h-0 flex-1 gap-2">
          {text.items.map((item, index) => (
            <Capsule
              key={item.label}
              index={index}
              label={item.short}
              value={item.value}
              sloshing={dragging}
              reduced={reduced}
              loading={!mounted}
            />
          ))}
        </div>
      ) : (
        <ul className="mt-2 space-y-1">
          {text.items.map((item, index) => (
            <li key={item.label} className="flex h-4 items-center gap-2 text-[12px] font-medium leading-4">
              <span className="w-[44px] shrink-0 truncate text-muted">{item.label}</span>
              <Tube value={mounted ? item.value : null} empty={!mounted} index={index} />
              <span className="w-9 shrink-0 text-end font-mono text-[13px] text-ink" dir="ltr">
                {mounted ? `${item.value}%` : "…"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Web vitals
// ---------------------------------------------------------------------------

function PassRing({ className, good }: { className?: string; good: boolean }) {
  return (
    <svg viewBox="0 0 34 34" className={cn("shrink-0", className)} aria-hidden="true">
      <circle cx="17" cy="17" r="14" fill="none" className="stroke-grid" strokeWidth="3" />
      <circle
        cx="17"
        cy="17"
        r="14"
        fill="none"
        className={good ? "stroke-brand" : "stroke-muted"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="17 5"
        transform="rotate(-80 17 17)"
      />
    </svg>
  );
}

function VitalsWidget({ copy, size }: WidgetProps) {
  const text = copy.widgets.vitals;
  const vitals = useWebVitals();
  const mini = size.w < 2;

  const lcp = vitals.lcp;
  const verdict = lcp === undefined ? "" : lcp <= 2.5 ? text.good : lcp <= 4 ? text.needsWork : text.poor;
  const good = lcp !== undefined && lcp <= 2.5;

  const status =
    vitals.status === "loading"
      ? copy.status.loading
      : vitals.status === "nodata"
        ? copy.status.noData
        : mini
          ? copy.status.live
          : copy.status.thisPage;

  const lcpShown = useCountUp(lcp, 900);
  const lcpValue = lcpShown === undefined ? "—" : `${lcpShown.toFixed(1)} s`;
  const cls = vitals.cls === undefined ? "—" : vitals.cls.toFixed(2);
  const inp = vitals.inp === undefined ? "—" : `${Math.round(vitals.inp)} ms`;

  const headline =
    vitals.status === "loading" ? (
      <p className="text-[13px] font-medium leading-5 text-muted">{text.measuring}</p>
    ) : (
      <p className={cn("font-semibold leading-7 text-ink", mini ? "text-[22px]" : "text-[24px]")} dir="ltr">
        {lcpValue}
      </p>
    );

  const sub =
    vitals.status === "loading"
      ? null
      : vitals.status === "nodata"
        ? text.notReported
        : mini
          ? verdict
          : `LCP · ${verdict}`;

  return (
    <>
      <Head
        title={mini ? text.mini : text.title}
        status={status}
        tone={vitals.status === "live" ? "live" : "idle"}
      />
      {mini ? (
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <PassRing className="size-6" good={good} />
            {headline}
          </div>
          <p className="text-[12px] font-medium leading-4 text-muted">
            <span>LCP</span>
            {sub ? <span className={cn("ms-1", good && "text-brand-text")}>{sub}</span> : null}
          </p>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PassRing className="size-[34px]" good={good} />
            <div>
              {headline}
              {sub ? (
                <p className={cn("text-[12px] font-medium leading-4", good ? "text-brand-text" : "text-muted")}>
                  {sub}
                </p>
              ) : null}
            </div>
          </div>
          <dl className="space-y-2 text-[12px] font-medium leading-4">
            {[
              ["CLS", cls],
              ["INP", inp],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-2">
                <dt className="w-7 text-muted">{label}</dt>
                <dd className="font-mono text-[13px] text-ink" dir="ltr">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Bug reactor
// ---------------------------------------------------------------------------

function Core({ pulsing, className }: { pulsing: boolean; className?: string }) {
  return (
    <m.svg
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      animate={pulsing ? { scale: [1, 1.07, 1] } : { scale: 1 }}
      transition={pulsing ? { duration: 0.42, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    >
      <circle cx="50" cy="50" r="48" fill="none" className="stroke-brand" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="39.5" fill="none" className="stroke-brand" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="31.5" fill="none" className="stroke-grid" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="23" fill="none" className="stroke-grid" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="20" className="fill-tint stroke-brand" strokeWidth="1.5" />
    </m.svg>
  );
}

function HeatScale({ hot }: { hot: boolean }) {
  return (
    <span className="flex h-1 w-[38px] gap-1" aria-hidden="true">
      <span className="h-1 w-2.5 rounded-full bg-tint" />
      <span className="h-1 w-2.5 rounded-full bg-brand" />
      <span className={cn("h-1 w-2.5 rounded-full", hot ? "bg-brand" : "bg-grid")} />
    </span>
  );
}

function ReactorWidget({ copy, size }: WidgetProps) {
  const text = copy.widgets.reactor;
  const reactor = useReactor();
  const mini = size.w < 2;
  const patching = reactor.status === "patching";
  const hot = reactor.temperature > 60;

  const status =
    reactor.status === "loading"
      ? copy.status.loading
      : reactor.status === "nodata"
        ? copy.status.noData
        : patching
          ? copy.status.patching
          : copy.status.stable;

  const temperature = reactor.status === "nodata" || reactor.status === "loading" ? "—" : `${reactor.temperature}°`;

  const bugLine =
    reactor.status === "nodata"
      ? copy.status.paused
      : reactor.status === "loading"
        ? text.starting
        : patching
          ? text.pulse(reactor.bugs)
          : text.stable(reactor.bugs);

  if (mini) {
    return (
      <>
        <Head
          title={text.mini}
          status={status}
          tone={reactor.status === "stable" || patching ? "live" : "idle"}
        />
        <button
          type="button"
          onClick={reactor.throwBug}
          disabled={reactor.status !== "stable"}
          aria-label={text.throw}
          className="mt-2 flex w-full items-center gap-2 rounded-[10px] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default"
        >
          <Core pulsing={patching} className="size-10" />
          <span className="text-[24px] font-semibold leading-7 text-ink" dir="ltr">
            {temperature}
          </span>
        </button>
        <p className="mt-1 text-[12px] font-medium leading-4 text-muted">
          {reactor.status === "nodata" ? copy.status.paused : reactor.status === "loading" ? text.starting : text.tap}
        </p>
      </>
    );
  }

  return (
    <>
      <Head
        title={text.title}
        status={status}
        tone={reactor.status === "stable" || patching ? "live" : "idle"}
      />
      <div className="mt-2 flex items-center gap-3">
        <Core pulsing={patching} className="size-[100px]" />
        <div className="min-w-0">
          <p className="text-[12px] font-medium leading-4 text-muted">{text.core}</p>
          <p className="text-[34px] font-semibold leading-9 tabular-nums text-ink" dir="ltr">
            {temperature}
          </p>
          <div className="mt-1">
            <HeatScale hot={hot} />
          </div>
          <p className="mt-1 text-[12px] font-medium leading-4 text-muted">{bugLine}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={reactor.throwBug}
        disabled={reactor.status !== "stable"}
        aria-busy={patching}
        className={cn(
          "mt-auto h-8 w-full rounded-full text-[12px] font-medium leading-4",
          "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          reactor.status === "nodata" || reactor.status === "loading"
            ? "bg-disabled-bg text-disabled-fg"
            : "bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-press",
        )}
      >
        {reactor.status === "nodata" ? text.reducedMotion : patching ? text.patching : text.throw}
      </button>
    </>
  );
}

export const WIDGETS: Record<WidgetId, (props: WidgetProps) => React.ReactElement> = {
  scope: ScopeWidget,
  telemetry: TelemetryWidget,
  tanks: TanksWidget,
  vitals: VitalsWidget,
  reactor: ReactorWidget,
};

export function widgetTitle(copy: HeroCopy, id: WidgetId) {
  const widgets = copy.widgets;
  return {
    scope: widgets.scope.title,
    telemetry: widgets.telemetry.title,
    tanks: widgets.tanks.title,
    vitals: widgets.vitals.title,
    reactor: widgets.reactor.title,
  }[id];
}
