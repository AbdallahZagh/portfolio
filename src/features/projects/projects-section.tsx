"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animation-variants";
import { 
  Heart, 
  Sparkles, 
  Building2, 
  Users, 
  ShoppingCart,
  HeartPulse
} from "lucide-react";
import StarryNightSky from "@/components/three/starry-night-sky";
import { ProjectCard, type Project } from "./project-card";

const projects: Project[] = [
  {
    name: "PawsPalConnect – Pet Care & E-Commerce Platform",
    description:
      "Production pet-care platform for veterinary appointment booking, vaccination tracking, and pet product purchases. Led frontend architecture, state management, and dashboard development.",
    tools: [
      "React",
      "Redux Toolkit",
      "TailwindCSS v4",
      "Axios",
      "Chart.js",
      "Recharts",
      "Tiptap",
      "React-hot-toast"
    ],
    github: "https://github.com/pawspalconnect/paws_pal_connect_website",
    demo1: "https://ppc-website-test.vercel.app/",
    demo2: null,
    figma: null,
    icon: Heart
  },
  {
    name: "Digital Studio – Interactive Creative Website",
    description:
      "Interactive, animation-rich creative website focused on immersive user experience. Implemented advanced animations and 3D visual interactions.",
    tools: [
      "React",
      "Tailwind CSS",
      "GSAP",
      "Three.js"
    ],
    github: "https://github.com/AbdallahZagh/digital-studio.git",
    demo1: null,
    demo2: "https://digital-studio-beta.vercel.app/",
    figma: null,
    icon: Sparkles
  },
  {
    name: "Clinic Management System",
    description:
      "Administrative and doctor dashboards for managing appointments, patient records, and clinic operations with a focus on workflow efficiency.",
    tools: [
      "React",
      "Redux Toolkit",
      "Tailwind CSS",
      "Axios",
      "i18next",
      "React-hot-toast"
    ],
    github: "https://github.com/AbdallahZagh/elegance-hub.git",
    demo1: null,
    demo2: null,
    figma: "https://www.figma.com/design/UdECEw7eLqkKRfm89yHhzP/elegance-hub",
    icon: Building2
  },
  {
    name: "HR Management System",
    description:
      "Internal dashboard system for employee profiles, attendance tracking, and leave management with real-time data visualization.",
    tools: [
      "React",
      "Tailwind CSS",
      "Axios",
      "i18next"
    ],
    github: "https://github.com/AbdallahZagh/hr-system.git",
    demo1: null,
    demo2: null,
    figma: "https://www.figma.com/design/NIWco7wUeg0n5KuG5CcPjP/HR-system",
    icon: Users
  },
  {
    name: "E-Commerce Web Application",
    description:
      "Responsive e-commerce frontend featuring product browsing, cart management, and real-time global state synchronization.",
    tools: [
      "React",
      "Redux",
      "Tailwind CSS",
      "React-hot-toast",
      "Chart.js",
      "Recharts"
    ],
    github: "https://github.com/AbdallahZagh/E-commerce.git",
    demo1: "https://elegancehub-store-dashboard.netlify.app/",
    demo2: "https://elegeancehub-store.netlify.app/",
    figma: null,
    icon: ShoppingCart
  },
  {
    name: "Medical Clinic System (Infertility Clinic)",
    description:
      "Patient-facing interface including registration forms and medical history views, designed with accessibility and internationalization in mind.",
    tools: [
      "React",
      "Tailwind CSS",
      "Axios",
      "i18next",
      "React-hot-toast",
      "Chart.js",
      "Recharts"
    ],
    github: "https://github.com/AbdallahZagh/infertility.git",
    demo1: "https://infertility-dashboard.netlify.app/",
    demo2: "https://infertility-user.netlify.app/",
    figma: null,
    icon: HeartPulse
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <StarryNightSky />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background/60" />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">
              Selected <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Projects
              </span> 
            </h2>
            <div className="flex justify-between items-center flex-col md:flex-row gap-7">
            <p className="mt-3 sm:mt-4 max-w-xl xl:max-w-2xl 2xl:max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-muted leading-relaxed">
              Real-world platforms, dashboards, and high-motion experiences designed for
              performance, clarity, and long-term maintainability.
            </p>
          <p className="text-xs font-mono text-center uppercase tracking-[0.25em] text-muted border-b border-t border-secondary/25">
            React · Next.js · Three.js · Framer Motion
          </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
