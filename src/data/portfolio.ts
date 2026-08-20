import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Cloud,
  Code2,
  Database,
  Facebook,
  Github,
  HeartPulse,
  Instagram,
  Languages,
  Layers,
  Linkedin,
  ListTodo,
  Server,
  Settings,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

export const site = {
  name: "Abdallah Zaghloul",
  shortName: "AZ",
  role: "Frontend Developer & Team Lead (React)",
  email: "f2002.a.z@gmail.com",
  phone: "+963 932 200 022",
  phoneHref: "tel:+963932200022",
  location: "Damascus, Syria",
  availability: "Available for worldwide remote opportunities",
  resumeHref: "/ABDALLAH_ZAGHLOUL_CV.pdf",
  resumeDownload: "ABDALLAH_ZAGHLOUL_CV.pdf",
  bio: "Frontend Developer with 3+ years shipping production React and Next.js apps. At PawsPalConnect, led a 3-person remote frontend team and delivered a pet-care platform covering booking, medical tracking, and commerce. Currently building IoT dashboards and motion-heavy marketing sites at Sama-Tech (TypeScript, Tailwind, Zustand). Also designs and ships the API and mobile client when needed — including Nova, a full task platform across web, Expo, and NestJS.",
};

export const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/AbdallahZagh",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/abdallah-zaghloul",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/abdallahzagh?igsh=Z3Y4M2t0Ynh0bGgw",
    icon: Instagram,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1CFGmxiMcT/",
    icon: Facebook,
  },
];

export type Experience = {
  title: string;
  company: string;
  period: string;
  location: string;
  tags: string[];
  achievements: string[];
  certificate?: { src: string; alt: string };
};

export const experiences: Experience[] = [
  {
    title: "Frontend Web Developer",
    company: "Sama-Tech",
    period: "Mar 2026 – Present",
    location: "On-Site",
    tags: ["Next.js 16", "React 19", "TypeScript", "Zustand", "GSAP", "Mapbox GL"],
    achievements: [
      "Engineered a multi-page corporate marketing website using Next.js 16 and React 19, showcasing IoT and ESG solutions with interactive, scroll-driven UI behaviors powered by Framer Motion and GSAP.",
      "Built a multi-module admin dashboard (Sama Fire) utilizing React 19 and Vite for real-time gateway monitoring, incident events, and maintenance workflows.",
      "Implemented role-based access control, organization-wide filtering, and Firebase push notifications, ensuring live data synchronization across events and Mapbox GL map views.",
      "Architected scalable and responsive front-end solutions utilizing Tailwind CSS v4, TypeScript, and Zustand.",
    ],
  },
  {
    title: "Frontend Web Developer (Freelance)",
    company: "Self-Employed",
    period: "2023 – Present",
    location: "Remote",
    tags: ["React", "Dashboards", "Performance"],
    achievements: [
      "Developed 5+ responsive web applications, focusing on high performance and component reusability.",
      "Built custom booking systems and API-driven dashboards for international clients.",
      "Optimized web performance and accessibility, achieving 90+ Lighthouse scores for key client projects.",
    ],
  },
  {
    title: "Frontend Team Lead (React)",
    company: "PawsPalConnect",
    period: "Oct 2025 – Feb 2026",
    location: "Remote",
    tags: ["React 19", "Redux Toolkit", "Team Lead", "E-Commerce"],
    achievements: [
      "Lead and mentor a 3-person frontend team: technical decisions, reviews, and delivery.",
      "Architected a production-grade pet-care platform utilizing React 19 and Redux Toolkit, resulting in a highly scalable and maintainable codebase.",
      "Developed complex features including appointment booking, vaccination tracking, and an e-commerce dashboard.",
      "Implemented a modern, responsive design system using Tailwind CSS v4, reducing CSS technical debt.",
      "Integrated real-time data visualization using Chart.js and Recharts for operational insights.",
    ],
    certificate: {
      src: "/ppc-certificate.png",
      alt: "Internship completion certificate — Paws Pal Connect (NPT Solutions), Front-End Team Lead Intern, Abdallah Zaghloul, October 2025 to February 2026",
    },
  },
  {
    title: "Frontend Web Developer",
    company: "Goma+",
    period: "Nov 2022 – Nov 2023",
    location: "Remote",
    tags: ["React", "Tailwind CSS"],
    achievements: [
      "Built responsive React and Tailwind interfaces with a cross-functional team.",
      "Maintained production UI and fixed performance issues that were driving bug reports.",
    ],
  },
];

export const education = {
  degree: "BSc in Information Technology (AI Specialization)",
  institution: "Al-Sham Private University",
  date: "Mar 2025",
};

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "C1" },
];

export type Project = {
  name: string;
  shortName: string;
  role: string;
  year: string;
  category: string;
  description: string;
  highlights?: string[];
  tools: string[];
  demo?: string;
  icon: LucideIcon;
};

export const projects: Project[] = [
  {
    name: "Nova — Task & collaboration platform",
    shortName: "Nova",
    role: "Full product",
    year: "2026",
    category: "Product",
    description:
      "Designed and shipped a Linear-style product across web, mobile, and backend: projects, Kanban, Gantt/timeline, whiteboards, and Super Admin.",
    highlights: [
      "Web: Next.js 16 / React 19 app with a shared glass UI system, JWT auth, and a Super Admin console (users, support, broadcasts, AI quotas, audit log).",
      "Mobile: Expo (React Native) app with NativeWind, the same product flows, push notifications, and a live system-status banner.",
      "API: NestJS, Prisma, PostgreSQL, role-based access, OTP/auth, Gemini quotas, support tickets, and Supabase Realtime (no polling for live status).",
    ],
    tools: [
      "Next.js 16",
      "React 19",
      "Expo",
      "NativeWind",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Gemini",
    ],
    demo: "https://nova-task-management.netlify.app/",
    icon: ListTodo,
  },
  {
    name: "Clinic Management System (Administrative & Doctor Dashboards)",
    shortName: "Elegance",
    role: "Frontend Engineer",
    year: "2024",
    category: "Healthcare",
    description:
      "Administrative and doctor dashboards built for workflow efficiency across appointments and patient records.",
    highlights: [
      "Designed Administrative and Doctor dashboards with a focus on workflow efficiency.",
      "Implemented multi-language support (i18n) to cater to international clinic operations.",
    ],
    tools: [
      "React",
      "Redux Toolkit",
      "Tailwind CSS",
      "Axios",
      "i18next",
      "React-hot-toast",
    ],
    icon: Building2,
  },
  {
    name: "HR Management System",
    shortName: "HR System",
    role: "Frontend Engineer",
    year: "2024",
    category: "Internal",
    description:
      "Built internal tools for employee profiles and real-time attendance visualization.",
    tools: ["React", "Tailwind CSS", "Axios", "i18next"],
    icon: Users,
  },
  {
    name: "E-Commerce Web Application",
    shortName: "Storefront",
    role: "Frontend Engineer",
    year: "2024",
    category: "Commerce",
    description:
      "Developed a high-performance frontend with real-time state synchronization for cart management.",
    tools: [
      "React",
      "Redux",
      "Tailwind CSS",
      "React-hot-toast",
      "Chart.js",
      "Recharts",
    ],
    icon: ShoppingCart,
  },
  {
    name: "Medical Clinic System (Infertility Clinic)",
    shortName: "Clinic",
    role: "Frontend Engineer",
    year: "2023",
    category: "Healthcare",
    description:
      "Patient-facing interfaces with a focus on accessibility and mobile responsiveness.",
    highlights: [
      "Engineered patient-facing interfaces with a focus on accessibility and mobile responsiveness.",
      "Collaborated with cross-functional teams to build responsive interfaces using React and Tailwind CSS.",
      "Maintained existing codebases, reducing bug reports by resolving critical performance bottlenecks.",
    ],
    tools: [
      "React",
      "Tailwind CSS",
      "Axios",
      "i18next",
      "React-hot-toast",
      "Chart.js",
      "Recharts",
    ],
    icon: HeartPulse,
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      "React (18/19)",
      "Next.js (16)",
      "TypeScript (Core)",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "React Router",
    ],
  },
  {
    title: "UI & Motion",
    icon: Sparkles,
    skills: ["Tailwind CSS (v4)", "Material UI", "GSAP", "Framer Motion", "DaisyUI"],
  },
  {
    title: "APIs, Cloud",
    icon: Cloud,
    skills: ["Supabase", "Firebase (FCM)", "Google Gemini"],
  },
  {
    title: "Localization",
    icon: Languages,
    skills: ["i18n", "i18next"],
  },
  {
    title: "Backend & data",
    icon: Server,
    skills: ["NestJS", "Prisma", "PostgreSQL", "REST APIs", "Passport JWT"],
  },
  {
    title: "State Management & Data Fetching",
    icon: Database,
    skills: ["Redux", "Redux Toolkit", "Zustand", "React Query", "Context API"],
  },
  {
    title: "3D, Maps & Interactive",
    icon: Layers,
    skills: ["Three.js", "Mapbox GL"],
  },
  {
    title: "Process",
    icon: ListTodo,
    skills: ["Agile/Scrum", "Sprint Planning", "Code Reviews"],
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: ["Expo", "React Native", "NativeWind"],
  },
  {
    title: "Tooling",
    icon: Settings,
    skills: ["Axios", "Vite", "Git", "GitHub"],
  },
];
