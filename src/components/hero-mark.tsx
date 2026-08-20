"use client";

export function HeroMark() {
  return (
    <svg
      viewBox="0 0 420 420"
      className="h-full w-full"
      aria-hidden
    >
      <ellipse
        cx="210"
        cy="230"
        rx="148"
        ry="168"
        fill="var(--primary)"
        opacity="0.92"
      />
      <ellipse
        cx="268"
        cy="168"
        rx="108"
        ry="128"
        fill="var(--secondary)"
        opacity="0.72"
      />
      <circle cx="148" cy="148" r="78" fill="var(--surface)" />
      <circle cx="176" cy="176" r="36" fill="var(--card)" />
      <path
        d="M92 268c38-64 102-78 148-42 46 36 48 108 8 148-52-18-110-48-156-106Z"
        fill="var(--spark)"
        opacity="0.35"
      />
    </svg>
  );
}
