"use client";

import Image from "next/image";
import { Award, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { publicAsset } from "@/lib/public-asset";

type CertificatePreviewProps = {
  src: string;
  alt: string;
};

export function CertificatePreview({ src, alt }: CertificatePreviewProps) {
  const resolvedSrc = publicAsset(src);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    lenis?.stop();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    const blockScroll = (event: Event) => event.preventDefault();

    document.addEventListener("keydown", onKey);
    document.addEventListener("wheel", blockScroll, { passive: false });
    document.addEventListener("touchmove", blockScroll, { passive: false });

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", blockScroll);
      document.removeEventListener("touchmove", blockScroll);
    };
  }, [open, closeModal, lenis]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/cert flex w-full gap-4 rounded-xl border border-border bg-surface/50 p-3 text-left outline-none transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:p-4"
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
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="inline-flex items-center gap-2 font-display text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">
            <Award className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
            Internship certificate
          </span>
          <span className="text-xs leading-snug text-muted sm:text-sm">
            NPT Solutions · Paws Pal Connect · Oct 2025 – Feb 2026
          </span>
          <span className="font-display text-[0.65rem] uppercase tracking-wider text-primary">
            Open preview
          </span>
        </div>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div
                  className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-3 sm:p-6"
                  role="presentation"
                >
                  <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm dark:bg-background/75"
                    onClick={closeModal}
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={alt}
                    className="relative z-10 flex max-h-[min(95dvh,calc(100dvh-1.5rem))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl ring-1 ring-primary/15 dark:ring-secondary/10"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/40 px-4 py-3 sm:px-5">
                      <span className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
                        Certificate preview
                      </span>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </header>
                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-linear-to-b from-muted/20 to-card p-3 sm:p-5">
                      {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath; Next Image loader differs for static export */}
                      <img
                        src={resolvedSrc}
                        alt={alt}
                        className="max-h-[calc(95dvh-5.5rem)] w-auto max-w-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
