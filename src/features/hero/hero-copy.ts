import type { Locale } from "@/components/locale-provider";

/**
 * Hero + builder copy.
 * EN and the Arabic live-state strings are read from the signed-off Figma frames.
 * Arabic strings marked `// AR?` are proposed translations for states Figma does not show
 * (loading, no data, interacting). They need the owner's approval before shipping.
 */
export type HeroCopy = {
  role: string;
  /** Headline lines. `accent` is the index of the line rendered in the brand colour. */
  headline: { lines: string[]; accent: number; accentWord?: string };
  leadStrong: string;
  leadRest: string;
  leadRestMobile: string;
  talk: string;
  downloadCv: string;
  builder: {
    title: string;
    hintDesktop: string;
    hintMobile: string;
    reset: string;
    moveHint: string;
    handle: string;
    resize: string;
    moved: string;
    resized: string;
  };
  status: {
    loading: string;
    noData: string;
    live: string;
    typing: string;
    sending: string;
    stable: string;
    patching: string;
    physicsOn: string;
    sloshing: string;
    paused: string;
    thisPage: string;
  };
  widgets: {
    scope: {
      title: string;
      sample: string;
      warming: string;
      empty: string;
      transmitting: (n: number) => string;
    };
    telemetry: {
      title: string;
      unit: string;
      scroll: string;
      onPage: string;
      net: string;
      noCursor: string;
      noCursorHint: string;
    };
    reactor: {
      title: string;
      mini: string;
      core: string;
      bugs: (n: number) => string;
      stable: (n: number) => string;
      pulse: (n: number) => string;
      throw: string;
      patching: string;
      starting: string;
      tap: string;
      reducedMotion: string;
    };
    tanks: {
      title: string;
      items: { label: string; short: string; value: number }[];
    };
    vitals: {
      title: string;
      mini: string;
      measuring: string;
      notReported: string;
      good: string;
      needsWork: string;
      poor: string;
    };
  };
};

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    role: "Frontend Engineer & Technical Lead (React / Next.js) · Damascus, Syria",
    headline: { lines: ["Interfaces", "for live", "data."], accent: 1, accentWord: "live" },
    leadStrong: "4+ years building production web applications",
    leadRest: " in React, Next.js and TypeScript. Available for worldwide remote opportunities.",
    leadRestMobile: " in React, Next.js and TypeScript. Available for worldwide remote opportunities.",
    talk: "Get in touch",
    downloadCv: "Download CV",
    builder: {
      title: "Dashboard builder",
      hintDesktop: "drag to swap · corner to resize",
      hintMobile: "drag to reorder",
      reset: "Reset layout",
      moveHint: "Arrow keys move this widget. Shift plus arrow keys resize it.",
      handle: "Drag to move",
      resize: "Drag to resize",
      moved: "moved",
      resized: "resized",
    },
    status: {
      loading: "Loading",
      noData: "No data",
      live: "Live",
      typing: "Typing",
      sending: "Sending",
      stable: "Stable",
      patching: "Patching",
      physicsOn: "Physics on",
      sloshing: "Sloshing",
      paused: "Paused",
      thisPage: "This page",
    },
    widgets: {
      scope: {
        title: "Message oscilloscope",
        sample: "“Hi Abdallah, are you free for a call this week?”",
        warming: "Warming up the scope…",
        empty: "Start typing in Let's talk to see your signal",
        transmitting: (n) => `Transmitting · ${n} characters`,
      },
      telemetry: {
        title: "Visitor telemetry",
        unit: "m of cursor travel",
        scroll: "Scroll",
        onPage: "On page",
        net: "Net",
        noCursor: "No cursor",
        noCursorHint: "Touch screens only report scroll.",
      },
      reactor: {
        title: "Bug reactor",
        mini: "Reactor",
        core: "Core",
        bugs: (n) => `${n} ${n === 1 ? "bug" : "bugs"}`,
        stable: (n) => `${n} ${n === 1 ? "bug" : "bugs"} · stable`,
        pulse: (n) => `${n} ${n === 1 ? "bug" : "bugs"} · pulse ×${n}`,
        throw: "Throw a bug",
        patching: "Patching…",
        starting: "Starting core",
        tap: "Tap the core",
        reducedMotion: "Reduced motion is on",
      },
      tanks: {
        title: "Stack tanks",
        items: [
          { label: "React", short: "Re", value: 82 },
          { label: "TS", short: "TS", value: 74 },
          { label: "Next.js", short: "Nx", value: 66 },
          { label: "Motion", short: "Mo", value: 48 },
        ],
      },
      vitals: {
        title: "Web vitals",
        mini: "Vitals",
        measuring: "Measuring…",
        notReported: "Not reported",
        good: "Good",
        needsWork: "Needs work",
        poor: "Poor",
      },
    },
  },
  ar: {
    role: "مهندس واجهات أمامية وقائد تقني (React / Next.js) · دمشق، سوريا",
    headline: { lines: ["واجهات", "للبيانات", "الحيّة."], accent: 1 },
    leadStrong: "أكثر من 4 سنوات في بناء تطبيقات ويب إنتاجية",
    // AR? lead, talk and downloadCv follow the CV wording, which Figma's Arabic frame does not have
    leadRest: " باستخدام React وNext.js وTypeScript. متاح لفرص العمل عن بُعد حول العالم.",
    leadRestMobile: " باستخدام React وNext.js وTypeScript. متاح لفرص العمل عن بُعد حول العالم.",
    talk: "تواصل معي",
    downloadCv: "تحميل السيرة الذاتية",
    builder: {
      title: "أداة بناء اللوحات",
      hintDesktop: "اسحب للتبديل · الزاوية لتغيير الحجم",
      hintMobile: "اسحب لإعادة الترتيب", // AR?
      reset: "إعادة ضبط التخطيط",
      moveHint: "مفاتيح الأسهم تحرّك هذه البطاقة، ومع Shift تغيّر حجمها.", // AR?
      handle: "اسحب للنقل", // AR?
      resize: "اسحب لتغيير الحجم", // AR?
      moved: "نُقلت", // AR?
      resized: "تغيّر حجمها", // AR?
    },
    status: {
      loading: "جارٍ التحميل", // AR?
      noData: "لا توجد بيانات", // AR?
      live: "مباشر",
      typing: "يكتب",
      sending: "يرسل", // AR?
      stable: "مستقر",
      patching: "يُصلح", // AR?
      physicsOn: "الفيزياء مفعّلة",
      sloshing: "يتموّج", // AR?
      paused: "متوقف", // AR?
      thisPage: "هذه الصفحة",
    },
    widgets: {
      scope: {
        title: "راسم الرسائل",
        sample: "”مرحبًا عبدالله، هل أنت متاح لمكالمة هذا الأسبوع؟“",
        warming: "جارٍ تهيئة الراسم…", // AR?
        empty: "ابدأ الكتابة في «لنتحدث» لترى إشارتك", // AR?
        transmitting: (n) => `إرسال · ${n} حرفًا`, // AR?
      },
      telemetry: {
        title: "بيانات الزائر",
        unit: "م مسافة المؤشر",
        scroll: "التمرير",
        onPage: "على الصفحة",
        net: "الشبكة",
        noCursor: "لا مؤشر", // AR?
        noCursorHint: "شاشات اللمس تُبلّغ عن التمرير فقط.", // AR?
      },
      reactor: {
        title: "مفاعل الأخطاء",
        mini: "المفاعل", // AR?
        core: "النواة",
        bugs: (n) => `${n} أخطاء`,
        stable: (n) => `${n} أخطاء · مستقر`,
        pulse: (n) => `${n} أخطاء · نبضة ×${n}`, // AR?
        throw: "ارمِ خطأ",
        patching: "جارٍ الإصلاح…", // AR?
        starting: "بدء النواة", // AR?
        tap: "المس النواة", // AR?
        reducedMotion: "الحركة المخفّضة مفعّلة", // AR?
      },
      tanks: {
        title: "خزانات التقنيات",
        items: [
          { label: "React", short: "Re", value: 82 },
          { label: "TS", short: "TS", value: 74 },
          { label: "Next.js", short: "Nx", value: 66 },
          { label: "الحركة", short: "حر", value: 48 },
        ],
      },
      vitals: {
        title: "مؤشرات الويب",
        mini: "المؤشرات", // AR?
        measuring: "جارٍ القياس…", // AR?
        notReported: "غير متاح", // AR?
        good: "جيد",
        needsWork: "يحتاج تحسينًا", // AR?
        poor: "ضعيف", // AR?
      },
    },
  },
};
