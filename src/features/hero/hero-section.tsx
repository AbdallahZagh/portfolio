"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { publicAsset } from "@/lib/public-asset";
import { site } from "@/data/portfolio";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
});

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center border-b border-border"
    >
      <motion.div
        className="page-wrap relative z-10 grid w-full flex-1 items-center gap-8 py-8 md:grid-cols-2 md:min-h-[calc(100dvh-4rem)] md:gap-10 md:py-0 lg:gap-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="relative z-10">
          <motion.p
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            variants={fadeInUp}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-spark" />
            {site.role}
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-[clamp(2.4rem,5.2vw,4.25rem)] font-semibold leading-[1.05] tracking-tight"
            variants={fadeInUp}
          >
            {site.name}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            variants={fadeInUp}
          >
            {site.bio}
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" variants={fadeInUp}>
            <Button href="#contact" size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Get in touch
            </Button>
            <Button
              href={publicAsset(site.resumeHref)}
              download={site.resumeDownload}
              variant="outline"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-88 sm:max-w-104 md:mx-0 md:aspect-auto md:h-[min(36rem,calc(100dvh-8rem))] md:max-w-none"
          variants={fadeInUp}
        >
          <HeroScene />
        </motion.div>
      </motion.div>
    </section>
  );
}
