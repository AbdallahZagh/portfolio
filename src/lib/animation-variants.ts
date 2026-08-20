import type { Variants } from "framer-motion";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const magneticSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export const previewSpring = {
  type: "spring" as const,
  stiffness: 250,
  damping: 20,
};

export const lineReveal = {
  initial: { y: "110%" },
  animate: { y: "0%" },
};

export const inView = {
  once: true,
  amount: 0.16,
  margin: "0px 0px -8% 0px",
} as const;
