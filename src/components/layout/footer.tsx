"use client";

import { Container } from "@/components/ui/container";
import { useLocale, type Locale } from "@/components/locale-provider";

const copy: Record<Locale, { rights: string; links: { href: string; label: string }[] }> = {
  en: {
    rights: "© 2026 Abdallah Zaghloul",
    links: [
      { href: "#experience", label: "Experience" },
      { href: "#projects", label: "Projects" },
      { href: "#skills", label: "Skills" },
      { href: "#contact", label: "Get in touch" },
    ],
  },
  ar: {
    rights: "© 2026 عبدالله زغلول",
    links: [
      { href: "#experience", label: "الخبرة" },
      { href: "#projects", label: "المشاريع" },
      { href: "#skills", label: "المهارات" },
      { href: "#contact", label: "تواصل معي" },
    ],
  },
};

export function Footer() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <footer>
      <Container className="flex flex-col gap-2 pb-6 pt-6 md:h-[92px] md:flex-row md:items-center md:justify-between md:py-0">
        <p className="text-[15px] font-medium leading-5 text-muted">{text.rights}</p>
        <nav aria-label={locale === "ar" ? "التذييل" : "Footer"} className="flex flex-wrap gap-x-6">
          {text.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex h-11 items-center px-2 text-[15px] font-medium leading-5 text-muted transition-colors duration-[var(--duration-hover)] hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-text"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
