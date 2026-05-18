"use client";

import Image from "next/image";
import { Award, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { publicAsset } from "@/lib/public-asset";

type CertificatePreviewProps = {
  src: string;
  alt: string;
};

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.25;
const BASE_MAX_VH = 78;
const BASE_MAX_PX = 1100;

export function CertificatePreview({ src, alt }: CertificatePreviewProps) {
  const resolvedSrc = publicAsset(src);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const closeModal = useCallback(() => {
    setZoom(1);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
      }
      if (e.key === "0" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setZoom(1);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeModal]);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 100) / 100));
  }, []);

  const zoomReset = useCallback(() => setZoom(1), []);

  const onPreviewWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) =>
      Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 100) / 100))
    );
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/cert mb-5 flex w-full gap-4 rounded-xl border border-muted/30 bg-muted/5 p-3 text-left shadow-sm outline-none transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:p-4"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`View certificate: ${alt}`}
      >
        <div className="relative h-24 w-[4.75rem] shrink-0 overflow-hidden rounded-lg border border-border/40 bg-background/50 shadow-inner sm:h-28 sm:w-[5.5rem]">
          <Image
            src={resolvedSrc}
            alt=""
            fill
            sizes="96px"
            className="object-cover object-top transition duration-300 group-hover/cert:brightness-105"
          />
        </div>
        <div className="min-w-0 flex flex-1 flex-col justify-center gap-1.5">
          <span className="inline-flex items-center gap-2 font-display text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">
            <Award className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
            Internship certificate
          </span>
          <span className="text-xs leading-snug text-muted sm:text-sm">
            NPT Solutions · Paws Pal Connect · Oct 2025 – Feb 2026
          </span>
          <span className="font-display text-[0.65rem] uppercase tracking-wider text-secondary">
            Open preview
          </span>
        </div>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
              role="presentation"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm dark:bg-background/75"
                onClick={closeModal}
                aria-hidden
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                className="relative z-10 flex h-[95vh] max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl ring-1 ring-primary/15 dark:ring-secondary/10"
              >
                <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/40 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
                      Certificate preview
                    </span>
                    <span className="text-[0.6rem] text-muted/85 sm:hidden">
                      − / + buttons · <span className="whitespace-nowrap">Ctrl+scroll</span> (⌘ on Mac)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                    <span
                      className="mr-1 font-mono text-[0.65rem] text-muted tabular-nums"
                      aria-live="polite"
                    >
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={zoomOut}
                      disabled={zoom <= ZOOM_MIN}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Zoom out"
                    >
                      <Minus className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={zoomIn}
                      disabled={zoom >= ZOOM_MAX}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                      aria-label="Zoom in"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={zoomReset}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/40 text-muted transition hover:bg-muted hover:text-foreground"
                      aria-label="Reset zoom"
                      title="Reset zoom (0)"
                    >
                      <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted transition hover:border-border/60 hover:bg-muted hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                  </div>
                </header>
                <div
                  className="min-h-0 flex-1 overflow-auto bg-linear-to-b from-muted/20 to-card p-3 sm:p-5"
                  onWheel={onPreviewWheel}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath; Next Image loader differs for static export */}
                  <img
                    src={resolvedSrc}
                    alt={alt}
                    className="mx-auto block h-auto w-full max-w-full object-contain"
                    draggable={false}
                    style={{
                      maxHeight: `min(${Math.round(BASE_MAX_VH * zoom)}dvh, ${Math.round(BASE_MAX_PX * zoom)}px)`,
                      maxWidth: `min(96vw, ${Math.round(900 * zoom)}px)`,
                    }}
                  />
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
