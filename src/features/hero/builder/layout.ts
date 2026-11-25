export type WidgetId = "scope" | "telemetry" | "reactor" | "tanks" | "vitals";

export type Item = { id: WidgetId; x: number; y: number; w: number; h: number };

export type Size = { w: number; h: number };

export const COLS = 4;
export const MIN_ROWS = 4;
/** Figma grid: 500 x 520 for 4 x 4, so a cell is 125 x 130. */
export const CELL_W = 125;
export const CELL_H = 130;
/** Gap between a card and its cell edge (card = cell - 12). */
export const INSET = 6;

/** Sizes each widget supports, from the Figma Widgets board and the resize prototype. */
export const SIZES: Record<WidgetId, readonly Size[]> = {
  scope: [
    { w: 2, h: 1 },
    { w: 4, h: 1 },
  ],
  telemetry: [{ w: 2, h: 2 }],
  reactor: [
    { w: 1, h: 1 },
    { w: 2, h: 2 },
  ],
  tanks: [
    { w: 2, h: 1 },
    { w: 2, h: 2 },
    { w: 4, h: 1 },
  ],
  vitals: [
    { w: 1, h: 1 },
    { w: 2, h: 1 },
  ],
};

/** Figma hero default: the 4 x 4 grid is full. */
export const DEFAULT_LAYOUT: Item[] = [
  { id: "scope", x: 0, y: 0, w: 4, h: 1 },
  { id: "telemetry", x: 0, y: 1, w: 2, h: 2 },
  { id: "reactor", x: 2, y: 1, w: 2, h: 2 },
  { id: "tanks", x: 0, y: 3, w: 2, h: 1 },
  { id: "vitals", x: 2, y: 3, w: 2, h: 1 },
];

/** Figma mobile hero order. */
export const DEFAULT_ORDER: WidgetId[] = ["telemetry", "tanks", "scope", "reactor", "vitals"];

/** Mobile card heights from the Figma mobile frame. */
export const MOBILE_HEIGHT: Record<WidgetId, number> = {
  telemetry: 260,
  tanks: 228,
  scope: 108,
  reactor: 228,
  vitals: 108,
};

export function collides(a: Item, b: Item) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function byPosition(a: Item, b: Item) {
  return a.y - b.y || a.x - b.x;
}

/**
 * Resolve overlaps: `anchors` keep their requested spot, everything else is pushed down
 * until it fits, then the whole layout is pulled back up to close gaps.
 */
export function resolve(items: Item[], anchors: WidgetId[] = []): Item[] {
  const placed: Item[] = [];
  const anchorItems = anchors
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is Item => Boolean(item));
  const rest = items.filter((item) => !anchors.includes(item.id)).sort(byPosition);

  for (const item of [...anchorItems, ...rest]) {
    const next = { ...item };
    next.x = Math.max(0, Math.min(COLS - next.w, next.x));
    next.y = Math.max(0, next.y);
    while (placed.some((other) => collides(next, other))) next.y += 1;
    placed.push(next);
  }

  // Compact upward so the grid never keeps empty rows between widgets.
  const compacted: Item[] = [];
  for (const item of [...placed].sort(byPosition)) {
    const next = { ...item };
    while (next.y > 0 && !compacted.some((other) => collides({ ...next, y: next.y - 1 }, other))) {
      next.y -= 1;
    }
    compacted.push(next);
  }

  return items.map((item) => compacted.find((other) => other.id === item.id) ?? item);
}

export function rowsOf(items: Item[]) {
  return Math.max(MIN_ROWS, ...items.map((item) => item.y + item.h));
}

export function itemAt(items: Item[], col: number, row: number, ignore?: WidgetId) {
  return items.find(
    (item) =>
      item.id !== ignore && col >= item.x && col < item.x + item.w && row >= item.y && row < item.y + item.h,
  );
}

/** Move `id` so its top-left lands on (col,row). A card under that spot is swapped back. */
export function moveTo(items: Item[], id: WidgetId, col: number, row: number): Item[] {
  const dragged = items.find((item) => item.id === id);
  if (!dragged) return items;

  const target = itemAt(items, col, row, id);
  const clampedRow = Math.max(0, row);

  if (!target) {
    const next = items.map((item) =>
      item.id === id ? { ...item, x: Math.min(col, COLS - item.w), y: clampedRow } : item,
    );
    return resolve(next, [id]);
  }

  const next = items.map((item) => {
    if (item.id === id) return { ...item, x: target.x, y: target.y };
    if (item.id === target.id) return { ...item, x: dragged.x, y: dragged.y };
    return item;
  });
  return resolve(next, [id, target.id]);
}

export function resizeTo(items: Item[], id: WidgetId, size: Size): Item[] {
  const next = items.map((item) => (item.id === id ? { ...item, ...size } : item));
  return resolve(next, [id]);
}

/** Pick the supported size closest to the cell span the pointer is asking for. */
export function nearestSize(id: WidgetId, x: number, wanted: { w: number; h: number }): Size {
  const options = SIZES[id].filter((size) => size.w <= COLS);
  const fitting = options.filter((size) => x + size.w <= COLS);
  const pool = fitting.length > 0 ? fitting : options;
  return pool.reduce((best, size) =>
    Math.abs(size.w - wanted.w) + Math.abs(size.h - wanted.h) <
    Math.abs(best.w - wanted.w) + Math.abs(best.h - wanted.h)
      ? size
      : best,
  );
}

export type Direction = "left" | "right" | "up" | "down";

export function moveByKey(items: Item[], id: WidgetId, direction: Direction): Item[] {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) return items;

  const col =
    direction === "left" ? item.x - 1 : direction === "right" ? item.x + item.w : item.x;
  const row = direction === "up" ? item.y - 1 : direction === "down" ? item.y + item.h : item.y;

  if (col < 0 || col >= COLS || row < 0) return items;
  if (direction === "down" && row >= rowsOf(items)) return items;
  return moveTo(items, id, col, row);
}

export function stepSize(items: Item[], id: WidgetId, direction: Direction): Item[] {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) return items;
  const candidates = SIZES[id].filter((size) => {
    if (direction === "right") return size.w > item.w;
    if (direction === "left") return size.w < item.w;
    if (direction === "down") return size.h > item.h;
    return size.h < item.h;
  });
  if (candidates.length === 0) return items;

  // Closest change wins, and keeping the other axis the same is preferred.
  const widthAxis = direction === "left" || direction === "right";
  const cost = (size: Size) =>
    Math.abs(size.w - item.w) + Math.abs(size.h - item.h) + (widthAxis ? Math.abs(size.h - item.h) : Math.abs(size.w - item.w)) * 2;
  const best = candidates.reduce((a, b) => (cost(b) < cost(a) ? b : a));
  return resizeTo(items, id, best);
}

export function sameLayout(a: Item[], b: Item[]) {
  return a.every((item) => {
    const other = b.find((candidate) => candidate.id === item.id);
    return other && other.x === item.x && other.y === item.y && other.w === item.w && other.h === item.h;
  });
}
