"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale } from "@/components/locale-provider";
import type { ProjectImage } from "@/data/portfolio";
import { publicAsset } from "@/lib/public-asset";
import { cn } from "@/lib/utils";

type Side = "left" | "right";

type Pose = { x: number; rotate: number; y: number; scale: number };

const REST: Record<Side, Pose> = {
  left: { x: -29, rotate: -4, y: 10, scale: 0.78 },
  right: { x: 29, rotate: 4, y: 10, scale: 0.78 },
};
const FRONT: Pose = { x: 0, rotate: 0, y: 0, scale: 1 };

const SIDES: Side[] = ["left", "right"];

function poseStyle(pose: Pose): CSSProperties {
  return {
    translate: `${pose.x}% ${pose.y}px`,
    rotate: `${pose.rotate}deg`,
    scale: pose.scale,
  };
}

/**
 * Three screenshots in a fan. The main one always stays in the centre.
 *
 * Hovering (mouse) or tapping (touch) one of the side screenshots brings it to the front at full size.
 * What reacts to the pointer is a set of invisible boxes that never move, so a card sliding about can never
 * change what is under the pointer and make the gallery flicker. Leaving with the mouse, or tapping anywhere
 * else, puts the main screenshot back.
 */
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
  const [active, setActive] = useState<Side | null>(null);
  const lastPointer = useRef("mouse");
  const images: Record<Side, ProjectImage> = { left, right };

  // On touch there is no "leave": tapping anywhere outside the side screenshots closes the front card.
  useEffect(() => {
    if (!active) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-gallery-side]")) return;
      setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [active]);

  const paintCard = (id: "main" | Side) => {
    const isSide = id !== "main";
    const front = id === active;
    const image = id === "main" ? main : images[id];
    const style: CSSProperties = {
      ...poseStyle(front ? FRONT : isSide ? REST[id] : FRONT),
      zIndex: front ? 40 : isSide ? 10 : 30,
      // The z-index swap waits until the card is half way, so it never pops in front of or behind its neighbour.
      transitionDelay: `0s, 0s, 0s, ${front ? "0s" : "210ms"}`,
    };
    return (
      <div
        key={id}
        aria-hidden={isSide ? true : undefined}
        style={style}
        className={cn(
          "pointer-events-none rounded-[14px] border border-line bg-surface p-3 will-change-transform",
          // The shadow is constant and not animated: transitioning a large blurred shadow repaints every frame.
          "shadow-[0_24px_48px_-28px_rgb(0_0_0/0.5)]",
          "transition-[translate,rotate,scale,z-index] duration-[420ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
          id === "main" ? "relative" : "absolute inset-0",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath; Next Image loader differs for static export */}
        <img
          src={publicAsset(image.src)}
          alt={image.alt[locale]}
          width={image.width}
          height={image.height}
          loading="eager"
          decoding="async"
          draggable={false}
          className="block aspect-[1248/672] w-full rounded-lg bg-bg object-contain"
        />
      </div>
    );
  };

  return (
    <div role="group" aria-label={label} className="relative px-[14%] py-4">
      {/* Painted cards: the main one (which gives the box its height) is last. */}
      <div className="relative">
        {SIDES.map((id) => paintCard(id))}
        {paintCard("main")}

        {/* Fixed hit boxes, same shape as each card at rest. They never move. The main one wins where cards overlap. */}
        <div className="pointer-events-none absolute inset-0 z-50">
          {SIDES.map((id) => (
            <button
              key={id}
              type="button"
              data-gallery-side=""
              aria-label={images[id].alt[locale]}
              aria-pressed={active === id}
              style={{ ...poseStyle(REST[id]), zIndex: active === id ? 3 : 1 }}
              onPointerDown={(event) => {
                lastPointer.current = event.pointerType;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(id);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setActive((current) => (current === id ? null : current));
              }}
              onClick={(event) => {
                // Mouse already reacts to hover; click is for touch and keyboard (a keyboard click has detail 0).
                if (event.detail > 0 && lastPointer.current === "mouse") return;
                setActive((current) => (current === id ? null : id));
              }}
              onBlur={() => setActive((current) => (current === id ? null : current))}
              className="pointer-events-auto absolute inset-0 cursor-pointer rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          ))}
          <div className="pointer-events-auto absolute inset-0 z-[2]" />
        </div>
      </div>
    </div>
  );
}