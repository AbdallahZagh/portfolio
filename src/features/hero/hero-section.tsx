"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";
import InteractiveSphere from "@/components/three/interactive-sphere";

export function HeroSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-4 py-20 md:px-6"
    >
      <InteractiveSphere />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background/75 to-secondary/25" aria-hidden="true" />


      <motion.div
        ref={ref}
        style={{ y, opacity }}
        className="relative z-10 w-full space-y-6 sm:space-y-8 text-left px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-[1.1] text-foreground"
        >
          Abdallah <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Zaghloul
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-display uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary"
        >
          Frontend Developer &amp; Team Lead (React)
        </motion.p>
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl text-base sm:text-lg md:text-xl lg:text-2xl text-muted leading-relaxed"
        >
          Frontend Developer and Team Lead with 3+ years of experience building scalable, user-centric web
          applications using React, Redux, and Tailwind CSS. Proven track record in architecting clean
          frontend solutions and leading distributed teams in a remote environment. Expert in creating
          advanced UI interactions and implementing Agile task management workflows.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-4 flex flex-col gap-4 sm:flex-row items-center"
        >
          <a href="#contact">
          <Button size="lg">
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
          </Button>
          </a>
          <a href="/ABDALLAH_ZAGHLOUL_RESUME.pdf" // Path relative to public folder
      download="ABDALLAH_ZAGHLOUL_RESUME.pdf">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
          </a>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-center text-xs sm:text-sm md:text-base text-muted"
        >
          <span className="rounded-full border border-primary/40 bg-background/80 px-3 py-1 font-mono uppercase tracking-[0.2em] backdrop-blur">
            Available for worldwide remote opportunities
          </span>
          <span className="rounded-full border border-secondary/40 bg-background/80 px-3 py-1 font-mono uppercase tracking-[0.2em] backdrop-blur">
            📍 Damascus, Syria (Remote)
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
