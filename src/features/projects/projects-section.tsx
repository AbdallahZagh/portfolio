"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animation-variants";
import {
  Heart,
  Sparkles,
  Building2,
  Users,
  ShoppingCart,
  HeartPulse,
  Flame,
  Globe2,
} from "lucide-react";
import StarryNightSky from "@/components/three/starry-night-sky";
import { ProjectCard, type Project } from "./project-card";

const projects: Project[] = [
  {
    name: "Sama Fire – IoT Fire Safety Dashboard",
    description:
      "Multi-module admin dashboard for real-time gateway monitoring, incident events, and maintenance workflows. Role-based access, organization-wide filtering, Firebase push notifications, and live sync across event streams and Mapbox GL map views.",
    tools: [
      "React 19",
      "Vite",
      "Tailwind CSS v4",
      "Zustand",
      "Mapbox GL",
      "Firebase (FCM)",
      "REST APIs",
    ],
    github: null,
    demo1: null,
    demo2: 'https://sama-tech.ae/fire-fighting/',
    figma: null,
    icon: Flame,
  },
  {
    name: "Sama.Tech – Corporate Landing & Marketing Site",
    description:
      "Multi-page enterprise marketing site highlighting smart building, IoT, and ESG solutions. Interactive UI with Framer Motion and GSAP—smooth category transitions, animated product hotspots, and scroll-driven motion.",
    tools: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "GSAP",
    ],
    github: null,
    demo1: null,
    demo2: "https://sama-tech.ae/landing-page",
    figma: null,
    icon: Globe2,
  },
  {
    name: "PawsPalConnect – Pet Care & E-Commerce Platform",
    description:
      "Full-scale e-commerce and medical tracking platform. Led frontend strategy with global state management and REST API integrations for complex user data—appointments, vaccination tracking, and operational dashboards.",
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
    demo1: "https://www.pawspalconnect.com/",
    demo2: null,
    figma: null,
    icon: Heart
  },
  {
    name: "Digital Studio – Interactive Creative Website",
    description:
      "Immersive creative experience with GSAP-driven animation and Three.js 3D elements. Tuned for smooth rendering and strong performance in high-motion web environments.",
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
    name: "Clinic Management System (Administrative & Doctor Dashboards)",
    description:
      "Administrative and doctor dashboards built for workflow efficiency across appointments and patient records. Full i18n support for international clinic operations.",
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
      "Internal tooling for employee profiles, attendance, and leave management with real-time attendance visualization.",
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
      "High-performance storefront and dashboard with reliable real-time state synchronization for cart and catalog flows.",
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
      "Patient-facing flows with a strong focus on accessibility and mobile responsiveness. Worked with cross-functional teams and tightened performance to reduce critical bottlenecks in legacy areas.",
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
          viewport={{ once: true, amount: 0.06 }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
