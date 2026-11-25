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

/** A string in both site languages. */
export type Localized<T = string> = { en: T; ar: T };

export type Experience = {
  id: string;
  title: Localized;
  /** Company line as shown, e.g. "Elathr Business · Remote". */
  company: Localized;
  period: Localized;
  tags: Localized<string[]>;
  notes: Localized<string[]>;
  certificate?: { src: string; alt: string };
};

/** Newest first. Wording follows the signed-off Figma frames (condensed from the CV bullets). */
export const experiences: Experience[] = [
  {
    id: "elathr",
    title: { en: "Technical Lead (Contract)", ar: "قائد تقني (عقد)" },
    company: { en: "Elathr Business · Remote", ar: "Elathr Business · عن بُعد" },
    period: { en: "Oct 2026 – Present", ar: "أكتوبر 2026 – الآن" },
    tags: {
      en: ["Vendor delivery", "Requirements", "Sprint QA"],
      ar: ["تسليم المزوّد", "المتطلبات", "اختبار السبرنت"],
    },
    notes: {
      en: [
        "Lead delivery of 4 vendor-built products: the Elathr and AidPoint websites and the RasilPay and Rihza apps.",
        "QA every vendor sprint end to end on web and mobile, with written defect reports.",
      ],
      ar: [
        "أقود تسليم 4 منتجات يطوّرها مزوّد خارجي: موقعا Elathr وAidPoint وتطبيقا RasilPay وRihza.",
        "أختبر كل سبرنت للمزوّد من البداية إلى النهاية على الويب والجوال، مع تقارير مكتوبة بالأخطاء.",
      ],
    },
  },
  {
    id: "sama-tech",
    title: { en: "Frontend Engineer", ar: "مهندس واجهات أمامية" },
    company: { en: "Sama-Tech", ar: "Sama-Tech" },
    period: { en: "Mar 2026 – Present", ar: "مارس 2026 – الآن" },
    tags: {
      en: ["React 19", "Next.js 16", "Socket.IO", "Mapbox GL"],
      ar: ["React 19", "Next.js 16", "Socket.IO", "Mapbox GL"],
    },
    notes: {
      en: [
        "Built IoT Platform v2 single-handedly: a drag-and-drop dashboard builder with 30+ widget types and 20+ IoT modules with real-time telemetry.",
        "Built the Sama Fire monitoring platform and the 25-page company website in Next.js 16.",
      ],
      ar: [
        "بنيت منصة IoT Platform v2 بمفردي: أداة لبناء لوحات التحكم بالسحب والإفلات، فيها أكثر من 30 نوعًا من الودجات وأكثر من 20 وحدة IoT ببيانات لحظية.",
        "بنيت منصة Sama Fire للمراقبة وموقع الشركة المكوّن من 25 صفحة باستخدام Next.js 16.",
      ],
    },
  },
  {
    id: "freelance",
    title: { en: "Software Developer (Freelance)", ar: "مطوّر برمجيات (عمل حر)" },
    company: { en: "Freelance", ar: "عمل حر" },
    period: { en: "2023 – Present", ar: "2023 – الآن" },
    tags: {
      en: ["Odoo", "React", "Performance"],
      ar: ["Odoo", "React", "الأداء"],
    },
    notes: {
      en: [
        "Co-developed a bilingual university housing and hospitality ERP on Odoo 20.",
        "5+ responsive web apps, booking systems and API-driven dashboards, with 90+ Lighthouse scores.",
      ],
      ar: [
        "شاركت في تطوير نظام ERP ثنائي اللغة للسكن الجامعي والضيافة على Odoo 20.",
        "أكثر من 5 تطبيقات ويب متجاوبة وأنظمة حجز ولوحات تحكم تعتمد على واجهات API، بنتائج Lighthouse تتجاوز 90.",
      ],
    },
  },
  {
    id: "pawspalconnect",
    title: { en: "Frontend Team Lead (React)", ar: "قائد فريق الواجهات الأمامية (React)" },
    company: { en: "PawsPalConnect", ar: "PawsPalConnect" },
    period: { en: "Oct 2025 – Feb 2026", ar: "أكتوبر 2025 – فبراير 2026" },
    tags: {
      en: ["React 19", "Redux Toolkit", "Team lead"],
      ar: ["React 19", "Redux Toolkit", "قيادة الفريق"],
    },
    notes: {
      en: [
        "Led and mentored a 3-person frontend team: technical decisions, code reviews and delivery.",
        "Appointment booking, vaccination tracking and an e-commerce dashboard.",
      ],
      ar: [
        "قدت فريق واجهات أمامية من 3 أشخاص ووجّهته: القرارات التقنية ومراجعة الشيفرة والتسليم.",
        "حجز المواعيد ومتابعة التطعيمات ولوحة تحكم لمتجر إلكتروني.",
      ],
    },
    certificate: {
      src: "/ppc-certificate.png",
      alt: "Internship completion certificate — Paws Pal Connect (NPT Solutions), Front-End Team Lead Intern, Abdallah Zaghloul, October 2025 to February 2026",
    },
  },
  {
    id: "goma",
    title: { en: "Frontend Web Developer", ar: "مطوّر واجهات ويب أمامية" },
    company: { en: "Goma+", ar: "Goma+" },
    period: { en: "Nov 2022 – Nov 2023", ar: "نوفمبر 2022 – نوفمبر 2023" },
    tags: {
      en: ["React", "Tailwind CSS"],
      ar: ["React", "Tailwind CSS"],
    },
    notes: {
      en: [
        "Responsive React and Tailwind production interfaces, fixing the performance issues behind recurring bug reports.",
      ],
      ar: [
        "واجهات إنتاجية متجاوبة بـ React وTailwind، مع حل مشكلات الأداء التي كانت وراء بلاغات الأخطاء المتكررة.",
      ],
    },
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
