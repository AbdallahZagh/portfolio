"use client";

import { useState, type CSSProperties } from "react";
import { useLocale } from "@/components/locale-provider";
import type { ProjectImage } from "@/data/portfolio";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

type Slot = "left" | "main" | "right";

/**
 * Three screenshots fanned out side by side. The middle one leads by default; hovering (or focusing,
 * or tapping) any of them brings it to the front. All three are plain images in the HTML.
 */
const POSE: Record<Slot, { x: number; rotate: number; y: number }> = {
  left: { x: -11, rotate: -4, y: 8 },
  main: { x: 0, rotate: 0, y: 0 },
  right: { x: 11, rotate: 4, y: 8 },
};

const REST_SCALE = 0.78;
const FRONT_SCALE = 0.84;

export function NovaGallery({
  main,
  left,
  right,
  label,
}: {
  main: ProjectImage;
  left: ProjectImage;
  right: ProjectImage;
  label: string;
}) {
  const { locale } = useLocale();
  const [front, setFront] = useState<Slot | null>(null);
  const images: Record<Slot, ProjectImage> = { left, main, right };
  const order: Slot[] = ["left", "right", "main"];

  return (
    <div
      role="group"
      aria-label={label}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setFront(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFront(null);
      }}
      className="relative"
    >
      {order.map((slot) => {
        const lead = front === slot;
        const pose = POSE[slot];
        // The lifted card straightens and grows; it keeps its slot so the pointer never loses it.
        const style: CSSProperties = {
          translate: `${pose.x}% ${lead ? 0 : pose.y}px`,
          rotate: `${lead ? 0 : pose.rotate}deg`,
          scale: lead ? FRONT_SCALE : REST_SCALE,
          zIndex: lead ? 30 : slot === "main" ? 20 : 10,
        };

        return (
          <div
            key={slot}
            tabIndex={0}
            style={style}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setFront(slot);
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") setFront(slot);
            }}
            onFocus={() => setFront(slot)}
            className={cn(
              "rounded-[14px] border border-line bg-surface p-3",
              "transition-[translate,rotate,scale,box-shadow] duration-[var(--duration-morph)] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              slot === "main" ? "relative" : "absolute inset-0",
              lead && "shadow-[0_32px_64px_-32px_rgb(0_0_0/0.55)]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath; Next Image loader differs for static export */}
            <img
              src={publicAsset(images[slot].src)}
              alt={images[slot].alt[locale]}
              width={images[slot].width}
              height={images[slot].height}
              loading={slot === "main" ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="block aspect-[1248/672] w-full rounded-lg object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
