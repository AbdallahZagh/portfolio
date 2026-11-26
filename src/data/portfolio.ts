import type { LucideIcon } from "lucide-react";
import { Github, Linkedin } from "lucide-react";

/**
 * All site content. Source: ABDALLAH_ZAGHLOUL_Resume_2026-11-25.pdf.
 * English wording follows the CV. Arabic strings were reviewed and revised in the v3 content review
 * (portfolio-v3-final.md). Dates and Latin tokens inside Arabic text go through `ltr()` so the
 * slash, plus and dash never flip in right-to-left lines.
 */

/** Isolates a left-to-right run (dates, UTC+3) inside Arabic text. */
export const ltr = (text: string) => `\u2066${text}\u2069`;

/** A value in both site languages. */
export type Localized<T = string> = { en: T; ar: T };

export const site = {
  name: "Abdallah Zaghloul",
  shortName: "AZ",
  role: "Frontend Engineer & Technical Lead (React / Next.js)",
  email: "f2002.a.z@gmail.com",
  phone: "+963 932 200 022",
  phoneHref: "tel:+963932200022",
  location: "Damascus, Syria",
  availability: "Available for worldwide remote opportunities",
  url: "https://abdallahzagh.github.io/portfolio/",
  resumeHref: "/ABDALLAH_ZAGHLOUL_CV.pdf",
  resumeDownload: "ABDALLAH_ZAGHLOUL_CV.pdf",
  /** Professional Summary, verbatim. */
  bio: "Frontend engineer and technical lead with 4+ years building production web applications in React, Next.js and TypeScript. Takes products from an empty repository to release: real-time monitoring dashboards, drag-and-drop builders and editors, motion-rich marketing sites, and bilingual Arabic/English products with full RTL support. Has led a frontend team, managed delivery with external vendors, and works across the stack when a product needs it (NestJS, PostgreSQL, React Native, Odoo). Owns work end to end, from requirements and architecture to QA, deployment and handover.",
};

export const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export type SocialLink = { name: string; url: string; label: string; icon: LucideIcon };

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/AbdallahZagh",
    label: "github.com/AbdallahZagh",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abdallah-zagh-374332397",
    label: "linkedin.com/in/abdallah-zagh-374332397",
    icon: Linkedin,
  },
];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export type Experience = {
  id: string;
  title: Localized;
  /** Company line as shown, e.g. "Elathr Business · Remote". Omitted when the CV has none. */
  company?: Localized;
  period: Localized;
  tags: Localized<string[]>;
  /** CV bullets, verbatim in English. */
  bullets: Localized<string[]>;
  certificate?: { src: string; alt: Localized };
};

/** Newest first, as in the CV. */
export const experiences: Experience[] = [
  {
    id: "elathr",
    title: { en: "Technical Lead", ar: "قائد تقني" },
    company: { en: "Elathr Business · Remote (Contract)", ar: "Elathr Business · عن بُعد (عقد)" },
    period: { en: "10/2026 – Present", ar: `${ltr("10/2026")} – حتى الآن` },
    tags: {
      en: ["Vendor delivery", "Requirements", "Sprint QA"],
      ar: ["تسليم المزوّدين", "المتطلبات", "ضمان جودة السبرنت"],
    },
    bullets: {
      en: [
        "Lead technical delivery of multiple vendor-built products.",
        "Write requirements, scope and change requests, and review vendor contracts for scope, acceptance and hosting terms.",
        "Run design reviews; wrote the corporate website's redesign brief, aligned with the company profile and brand.",
        "QA every vendor sprint end to end on web and mobile (registration/OTP, payments, admin) and deliver written defect reports.",
        "Own infrastructure decisions: AWS hosting plan, Apple/Google developer accounts, Supabase self-hosting and the AI provider.",
      ],
      ar: [
        "أقود التسليم التقني لعدة منتجات يطوّرها مزوّدون خارجيون.",
        "أكتب المتطلبات ونطاق العمل وطلبات التغيير، وأراجع عقود المزوّدين من حيث النطاق والقبول وشروط الاستضافة.",
        "أدير مراجعات التصميم؛ وكتبتُ موجز إعادة تصميم موقع الشركة بما ينسجم مع الملف التعريفي للشركة وهويتها.",
        "أختبر كل سبرنت للمزوّد من البداية إلى النهاية على الويب والجوال (التسجيل/OTP والمدفوعات ولوحة الإدارة) وأسلّم تقارير مكتوبة بالأخطاء.",
        "أتولى قرارات البنية التحتية: خطة الاستضافة على AWS وحسابات مطوّري Apple/Google واستضافة Supabase ذاتيًا ومزوّد الذكاء الاصطناعي.",
      ],
    },
  },
  {
    id: "sama-tech",
    title: { en: "Frontend Engineer", ar: "مهندس واجهات أمامية" },
    company: { en: "Sama-Tech", ar: "Sama-Tech" },
    period: { en: "03/2026 – Present", ar: `${ltr("03/2026")} – حتى الآن` },
    tags: {
      en: ["React 19", "Next.js 16", "Socket.IO", "Mapbox GL"],
      ar: ["React 19", "Next.js 16", "Socket.IO", "Mapbox GL"],
    },
    bullets: {
      en: [
        "Single-handedly built IoT Platform v2, a ground-up rebuild of the legacy IoT dashboard on React 19, Vite, TypeScript, Tailwind v4, Zustand and TanStack Query, working from the old frontend alone with no backend or team support.",
        "Built a drag-and-drop dashboard builder with 30+ configurable widget types (gauges, charts, tables, switches, sliders, tanks/pipes/pumps, live camera streams) and live-preview settings.",
        "Delivered 20+ IoT modules, with real-time telemetry over Socket.IO, Mapbox GL maps, Stripe, Arabic/English/Urdu with RTL, and Vitest and Playwright tests.",
        "Built the Sama Fire fire-safety monitoring platform in React 19 and Vite, covering sites, buildings and levels, gateways and fire panels, live events and incidents, maintenance, cameras, assets, subscriptions and a Super Admin console.",
        "Created a drag-and-drop floor-plan editor that places assets and fire panels on building plans, and wired live alarms through Socket.IO and Firebase push (including background notifications), with permission-based access and Arabic/English/Urdu RTL support.",
        "Built the company website in Next.js 16 and React 19: 25 pages covering company platforms, product pages and blog, with scroll-driven animation in GSAP and Framer Motion.",
      ],
      ar: [
        "بنيتُ بمفردي IoT Platform v2، إعادة بناء كاملة من الصفر للوحة تحكم IoT القديمة باستخدام React 19 وVite وTypeScript وTailwind v4 وZustand وTanStack Query، اعتمادًا على الواجهة الأمامية القديمة وحدها، دون فريق أو دعم من مطوّري الخلفية.",
        "بنيتُ أداة لبناء لوحات التحكم بالسحب والإفلات تضم أكثر من 30 نوعًا قابلًا للضبط من الودجات (مقاييس ومخططات وجداول ومفاتيح ومنزلقات وخزانات/أنابيب/مضخات وبثّ مباشر للكاميرات) مع إعدادات بمعاينة حيّة.",
        "أنجزتُ أكثر من 20 وحدة IoT، مع بيانات لحظية عبر Socket.IO وخرائط Mapbox GL وStripe والعربية/الإنجليزية/الأردية مع RTL واختبارات Vitest وPlaywright.",
        "بنيتُ منصة Sama Fire لمراقبة السلامة من الحرائق بـ React 19 وVite، وتشمل المواقع والمباني والطوابق والبوابات ولوحات الحريق والأحداث والحوادث المباشرة والصيانة والكاميرات والأصول والاشتراكات ولوحة Super Admin.",
        "أنشأتُ محرر مخططات طوابق بالسحب والإفلات يضع الأصول ولوحات الحريق على مخططات المباني، وربطتُ الإنذارات المباشرة عبر Socket.IO وإشعارات Firebase (بما فيها الإشعارات في الخلفية)، مع صلاحيات وصول ودعم العربية/الإنجليزية/الأردية بـ RTL.",
        "بنيتُ موقع الشركة بـ Next.js 16 وReact 19: 25 صفحة تغطي منصات الشركة ومنتجاتها ومدونتها، مع حركات مرتبطة بالتمرير بـ GSAP وFramer Motion.",
      ],
    },
  },
  {
    id: "software-developer",
    title: { en: "Software Developer", ar: "مطوّر برمجيات" },
    company: { en: "Freelance", ar: "عمل حر" },
    period: { en: "2023 – Present", ar: `${ltr("2023")} – حتى الآن` },
    tags: {
      en: ["Odoo", "React", "Performance"],
      ar: ["Odoo", "React", "الأداء"],
    },
    bullets: {
      en: [
        "Co-developed a bilingual (Arabic/English) university housing and hospitality ERP on Odoo 20, covering housing contracts, hotel bookings, POS, inventory, treasury, HR and maintenance.",
        "Built Odoo modules in Python, XML and JavaScript: cashier desk and POS wallet with payment verification, purchase receipts with barcode search, damage incidents, laundry pricing and consumable stock workflows.",
        "Developed 5+ responsive web applications, focusing on high performance and component reusability.",
        "Built custom booking systems and API-driven dashboards for international clients.",
        "Optimized web performance and accessibility, achieving 90+ Lighthouse scores for key client projects.",
      ],
      ar: [
        "شاركتُ في تطوير نظام ERP ثنائي اللغة (العربية/الإنجليزية) للسكن الجامعي والضيافة على Odoo 20، يشمل عقود السكن وحجوزات الفنادق ونقاط البيع والمخزون والخزينة والموارد البشرية والصيانة.",
        "بنيتُ وحدات Odoo بـ Python وXML وJavaScript: مكتب الكاشير ومحفظة نقطة البيع مع التحقق من الدفع، وإيصالات الشراء مع البحث بالباركود، وحوادث التلف، وتسعير المغسلة، وسير عمل مخزون المستهلكات.",
        "طوّرتُ أكثر من 5 تطبيقات ويب متجاوبة، مع التركيز على الأداء العالي وإعادة استخدام المكوّنات.",
        "بنيتُ أنظمة حجز مخصصة ولوحات تحكم تعتمد على واجهات API لعملاء دوليين.",
        "حسّنتُ أداء الويب وإتاحته، وحققتُ نتائج Lighthouse تتجاوز 90 في مشاريع العملاء الرئيسية.",
      ],
    },
  },
  {
    id: "pawspalconnect",
    title: { en: "Frontend Team Lead (Internship)", ar: "قائد فريق الواجهات الأمامية (تدريب)" },
    company: { en: "PawsPalConnect", ar: "PawsPalConnect" },
    period: { en: "10/2025 – 02/2026", ar: ltr("10/2025 – 02/2026") },
    tags: {
      en: ["React 19", "Redux Toolkit", "Team lead"],
      ar: ["React 19", "Redux Toolkit", "قيادة الفريق"],
    },
    bullets: {
      en: [
        "Led and mentored a 3-person frontend team: technical decisions, reviews, and delivery.",
        "Architected a production-grade pet-care platform utilizing React 19 and Redux Toolkit, resulting in a highly scalable and maintainable codebase.",
        "Developed complex features including appointment booking, vaccination tracking, and an e-commerce dashboard.",
        "Implemented a modern, responsive design system using Tailwind CSS v4, reducing CSS technical debt.",
        "Integrated real-time data visualization using Chart.js and Recharts for operational insights.",
      ],
      ar: [
        "قدتُ فريق واجهات أمامية من 3 أشخاص ووجّهته: القرارات التقنية والمراجعات والتسليم.",
        "صمّمتُ البنية المعمارية لمنصة رعاية حيوانات أليفة جاهزة للإنتاج باستخدام React 19 وRedux Toolkit، مما أثمر قاعدة شيفرة قابلة للتوسع وسهلة الصيانة.",
        "طوّرتُ ميزات معقدة منها حجز المواعيد ومتابعة التطعيمات ولوحة تحكم لمتجر إلكتروني.",
        "نفّذتُ نظام تصميم حديثًا ومتجاوبًا بـ Tailwind CSS v4 قلّل الدين التقني في CSS.",
        "دمجتُ رسومًا بيانية لحظية باستخدام Chart.js وRecharts لعرض المؤشرات التشغيلية.",
      ],
    },
    certificate: {
      src: "/ppc-certificate.webp",
      alt: {
        en: "Internship completion certificate — Paws Pal Connect (NPT Solutions), Front-End Team Lead Intern, Abdallah Zaghloul, October 2025 to February 2026",
        ar: "شهادة إتمام التدريب — Paws Pal Connect (NPT Solutions)، متدرّب قائد فريق الواجهات الأمامية، عبدالله زغلول، من أكتوبر 2025 إلى فبراير 2026",
      },
    },
  },
  {
    id: "goma",
    title: { en: "Frontend Web Developer", ar: "مطوّر واجهات ويب أمامية" },
    company: { en: "Goma+", ar: "Goma+" },
    period: { en: "11/2022 – 11/2023", ar: ltr("11/2022 – 11/2023") },
    tags: {
      en: ["React", "Tailwind CSS"],
      ar: ["React", "Tailwind CSS"],
    },
    bullets: {
      en: [
        "Built responsive React and Tailwind interfaces with a cross-functional team.",
        "Maintained production UI and fixed performance issues that were driving bug reports.",
      ],
      ar: [
        "بنيتُ واجهات React وTailwind متجاوبة ضمن فريق متعدد التخصصات.",
        "تولّيتُ صيانة واجهات الإنتاج وأصلحتُ مشكلات الأداء التي كانت وراء بلاغات الأخطاء.",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type FeaturedProject = {
  id: string;
  kicker: Localized;
  title: Localized;
  description: Localized;
  bullets: Localized<string[]>;
  tags: string[];
  /** Main screenshot, always visible. */
  image: ProjectImage;
  /** Two extra screenshots that slide out from behind the main one on hover. */
  sideImages: { left: ProjectImage; right: ProjectImage };
  demoHref: string;
};

export type ProjectImage = { src: string; alt: Localized; width: number; height: number };

export const featuredProject: FeaturedProject = {
  id: "nova",
  kicker: { en: "01 · Web, mobile, Windows, API", ar: "01 · ويب وجوال وWindows وAPI" },
  title: { en: "Nova — Task & collaboration platform", ar: "Nova — منصة للمهام والتعاون" },
  description: {
    en: "Designed and built solo a Linear-style product: projects, Kanban, Gantt timeline, whiteboards, notes, subscriptions and a Super Admin console.",
    ar: "صمّمتُ وبنيتُ بمفردي منتجًا على غرار Linear: مشاريع ولوحات Kanban ومخطط Gantt زمني وسبورات بيضاء وملاحظات واشتراكات ولوحة Super Admin.",
  },
  bullets: {
    en: [
      "MCP server with OAuth that lets AI assistants manage projects, tasks, members and comments through 28 tools.",
      "Native Windows app (WinUI 3, .NET 8) with always-on-top sticky notes, a global hotkey, tray mode and Windows notifications.",
      "Next.js 16 web app and Expo (React Native) mobile app with live cross-device sync, AI task suggestions (Gemini) and push notifications.",
      "NestJS 11 API with Prisma, PostgreSQL, OTP auth, Supabase Realtime, an audit log and support tickets (27 modules).",
    ],
    ar: [
      "خادم MCP مع OAuth يتيح لمساعدي الذكاء الاصطناعي إدارة المشاريع والمهام والأعضاء والتعليقات عبر 28 أداة.",
      "تطبيق Windows أصلي (WinUI 3 و.NET 8) مع ملاحظات لاصقة دائمة الظهور واختصار عام وإخفاء في شريط النظام وإشعارات Windows.",
      "تطبيق ويب بـ Next.js 16 وتطبيق جوال بـ Expo (React Native) مع مزامنة حيّة بين الأجهزة واقتراحات مهام بالذكاء الاصطناعي (Gemini) وإشعارات فورية.",
      "واجهة API بـ NestJS 11 مع Prisma وPostgreSQL ومصادقة OTP وSupabase Realtime وسجل تدقيق وتذاكر دعم (27 وحدة).",
    ],
  },
  tags: ["Next.js 16", "Expo", "WinUI 3", "NestJS 11"],
  image: {
    src: "/nova-screenshot.webp",
    alt: {
      en: "Nova task board: the Aurora Launch project with To Do, In Progress, In Review and Completed columns",
      ar: "لوحة مهام Nova: مشروع Aurora Launch بأعمدة للمهام المطلوبة وقيد التنفيذ وقيد المراجعة والمكتملة",
    },
    width: 1248,
    height: 672,
  },
  sideImages: {
    left: {
      src: "/nova-light.webp",
      alt: {
        en: "Nova dashboard in light mode, showing the last project, last whiteboard and tasks due today",
        ar: "لوحة Nova في الوضع الفاتح تعرض آخر مشروع وآخر سبورة والمهام المستحقة اليوم",
      },
      width: 1077,
      height: 580,
    },
    right: {
      src: "/nova-timeline.webp",
      alt: {
        en: "Nova timeline calendar with tasks and subscription charges color-coded by status",
        ar: "التقويم الزمني في Nova مع المهام ورسوم الاشتراكات ملوّنة حسب الحالة",
      },
      width: 1077,
      height: 580,
    },
  },
  demoHref: "https://nova-task-management.netlify.app/",
};

export type ProjectRow = {
  id: string;
  /** Row number as in Figma: 02, 03, 04, 05. */
  index: string;
  title: Localized;
  category: Localized;
  /** Longer explanation, shown first when the row is opened. */
  description?: Localized;
  /** What the project is and does. */
  bullets: Localized<string[]>;
  /** What the owner personally built (only for team projects). */
  contribution?: Localized<string[]>;
  tags?: string[];
  href?: string;
};

export const projectRows: ProjectRow[] = [
  {
    id: "meeting-erp",
    index: "02",
    title: { en: "Meeting ERP", ar: "Meeting ERP" },
    category: {
      en: "University housing & hospitality ERP",
      ar: "نظام ERP للسكن الجامعي والضيافة",
    },
    description: {
      en: "A bilingual (Arabic/English) ERP for a university's student housing and hospitality, built on Odoo Community 20 with a Flutter app for residents. A team project that I co-developed.",
      ar: "نظام ERP ثنائي اللغة (العربية/الإنجليزية) للسكن الجامعي والضيافة، مبني على Odoo Community 20 مع تطبيق Flutter للمقيمين. مشروع فريق شاركتُ في تطويره.",
    },
    bullets: {
      en: [
        "Housing and hotel: 322 rooms across three buildings, seasonal and yearly contracts, reservations and a guest portal.",
        "Cafeteria POS with a separate slip per prep department, and wallets in USD and SYP with independently reviewed Sham Cash transfers.",
        "Purchasing and warehouses: supplier invoices read by AI from photos, with receiving checked per warehouse.",
        "HR, payroll and accounting with separated duties, plus a student app, a Telegram assistant and smart-meter readings.",
      ],
      ar: [
        "السكن والفندق: 322 غرفة في ثلاثة مبانٍ، وعقود فصلية وسنوية، وحجوزات وبوابة للضيوف.",
        "نقطة بيع الكافتيريا بقسيمة منفصلة لكل قسم تجهيز، ومحافظ بالدولار والليرة السورية مع مراجعة مستقلة لتحويلات شام كاش.",
        "المشتريات والمستودعات: فواتير الموردين يقرؤها الذكاء الاصطناعي من الصور، مع التحقق من الاستلام في كل مستودع.",
        "الموارد البشرية والرواتب والمحاسبة بفصل المهام، إضافةً إلى تطبيق للطلاب ومساعد تلغرام وقراءات العدادات الذكية.",
      ],
    },
    contribution: {
      en: [
        "Cashier desk and POS wallet payments, with payment verification covered by regression tests.",
        "Laundry pricing, consumable stock workflows and warehouse disposals.",
        "Purchase receipts with barcode search, damage incidents and Arabic translations.",
      ],
      ar: [
        "مكتب الكاشير ومدفوعات محفظة نقطة البيع، مع التحقق من الدفع مغطّى باختبارات التراجع.",
        "تسعير المغسلة، وسير عمل مخزون المستهلكات، وإتلاف مخزون المستودعات.",
        "إيصالات الشراء مع البحث بالباركود، وحوادث التلف، والترجمات العربية.",
      ],
    },
    tags: ["Odoo 20", "Python", "PostgreSQL", "Flutter"],
  },
  {
    id: "figma-mcp-bridge",
    index: "03",
    title: { en: "Figma MCP Bridge", ar: "Figma MCP Bridge" },
    category: { en: "MCP server and Figma plugin", ar: "خادم MCP وإضافة Figma" },
    description: {
      en: "A bridge that lets local AI agents read and edit live Figma files through the Model Context Protocol. I built both halves: an MCP server and a Figma Desktop plugin, connected over a local WebSocket.",
      ar: "جسر يتيح لوكلاء الذكاء الاصطناعي المحليين قراءة ملفات Figma الحيّة وتعديلها عبر Model Context Protocol. بنيتُ الجزأين: خادم MCP وإضافة Figma Desktop، متصلين عبر WebSocket محلي.",
    },
    bullets: {
      en: [
        "Create and edit nodes: frames, text, auto layout, SVG and image fills, with search and selection tools so the agent can find what it needs.",
        "Design-system tools: components and instances (create, swap, detach), variable collections with light and dark modes, and variable binding.",
        "Prototype tools: click reactions with Smart Animate, a flow start point, and export of any node to PNG, JPG, SVG or PDF.",
        "A plain HTTP endpoint next to MCP, so scripts can drive Figma without an AI client.",
      ],
      ar: [
        "إنشاء العقد وتعديلها: الإطارات والنصوص والتخطيط التلقائي وتعبئات SVG والصور، مع أدوات بحث وتحديد ليجد الوكيل ما يحتاجه.",
        "أدوات نظام التصميم: المكوّنات والنُّسخ (إنشاء واستبدال وفصل)، ومجموعات المتغيّرات بوضعين فاتح وداكن، وربط المتغيّرات.",
        "أدوات النماذج التفاعلية: تفاعلات النقر مع Smart Animate، ونقطة بداية للمسار، وتصدير أي عقدة إلى PNG أو JPG أو SVG أو PDF.",
        "واجهة HTTP مباشرة إلى جانب MCP، لتتحكم السكربتات في Figma دون عميل ذكاء اصطناعي.",
      ],
    },
    tags: ["MCP", "Figma Plugin API", "WebSocket", "Node.js"],
  },
  {
    id: "clinic-management",
    index: "04",
    title: { en: "Clinic Management System", ar: "نظام إدارة العيادات" },
    category: { en: "Administrative & Doctor Dashboards", ar: "لوحات الإدارة والأطباء" },
    description: {
      en: "Administrative and doctor dashboards for a medical clinic, built around the daily work of appointments and patient records. I was the frontend engineer.",
      ar: "لوحتا إدارة وأطباء لعيادة طبية، مبنيتان حول العمل اليومي للمواعيد وسجلات المرضى. كنتُ مهندس الواجهة الأمامية.",
    },
    bullets: {
      en: [
        "Designed Administrative and Doctor dashboards with a focus on workflow efficiency.",
        "Implemented multi-language support (i18n) to cater to international clinic operations.",
      ],
      ar: [
        "صمّمتُ لوحتي الإدارة والأطباء مع التركيز على كفاءة سير العمل.",
        "نفّذتُ دعم تعدد اللغات (i18n) بما يناسب عمليات العيادات الدولية.",
      ],
    },
    tags: ["React", "Redux Toolkit", "Tailwind CSS", "i18next", "Axios"],
  },
  {
    id: "e-commerce",
    index: "05",
    title: { en: "E-Commerce Web Application", ar: "تطبيق ويب للتجارة الإلكترونية" },
    category: { en: "Real-time cart state", ar: "حالة سلة لحظية" },
    description: {
      en: "A storefront frontend built for speed, where the cart stays in sync everywhere in the app as shoppers add and change items. I was the frontend engineer.",
      ar: "واجهة أمامية لمتجر إلكتروني مبنية للسرعة، تبقى فيها السلة متزامنة في كل أنحاء التطبيق أثناء إضافة المتسوّق للمنتجات وتعديلها. كنتُ مهندس الواجهة الأمامية.",
    },
    bullets: {
      en: [
        "Developed a high-performance frontend with real-time state synchronization for cart management.",
      ],
      ar: ["طوّرتُ واجهة أمامية عالية الأداء مع مزامنة لحظية لحالة سلة التسوق."],
    },
    tags: ["React", "Redux", "Tailwind CSS", "Chart.js", "Recharts"],
  },
];

// ---------------------------------------------------------------------------
// Skills, education, languages
// ---------------------------------------------------------------------------

export type SkillGroup = { id: string; label: Localized; items: string[] };

/** In CV order. Items are verbatim (shown with " · " separators as in Figma). */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: { en: "Frontend", ar: "الواجهة الأمامية" },
    items: [
      "React 18/19",
      "Next.js 16",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "React Router",
      "Vite",
      "React Hook Form",
      "Zod",
      "dnd-kit",
    ],
  },
  {
    id: "ui-motion",
    label: { en: "UI & Motion", ar: "الواجهة والحركة" },
    items: ["Tailwind CSS v4", "Material UI", "GSAP", "Framer Motion", "DaisyUI"],
  },
  {
    id: "integrations-ai",
    label: { en: "Integrations & AI", ar: "التكاملات والذكاء الاصطناعي" },
    items: ["Firebase (FCM)", "Stripe", "Google Gemini", "MCP servers", "Figma plugin API"],
  },
  {
    id: "localization",
    label: { en: "Localization", ar: "التوطين" },
    items: ["i18n", "i18next", "RTL layouts"],
  },
  {
    id: "backend",
    label: { en: "Backend & data", ar: "الخلفية والبيانات" },
    items: [
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "REST",
      "JWT/Passport",
      "OAuth 2.0",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Python",
      "Odoo",
    ],
  },
  {
    id: "testing",
    label: { en: "Testing", ar: "الاختبار" },
    items: ["Vitest", "Playwright", "React Testing Library", "Jest"],
  },
  {
    id: "state-data",
    label: { en: "State & Data", ar: "الحالة والبيانات" },
    items: ["Redux Toolkit", "Zustand", "TanStack Query", "Context API", "Axios"],
  },
  {
    id: "3d-maps-realtime",
    label: { en: "3D, Maps & Real-time", ar: "الرسوم ثلاثية الأبعاد والخرائط والبيانات اللحظية" },
    items: ["Socket.IO", "Supabase Realtime", "Mapbox GL", "Three.js"],
  },
  {
    id: "leadership",
    label: { en: "Leadership & Process", ar: "القيادة والعمليات" },
    items: [
      "team leadership",
      "vendor management",
      "requirements and change requests",
      "sprint QA",
      "code and design reviews",
      "Agile/Scrum",
    ],
  },
  {
    id: "mobile-desktop",
    label: { en: "Mobile & Desktop", ar: "الجوال وسطح المكتب" },
    items: ["Expo", "React Native", "NativeWind", "WinUI 3 / .NET 8"],
  },
  {
    id: "tooling",
    label: { en: "Tooling", ar: "الأدوات" },
    items: ["Git", "GitHub", "GitLab"],
  },
];

export const education = {
  label: { en: "Education", ar: "التعليم" } as Localized,
  value: {
    en: "BSc in Information Technology (AI Specialization), Al-Sham Private University · 03/2025",
    ar: `بكالوريوس تقنية المعلومات (تخصص الذكاء الاصطناعي)، جامعة الشام الخاصة · ${ltr("03/2025")}`,
  } as Localized,
};

export const languages = {
  label: { en: "Languages", ar: "اللغات" } as Localized,
  value: {
    en: "Arabic: Native · English: C1",
    ar: "العربية: اللغة الأم · الإنجليزية: C1",
  } as Localized,
};

// ---------------------------------------------------------------------------
// Skills as six chip groups (every CV skill is kept; the long ones fold behind "+N")
// ---------------------------------------------------------------------------

export type SkillChipGroup = { id: string; label: Localized; items: Localized<string[]> };

const itemsOf = (...ids: string[]) => ids.flatMap((id) => skillGroups.find((group) => group.id === id)?.items ?? []);
const same = (items: string[]): Localized<string[]> => ({ en: items, ar: items });

export const skillChipGroups: SkillChipGroup[] = [
  {
    id: "frontend",
    label: { en: "Frontend", ar: "الواجهة الأمامية" },
    items: same(itemsOf("frontend", "localization", "mobile-desktop")),
  },
  {
    id: "state-data",
    label: { en: "State & data", ar: "الحالة والبيانات" },
    items: same([...itemsOf("state-data"), "Socket.IO", "Supabase Realtime"]),
  },
  {
    id: "ui-motion",
    label: { en: "UI & motion", ar: "الواجهة والحركة" },
    items: same([...itemsOf("ui-motion"), "Mapbox GL", "Three.js"]),
  },
  {
    id: "backend",
    label: { en: "Backend", ar: "الخلفية" },
    items: same(itemsOf("backend", "integrations-ai")),
  },
  {
    id: "testing",
    label: { en: "Testing", ar: "الاختبار" },
    items: same(itemsOf("testing")),
  },
  {
    id: "tools",
    label: { en: "Tools", ar: "الأدوات" },
    items: {
      en: itemsOf("tooling", "leadership"),
      ar: [
        ...itemsOf("tooling"),
        "قيادة الفريق",
        "إدارة المزوّدين",
        "المتطلبات وطلبات التغيير",
        "ضمان جودة السبرنت",
        "مراجعات الشيفرة والتصميم",
        "Agile/Scrum",
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Bidi: Latin runs inside Arabic text
// ---------------------------------------------------------------------------

const LATIN_WORD = String.raw`\.?[A-Za-z](?:[A-Za-z0-9+#./_-]*[A-Za-z0-9+#])?`;
const LATIN_NUMBER = String.raw`[0-9]+(?:[./][0-9]+)*\+?`;
const LATIN_PAREN = String.raw`\(${LATIN_WORD}(?: +(?:${LATIN_WORD}|${LATIN_NUMBER}))*\)`;
const LATIN_RUN = new RegExp(
  String.raw`(?:${LATIN_WORD}|${LATIN_PAREN})(?: +(?:${LATIN_WORD}|${LATIN_NUMBER}|${LATIN_PAREN}))*`,
  "g",
);

/**
 * Wraps every Latin run (product names, versions, ".NET 8", "Expo (React Native)") in a left-to-right
 * isolate so punctuation, digits and parentheses next to it cannot jump across in right-to-left lines.
 * Text that already carries isolates (dates from `ltr()`) is left alone.
 */
export function isolateLatin(text: string): string {
  if (text.includes("\u2066")) return text;
  return text.replace(LATIN_RUN, (run) => `\u2066${run}\u2069`);
}

/** Walks the content tree once and isolates the Arabic side of every { en, ar } pair, in place. */
function isolateArabicContent(node: unknown): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(isolateArabicContent);
    return;
  }
  const record = node as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (key === "ar" && typeof value === "string") record[key] = isolateLatin(value);
    else if (key === "ar" && Array.isArray(value) && value.every((item) => typeof item === "string")) {
      record[key] = (value as string[]).map(isolateLatin);
    } else isolateArabicContent(value);
  }
}

isolateArabicContent([experiences, featuredProject, projectRows, skillChipGroups, education, languages]);