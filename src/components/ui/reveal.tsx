"use client";

import { motion } from "framer-motion";
import { fadeInUp, inView, staggerContainer } from "@/lib/animation-variants";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "header" | "li";
}) {
  const Component = motion[Tag];
  return (
    <Component className={cn(className)} variants={fadeInUp}>
      {children}
    </Component>
  );
}
