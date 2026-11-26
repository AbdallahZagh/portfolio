import type { Locale } from "@/components/locale-provider";
import { arBugs, arCount } from "@/lib/ar-plural";

/**
 * Hero + builder copy.
 * EN and the Arabic live-state strings come from the signed-off Figma frames; the Arabic strings
 * Figma does not show were reviewed and revised in the v3 content review (portfolio-v3-final.md).
 * Counts in Arabic go through `arCount` so 1, 2, 3-10 and 11+ each get the right form.
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
    chipDrag: string;
    chipResize: string;
    hintMobile: string;
    reset: string;
    moveHint: string;
    /** Keyboard hint for the single-column list, where cards only move up and down. */
    moveHintList: string;
    privacy: string;
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
    downloadCv: "Download CV · PDF",
    builder: {
      title: "Dashboard builder",
      hintDesktop: "drag to swap · corner to resize",
      chipDrag: "Drag",
      chipResize: "Resize",
      hintMobile: "drag to reorder",
      reset: "Reset layout",
      moveHint: "Arrow keys move this widget. Shift plus arrow keys resize it.",
      moveHintList: "Up and down arrow keys move this widget.",
      privacy: "Runs locally in your browser — no tracking or data sent.",
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
        empty: "Start typing in Contact to see your signal",
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
    leadRest: " بـ React وNext.js وTypeScript. متاح لفرص العمل عن بُعد حول العالم.",
    leadRestMobile: " بـ React وNext.js وTypeScript. متاح لفرص العمل عن بُعد حول العالم.",
    talk: "تواصل معي",
    downloadCv: "تحميل السيرة الذاتية · PDF",
    builder: {
      title: "أداة بناء اللوحات",
      hintDesktop: "اسحب للتبديل · الزاوية لتغيير الحجم",
      chipDrag: "اسحب",
      chipResize: "غيّر الحجم",
      hintMobile: "اسحب لإعادة الترتيب",
      reset: "إعادة ضبط التخطيط",
      moveHint: "استخدم مفاتيح الأسهم لتحريك هذه البطاقة، وShift مع الأسهم لتغيير حجمها.",
      moveHintList: "استخدم السهمين لأعلى ولأسفل لتحريك هذه البطاقة.",
      privacy: "يعمل محليًا في متصفحك فقط — دون تتبّع أو إرسال أي بيانات.",
      handle: "اسحب للتحريك",
      resize: "اسحب لتغيير الحجم",
      moved: "تم النقل",
      resized: "تم تغيير الحجم",
    },
    status: {
      loading: "جارٍ التحميل",
      noData: "لا توجد بيانات",
      live: "مباشر",
      typing: "يكتب",
      sending: "جارٍ الإرسال",
      stable: "مستقر",
      patching: "جارٍ الإصلاح",
      physicsOn: "الفيزياء مفعّلة",
      sloshing: "يتموّج",
      paused: "متوقف",
      thisPage: "هذه الصفحة",
    },
    widgets: {
      scope: {
        title: "راسم الرسائل",
        sample: "«مرحبًا عبدالله، هل أنت متاح لمكالمة هذا الأسبوع؟»",
        warming: "جارٍ تهيئة الراسم…",
        empty: "ابدأ الكتابة في نموذج التواصل لترى إشارتك",
        transmitting: (n) =>
          `إرسال · ${arCount(n, { zero: `${n} أحرف`, one: "حرف واحد", two: "حرفان", few: `${n} أحرف`, many: `${n} حرفًا`, other: `${n} حرف` })}`,
      },
      telemetry: {
        title: "بيانات الزائر",
        unit: "م من حركة المؤشر",
        scroll: "التمرير",
        onPage: "على الصفحة",
        net: "الشبكة",
        noCursor: "لا يوجد مؤشر",
        noCursorHint: "شاشات اللمس تسجّل التمرير فقط.",
      },
      reactor: {
        title: "مفاعل الأخطاء",
        mini: "المفاعل",
        core: "النواة",
        bugs: (n) => arBugs(n),
        stable: (n) => `${arBugs(n)} · مستقر`,
        pulse: (n) => `${arBugs(n)} · نبضة ×${n}`,
        throw: "أطلق خطأً",
        patching: "جارٍ الإصلاح…",
        starting: "تشغيل النواة…",
        tap: "اضغط على النواة",
        reducedMotion: "تقليل الحركة مفعّل",
      },
      tanks: {
        title: "خزانات التقنيات",
        items: [
          { label: "React", short: "Re", value: 82 },
          { label: "TS", short: "TS", value: 74 },
          { label: "Next.js", short: "Nx", value: 66 },
          { label: "Motion", short: "Mo", value: 48 },
        ],
      },
      vitals: {
        title: "مؤشرات الويب",
        mini: "المؤشرات",
        measuring: "جارٍ القياس…",
        notReported: "غير متاح",
        good: "جيد",
        needsWork: "يحتاج تحسينًا",
        poor: "ضعيف",
      },
    },
  },
};
