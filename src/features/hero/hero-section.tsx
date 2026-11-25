"use client";

import { Download } from "lucide-react";
import { Cta } from "@/components/ui/cta";
import { useLocale } from "@/components/locale-provider";
import { publicAsset } from "@/lib/public-asset";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { heroCopy } from "./hero-copy";
import { DashboardBuilder } from "./builder/dashboard-builder";

export function HeroSection() {
  const { locale, isRtl } = useLocale();
  const copy = heroCopy[locale];
  const { lines, accent, accentWord } = copy.headline;

  return (
    <section id="home" className="relative flex min-h-svh items-center">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-28 sm:px-8 xl:grid-cols-[minmax(0,1fr)_536px] xl:gap-8 xl:px-14 xl:py-24">
        <div className="flex min-w-0 flex-col gap-6 md:gap-8">
          <p className="text-[15px] font-medium leading-5 text-muted md:text-[16px]">{copy.role}</p>

          <h1
            className={cn(
              "font-semibold text-ink",
              isRtl
                ? "text-[64px] leading-[83px] sm:text-[80px] sm:leading-[100px] lg:text-[96px] lg:leading-[120px]"
                : "text-[64px] leading-[58px] tracking-[-0.045em] sm:text-[96px] sm:leading-[84px] md:text-[120px] md:leading-[105px] lg:text-[144px] lg:leading-[126px]",
            )}
          >
            {lines.map((line, index) => {
              if (index !== accent) {
                return (
                  <span key={line} className="block">
                    {line}
                  </span>
                );
              }
              if (!accentWord) {
                return (
                  <span key={line} className="block text-brand-text">
                    {line}
                  </span>
                );
              }
              const [before, after] = line.split(accentWord);
              return (
                <span key={line} className="block">
                  {before}
                  <span className="text-brand-text">{accentWord}</span>
                  {after}
                </span>
              );
            })}
          </h1>

          <p
            className={cn(
              "max-w-[560px] text-[18px] leading-[27px] text-muted md:text-[20px]",
              isRtl && "md:leading-[30px]",
            )}
          >
            <span className="font-medium text-ink">{copy.leadStrong}</span>
            <span className="xl:hidden">{copy.leadRestMobile}</span>
            <span className="hidden xl:inline">{copy.leadRest}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-8">
            <Cta href="#contact" size="responsive">
              {copy.talk}
            </Cta>
            <a
              href={publicAsset(site.resumeHref)}
              download={site.resumeDownload}
              className="inline-flex h-11 items-center gap-2 border-b-[1.5px] px-1 border-ink text-[17px] font-semibold leading-5 text-ink transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-brand hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Download className="size-5" aria-hidden="true" />
              {copy.downloadCv}
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <DashboardBuilder />
        </div>
      </div>
    </section>
  );
}
