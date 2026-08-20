"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animation-variants";

export function SectionHeading({
  title,
  aside,
}: {
  title: string;
  aside?: string;
}) {
  return (
    <motion.header className="mb-10 md:mb-14" variants={fadeInUp}>
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {aside ? (
        <p className="mt-3 max-w-2xl text-muted md:text-lg">{aside}</p>
      ) : null}
    </motion.header>
  );
}
