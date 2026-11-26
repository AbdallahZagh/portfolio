"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { publicAsset } from "@/lib/public-asset";
import { useMounted } from "@/lib/use-mounted";

type CertificatePreviewProps = {
  src: string;
  alt: string;
  label: string;
  dialogTitle: string;
  closeLabel: string;
};

/** Figma "Internship certificate ↗" button: opens the certificate image in a dialog. */
export function CertificatePreview({ src, alt, label, dialogTitle, closeLabel }: CertificatePreviewProps) {
  const resolvedSrc = publicAsset(src);
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const lenis = useLenis();

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
      <Button
        variant="outline"
        size="sm"
        className="px-[22px]"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {label}
        <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </Button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div
                  className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-3 sm:p-6"
                  role="presentation"
                >
                  <m.div
                    className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
                    onClick={closeModal}
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <m.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={dialogTitle}
                    className="relative z-10 flex max-h-[min(95dvh,calc(100dvh-1.5rem))] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] border border-line bg-bg"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line ps-5 pe-2">
                      <h3 className="text-[15px] font-semibold leading-5 text-ink">{dialogTitle}</h3>
                      <IconButton onClick={closeModal} aria-label={closeLabel} autoFocus>
                        <X className="size-5" aria-hidden="true" />
                      </IconButton>
                    </header>
                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-surface p-3 sm:p-5">
                      {/* eslint-disable-next-line @next/next/no-img-element -- publicAsset path must match basePath; Next Image loader differs for static export */}
                      <img
                        src={resolvedSrc}
                        alt={alt}
                        className="max-h-[calc(95dvh-5.5rem)] w-auto max-w-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </m.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
