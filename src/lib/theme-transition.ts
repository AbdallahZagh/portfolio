import { flushSync } from "react-dom";

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};

function cssTime(name: string, fallbackMs: number) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (raw.endsWith("ms")) return parseFloat(raw) || fallbackMs;
  if (raw.endsWith("s")) return (parseFloat(raw) || fallbackMs / 1000) * 1000;
  return fallbackMs;
}

/** Where the circle opens from: the control that was used, else the top-right corner. */
function originOf(source?: Element | null) {
  const el = source instanceof HTMLElement && source !== document.body ? source : null;
  if (!el) return { x: window.innerWidth - 48, y: 40 };
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * Runs a theme change inside a View Transition. The new theme opens as a circle
 * from the toggle (600ms, standard easing). Reduced motion gets a 150ms crossfade
 * (set in CSS); browsers without View Transitions just switch, and the body colour
 * transition softens it.
 */
export function changeTheme(apply: () => void, source?: Element | null) {
  const doc = document as DocumentWithTransitions;
  if (!doc.startViewTransition) {
    apply();
    return;
  }

  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { x, y } = originOf(source ?? document.activeElement);

  root.classList.add("theme-switching");
  const transition = doc.startViewTransition(() => {
    flushSync(apply);
  });
  const done = () => root.classList.remove("theme-switching");
  transition.finished.then(done, done);

  if (reduced) return;

  transition.ready
    .then(() => {
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: cssTime("--duration-theme", 600),
          easing: getComputedStyle(root).getPropertyValue("--ease-standard").trim() || "ease",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {});
}
