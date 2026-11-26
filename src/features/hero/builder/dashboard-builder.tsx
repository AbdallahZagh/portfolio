"use client";

import {
  memo,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { GripVertical, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/locale-provider";
import { heroCopy, type HeroCopy } from "../hero-copy";
import {
  CELL_H,
  CELL_W,
  COLS,
  DEFAULT_LAYOUT,
  INSET,
  MIN_ROWS,
  SIZES,
  itemAt,
  moveByKey,
  moveTo,
  nearestSize,
  resizeTo,
  rowsOf,
  sameLayout,
  stepSize,
  type Direction,
  type Item,
  type Size,
  type WidgetId,
} from "./layout";
import { WIDGETS, widgetTitle } from "./widgets";
import { useMatchMedia, usePrefersReducedMotion } from "./use-live-data";

const ARROWS: Record<string, Direction> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

const WidgetBody = memo(function WidgetBody({
  id,
  copy,
  size,
  dragging,
}: {
  id: WidgetId;
  copy: HeroCopy;
  size: Size;
  dragging: boolean;
}) {
  const Widget = WIDGETS[id];
  return <Widget copy={copy} size={size} dragging={dragging} />;
}, (a, b) => a.id === b.id && a.copy === b.copy && a.dragging === b.dragging && a.size.w === b.size.w && a.size.h === b.size.h);

// Widgets are translucent glass cards (see .glass-card). Only the panel around them blurs.
const cardClass =
  "glass-card group/card relative flex select-none flex-col overflow-hidden rounded-[12px] border p-3 outline-none " +
  "hover:border-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function GripHandle({
  label,
  className,
  ...props
}: { label: string; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-handle=""
      aria-hidden="true"
      title={label}
      className={cn(
        "absolute end-0.5 top-1 z-10 grid h-8 w-7 cursor-grab touch-none place-items-center text-muted",
        "opacity-0 transition-opacity duration-[var(--duration-hover)] group-hover/card:opacity-100 group-focus-visible/card:opacity-100",
        "[@media(pointer:coarse)]:opacity-100 active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      <GripVertical className="size-3.5" aria-hidden="true" />
    </span>
  );
}

function HintChip({ icon, className, children }: { icon: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full border border-line px-2 text-[12px] font-medium leading-4",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function ResizeGlyph() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 rtl:-scale-x-100" aria-hidden="true">
      <path d="M11 4 4 11M11 8 8 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Desktop / tablet: 4 x N grid, drag to swap, corner to resize.
// ---------------------------------------------------------------------------

type Gesture =
  | { kind: "drag"; id: WidgetId; startX: number; startY: number; active: boolean }
  | { kind: "resize"; id: WidgetId; startX: number; startY: number; active: boolean };

function GridBoard({
  items,
  setItems,
  copy,
  isRtl,
  announce,
  minRows,
  onGrow,
  onFit,
  canResize,
}: {
  items: Item[];
  setItems: (next: Item[]) => void;
  copy: HeroCopy;
  isRtl: boolean;
  announce: (message: string) => void;
  minRows: number;
  onGrow: (rows: number) => void;
  onFit: (rows: number) => void;
  canResize: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const reduced = usePrefersReducedMotion();
  const hintId = useId();
  const [drag, setDrag] = useState<{ id: WidgetId; dx: number; dy: number; overId?: WidgetId } | null>(null);
  const [resize, setResize] = useState<{ id: WidgetId; size: Size; px: { w: number; h: number } } | null>(null);

  const layout = resize ? resizeTo(items, resize.id, resize.size) : items;
  // While dragging or resizing the board holds its height (no jumping); on drop it fits the layout.
  const rows = Math.max(minRows, rowsOf(layout));

  // Cards are placed with percentages (a column is a quarter of the board), so the first paint is
  // already the final layout at any width. Pixel maths below reads the live board width instead.
  const startOf = (x: number) => `calc(${x} * ${100 / COLS}% + ${INSET}px)`;
  const widthOf = (w: number) => `calc(${w} * ${100 / COLS}% - ${INSET * 2}px)`;
  const topOf = (item: Item) => item.y * CELL_H + INSET;
  const heightOf = (size: Size) => size.h * CELL_H - INSET * 2;

  const boardWidth = () => gridRef.current?.clientWidth ?? COLS * CELL_W;

  const pointerInGrid = (event: { clientX: number; clientY: number }) => {
    const grid = gridRef.current;
    if (!grid) return { x: 0, y: 0 };
    const rect = grid.getBoundingClientRect();
    return { x: event.clientX - rect.left - grid.clientLeft, y: event.clientY - rect.top - grid.clientTop };
  };

  const cellAt = (point: { x: number; y: number }) => {
    const cellW = boardWidth() / COLS;
    const rawCol = Math.floor(point.x / cellW);
    const col = Math.max(0, Math.min(COLS - 1, isRtl ? COLS - 1 - rawCol : rawCol));
    const row = Math.max(0, Math.floor(point.y / CELL_H));
    return { col, row };
  };

  const begin = (event: ReactPointerEvent<HTMLElement>, item: Item) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    const onResize = canResize && Boolean(target.closest("[data-resize]"));
    const onHandle = Boolean(target.closest("[data-handle]"));
    const interactive = Boolean(target.closest("button, a, input, textarea, select"));

    if (onResize) {
      gesture.current = { kind: "resize", id: item.id, startX: event.clientX, startY: event.clientY, active: false };
    } else if (onHandle || (!interactive && event.pointerType !== "touch")) {
      gesture.current = { kind: "drag", id: item.id, startX: event.clientX, startY: event.clientY, active: false };
    } else {
      return;
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is best effort; the gesture still works while the pointer stays over the card.
    }
  };

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    const current = gesture.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.active) {
      if (Math.hypot(dx, dy) < 4) return;
      current.active = true;
    }

    const item = items.find((candidate) => candidate.id === current.id);
    if (!item) return;
    const point = pointerInGrid(event);

    if (current.kind === "drag") {
      const { col, row } = cellAt(point);
      const over = itemAt(items, col, row, current.id);
      setDrag({ id: current.id, dx, dy, overId: over?.id });
    } else {
      const width = boardWidth();
      const cellW = width / COLS;
      const wantedW = isRtl ? (width - point.x) / cellW - item.x : point.x / cellW - item.x;
      const wantedH = (point.y - item.y * CELL_H) / CELL_H;
      const size = nearestSize(item.id, item.x, { w: wantedW, h: wantedH });

      // Raw pixel size follows the pointer, clamped to what this widget can be.
      const options = SIZES[item.id];
      const fitting = options.filter((option) => item.x + option.w <= COLS);
      const widths = (fitting.length > 0 ? fitting : options).map((option) => option.w);
      const minW = Math.min(...widths) * cellW - INSET * 2;
      const maxW = Math.max(...widths) * cellW - INSET * 2;
      const minH = Math.min(...options.map((option) => option.h)) * CELL_H - INSET * 2;
      const maxH = Math.max(...options.map((option) => option.h)) * CELL_H - INSET * 2;
      const inlineStart = item.x * cellW + INSET;
      const rawW = (isRtl ? width - point.x : point.x) - inlineStart;
      const rawH = point.y - topOf(item);
      const px = {
        w: Math.max(minW, Math.min(maxW, rawW)),
        h: Math.max(minH, Math.min(maxH, rawH)),
      };

      onGrow(rowsOf(resizeTo(items, item.id, size)));
      setResize({ id: item.id, size, px });
    }
  };

  const finish = (event: ReactPointerEvent<HTMLElement>, cancelled = false) => {
    const current = gesture.current;
    gesture.current = null;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Nothing to release.
    }
    if (!current || !current.active) {
      setDrag(null);
      setResize(null);
      return;
    }

    let committed = items;
    if (current.kind === "drag" && !cancelled) {
      const { col, row } = cellAt(pointerInGrid(event));
      const next = moveTo(items, current.id, col, row);
      if (!sameLayout(next, items)) {
        committed = next;
        setItems(next);
        announce(`${widgetTitle(copy, current.id)}: ${copy.builder.moved}`);
      }
    } else if (current.kind === "resize" && !cancelled && resize) {
      const next = resizeTo(items, resize.id, resize.size);
      if (!sameLayout(next, items)) {
        committed = next;
        setItems(next);
        announce(`${widgetTitle(copy, resize.id)}: ${copy.builder.resized} ${resize.size.w} × ${resize.size.h}`);
      }
    }
    onFit(rowsOf(committed));
    setDrag(null);
    setResize(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, item: Item) => {
    if (event.target !== event.currentTarget) return;
    const direction = ARROWS[event.key];
    if (!direction) return;
    event.preventDefault();
    if (event.shiftKey && !canResize) return;
    const key = isRtl && (direction === "left" || direction === "right")
      ? (direction === "left" ? "right" : "left")
      : direction;
    const next = event.shiftKey ? stepSize(items, item.id, key) : moveByKey(items, item.id, key);
    if (!sameLayout(next, items)) {
      onFit(rowsOf(next));
      setItems(next);
      announce(`${widgetTitle(copy, item.id)}: ${event.shiftKey ? copy.builder.resized : copy.builder.moved}`);
    }
  };

  const draggedItem = drag ? items.find((item) => item.id === drag.id) : undefined;
  const resizeItem = resize ? items.find((item) => item.id === resize.id) : undefined;

  return (
    <div
      ref={gridRef}
      className="relative w-full overflow-hidden rounded-[12px] border border-line"
      style={{ height: rows * CELL_H + 2 }}
    >
      <p id={hintId} className="sr-only">
        {copy.builder.moveHint}
      </p>

      {[1, 2, 3].map((index) => (
        <span
          key={`v${index}`}
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-grid"
          style={{ insetInlineStart: `${index * 25}%` }}
        />
      ))}
      {Array.from({ length: rows - 1 }, (_, index) => (
        <span
          key={`h${index}`}
          aria-hidden="true"
          className="absolute inset-x-0 h-px bg-grid"
          style={{ top: (index + 1) * CELL_H }}
        />
      ))}

      {draggedItem ? (
        <div
          aria-hidden="true"
          className="absolute rounded-[10px] border border-dashed border-ink/30 bg-ink/[0.04]"
          style={{
            insetInlineStart: startOf(draggedItem.x),
            top: topOf(draggedItem),
            width: widthOf(draggedItem.w),
            height: heightOf(draggedItem),
          }}
        />
      ) : null}

      {resize && resizeItem ? (
        <div
          aria-hidden="true"
          className="absolute flex items-end justify-end rounded-[10px] border-2 border-dashed border-brand/70 bg-tint/70 p-3"
          style={{
            insetInlineStart: startOf(resizeItem.x),
            top: topOf(resizeItem),
            width: widthOf(resize.size.w),
            height: heightOf(resize.size),
          }}
        >
          <span className="text-[12px] font-medium leading-4 text-brand-text" dir="ltr">
            {resize.size.w} × {resize.size.h}
          </span>
        </div>
      ) : null}

      {layout.map((item, order) => {
        const size: Size = { w: item.w, h: item.h };
        const isDragging = drag?.id === item.id;
        const isResizing = resize?.id === item.id;
        const live = isResizing && resize ? resize : null;
        const isTarget = drag?.overId === item.id;
        const resizable = canResize && SIZES[item.id].length > 1;
        const following = isDragging || isResizing;

        return (
          <div
            key={item.id}
            role="group"
            tabIndex={0}
            aria-label={widgetTitle(copy, item.id)}
            aria-describedby={hintId}
            className={cn(
              cardClass,
              "hero-widget absolute",
              // Cards glide to their cell; while one is held it follows the pointer with no easing.
              following
                ? "transition-[border-color] duration-150"
                : "transition-[inset-inline-start,top,width,height,transform,border-color] duration-[420ms] ease-[var(--ease-spring-snap)]",
              isDragging && "z-30 cursor-grabbing border-ink shadow-[0_18px_40px_-12px_rgb(21_23_16/0.35)]",
              isResizing && "border-brand",
              isTarget && "border-brand ring-2 ring-brand/40",
            )}
            style={{
              insetInlineStart: startOf(item.x),
              top: topOf(item),
              width: live ? live.px.w : widthOf(item.w),
              height: live ? live.px.h : heightOf(size),
              transform:
                isDragging && drag
                  ? `translate(${drag.dx}px, ${drag.dy}px)${reduced ? "" : " rotate(1.4deg) scale(1.02)"}`
                  : "none",
              zIndex: isDragging ? 30 : isResizing ? 20 : 1,
              touchAction: "pan-y",
              "--i": order,
            } as CSSProperties}
            onPointerDown={(event) => begin(event, item)}
            onPointerMove={move}
            onPointerUp={(event) => finish(event)}
            onLostPointerCapture={(event) => {
              if (gesture.current) finish(event, true);
            }}
            onPointerCancel={(event) => finish(event, true)}
            onKeyDown={(event) => onKeyDown(event, item)}
          >
            <GripHandle label={copy.builder.handle} />
            <WidgetBody id={item.id} copy={copy} size={size} dragging={isDragging} />
            {resizable ? (
              <span
                data-resize=""
                role="presentation"
                title={copy.builder.resize}
                className={cn(
                  "absolute bottom-0 end-0 z-10 grid size-8 touch-none place-items-end p-1.5 text-muted",
                  "cursor-nwse-resize rtl:cursor-nesw-resize",
                  "opacity-0 transition-opacity duration-[var(--duration-hover)] group-hover/card:opacity-100 group-focus-visible/card:opacity-100",
                  "[@media(pointer:coarse)]:opacity-100",
                  isResizing && "text-brand-text opacity-100",
                )}
              >
                <ResizeGlyph />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function BuilderPanel({ className }: { className?: string }) {
  const { locale, isRtl } = useLocale();
  const copy = heroCopy[locale];
  // Resizing needs a fine pointer and room; tablets keep drag only.
  const canResize = useMatchMedia("(min-width: 1024px)", true);
  const [items, setItems] = useState<Item[]>(DEFAULT_LAYOUT);
  const [message, setMessage] = useState("");
  const [heldRows, setHeldRows] = useState(MIN_ROWS);
  const grow = useCallback((rows: number) => setHeldRows((previous) => Math.max(previous, rows)), []);
  const fit = useCallback((rows: number) => setHeldRows(Math.max(MIN_ROWS, rows)), []);

  const changed = !sameLayout(items, DEFAULT_LAYOUT);

  const reset = () => {
    setItems(DEFAULT_LAYOUT);
    setHeldRows(MIN_ROWS);
    setMessage(copy.builder.reset);
  };

  return (
    <section
      aria-label={copy.builder.title}
      className={cn("liquid-glass-pill w-full max-w-[840px] rounded-[24px] p-4 xl:max-w-[600px]", className)}
    >
      <div className="flex min-h-[18px] items-center justify-between gap-3 text-[14px] leading-[18px]">
        <h2 className="font-semibold text-ink">{copy.builder.title}</h2>
        {changed ? (
          <button
            type="button"
            onClick={reset}
            className="-my-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-medium text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {copy.builder.reset}
          </button>
        ) : (
          <div aria-hidden="true" className="flex items-center gap-1.5 text-muted">
            <HintChip icon={<GripVertical className="size-3" aria-hidden="true" />}>{copy.builder.chipDrag}</HintChip>
            <HintChip icon={<ResizeGlyph />}>{copy.builder.chipResize}</HintChip>
          </div>
        )}
      </div>

      <div className="mt-4">
        <GridBoard
          items={items}
          setItems={setItems}
          copy={copy}
          isRtl={isRtl}
          announce={setMessage}
          minRows={heldRows}
          onGrow={grow}
          onFit={fit}
          canResize={canResize}
        />
      </div>

      <p className="mt-3 text-[12px] leading-4 text-muted">{copy.builder.privacy}</p>

      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}

/**
 * The builder is a desktop tool (1024px and up). Below that the hero shows the Nova preview instead,
 * and none of this mounts, so phones run none of its timers or listeners.
 */
export function DashboardBuilder({ className }: { className?: string }) {
  const desktop = useMatchMedia("(min-width: 1024px)", true);
  return desktop ? <BuilderPanel className={className} /> : null;
}
