"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useLocale, type Locale } from "@/components/locale-provider";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "JU0OSAtw3eIOUZnyC";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_p4og2ep";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_p58b5ov";

type FormCopy = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  failed: string;
  arrow: string;
};

const copy: Record<Locale, FormCopy> = {
  en: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    message: "Message",
    messagePlaceholder: "What are you building?",
    send: "Send message",
    sending: "Sending…",
    sent: "Message sent. I'll reply soon.",
    failed: `Could not send the message. Email me at ${site.email}.`,
    arrow: "↗",
  },
  ar: {
    name: "الاسم",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    message: "الرسالة",
    messagePlaceholder: "ماذا تبني؟",
    send: "إرسال الرسالة",
    // AR? the three strings below are not in Figma
    sending: "جارٍ الإرسال…",
    sent: "تم إرسال الرسالة. سأردّ قريبًا.",
    failed: `تعذّر إرسال الرسالة. راسلني على ${site.email}.`,
    arrow: "↖",
  },
};

/** Underline field from the Figma contact block: label, value, 1px line that brightens on hover and focus. */
const fieldClass =
  "group block border-b border-contact-line pb-3 transition-colors duration-[var(--duration-hover)] hover:border-contact-muted focus-within:border-contact-accent focus-within:hover:border-contact-accent";
const labelClass = "block text-[15px] font-medium leading-5 text-contact-muted";
const inputClass =
  "mt-2 block w-full bg-transparent text-[17px] leading-[26px] text-contact-ink outline-none placeholder:text-contact-muted placeholder:opacity-70 disabled:opacity-60 md:text-[18px] md:leading-[27px]";

export function ContactForm({ className }: { className?: string }) {
  const { locale } = useLocale();
  const text = copy[locale];
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: values.name,
          email: values.email,
          message: values.message,
          time: new Date().toLocaleString(),
          from_name: values.name,
          from_email: values.email,
          reply_to: values.email,
          user_name: values.name,
          user_email: values.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      if (result.status !== 200) throw result;
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("failed");
    }
  };

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-8", className)}>
      <label className={fieldClass}>
        <span className={labelClass}>{text.name}</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={sending}
          value={values.name}
          onChange={onChange}
          placeholder={text.namePlaceholder}
          className={inputClass}
        />
      </label>

      <label className={fieldClass}>
        <span className={labelClass}>{text.email}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={sending}
          value={values.email}
          onChange={onChange}
          placeholder={text.emailPlaceholder}
          // Latin address stays LTR inside RTL text
          dir="ltr"
          className={cn(inputClass, "rtl:text-right")}
        />
      </label>

      <label className={fieldClass}>
        <span className={labelClass}>{text.message}</span>
        <textarea
          name="message"
          required
          disabled={sending}
          value={values.message}
          onChange={onChange}
          placeholder={text.messagePlaceholder}
          rows={3}
          className={cn(inputClass, "h-[79px] resize-none")}
        />
      </label>

      <div className="flex flex-col items-start gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-[52px] items-center gap-3 rounded-full bg-contact-btn px-6 text-[17px] font-semibold leading-5 text-contact-btn-fg transition-[filter,transform] duration-[var(--duration-hover)] hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-contact-accent disabled:opacity-60"
        >
          <span>{sending ? text.sending : text.send}</span>
          <span aria-hidden="true">{text.arrow}</span>
        </button>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-[15px] leading-[22px]",
            status === "failed" ? "text-contact-error" : "text-contact-accent",
            status === "sent" || status === "failed" ? "" : "sr-only",
          )}
        >
          {status === "sent" ? text.sent : status === "failed" ? text.failed : ""}
        </p>
      </div>
    </form>
  );
}
