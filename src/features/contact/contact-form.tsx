"use client";

import { useId, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLocale, type Locale } from "@/components/locale-provider";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "JU0OSAtw3eIOUZnyC";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_p4og2ep";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_p58b5ov";

/** A second message is accepted only after this long, so a bot cannot flood the inbox. */
const COOLDOWN_MS = 30_000;
const MIN_MESSAGE_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "failed" | "wait";

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
  failedBefore: string;
  failedAfter: string;
  wait: string;
  errors: Record<Field, string>;
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
    sent: "Thanks, I'll reply within 24 hours.",
    failedBefore: "Couldn't send. Email me directly at ",
    failedAfter: ".",
    wait: "Please wait a moment before sending another message.",
    errors: {
      name: "Please enter your name",
      email: "Enter a valid email address",
      message: `Write at least ${MIN_MESSAGE_LENGTH} characters`,
    },
  },
  ar: {
    name: "الاسم",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    message: "الرسالة",
    messagePlaceholder: "ماذا تبني؟",
    send: "أرسل الرسالة",
    sending: "جارٍ الإرسال…",
    sent: "شكرًا، سأردّ خلال 24 ساعة.",
    failedBefore: "تعذّر الإرسال. راسلني مباشرة على ",
    failedAfter: ".",
    wait: "يرجى الانتظار قليلًا قبل إرسال رسالة أخرى.",
    errors: {
      name: "يرجى إدخال اسمك",
      email: "أدخل بريدًا إلكترونيًا صحيحًا",
      message: `اكتب ${MIN_MESSAGE_LENGTH} أحرف على الأقل`,
    },
  },
};

const labelClass = "mb-2 block text-[15px] font-medium leading-5 text-ink";
const inputClass = cn(
  "block w-full rounded-[12px] border border-line bg-bg px-4 text-[17px] leading-6 text-ink",
  "placeholder:text-muted placeholder:opacity-80",
  "transition-colors duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:border-muted",
  "focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  "aria-[invalid=true]:border-danger disabled:opacity-60",
);

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[14px] font-medium leading-5 text-danger">
      {message}
    </p>
  );
}

export function ContactForm({ className }: { className?: string }) {
  const { locale } = useLocale();
  const text = copy[locale];
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const lastSentAt = useRef(0);
  const formId = useId();
  const errorId = (field: Field) => `${formId}-${field}-error`;
  const fieldId = (field: Field) => `${formId}-${field}`;

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "sent" || status === "failed" || status === "wait") setStatus("idle");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Hidden field: people never see it, bots fill it. Pretend it worked and send nothing.
    if ((form.elements.namedItem("company") as HTMLInputElement | null)?.value) {
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
      return;
    }

    const found: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) found.name = text.errors.name;
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = text.errors.email;
    if (values.message.trim().length < MIN_MESSAGE_LENGTH) found.message = text.errors.message;
    setErrors(found);
    const firstInvalid = (["name", "email", "message"] as const).find((field) => found[field]);
    if (firstInvalid) {
      setStatus("idle");
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    if (Date.now() - lastSentAt.current < COOLDOWN_MS) {
      setStatus("wait");
      return;
    }

    setStatus("sending");
    try {
      // Loaded on first send only, so visitors who never write do not download it.
      const { default: emailjs } = await import("@emailjs/browser");
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
      lastSentAt.current = Date.now();
      setValues({ name: "", email: "", message: "" });
      setStatus("sent");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("failed");
    }
  };

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-5", className)}>
      {/* Honeypot: off-screen and skipped by keyboards and screen readers. */}
      <input name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" className="sr-only" />

      <div>
        <label htmlFor={fieldId("name")} className={labelClass}>
          {text.name}
        </label>
        <input
          id={fieldId("name")}
          name="name"
          type="text"
          autoComplete="name"
          enterKeyHint="next"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorId("name") : undefined}
          disabled={sending}
          value={values.name}
          onChange={onChange}
          placeholder={text.namePlaceholder}
          className={cn(inputClass, "h-12")}
        />
        <FieldError id={errorId("name")} message={errors.name} />
      </div>

      <div>
        <label htmlFor={fieldId("email")} className={labelClass}>
          {text.email}
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          enterKeyHint="next"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? errorId("email") : undefined}
          disabled={sending}
          value={values.email}
          onChange={onChange}
          placeholder={text.emailPlaceholder}
          // Latin address stays LTR inside RTL text
          dir="ltr"
          className={cn(inputClass, "h-12 rtl:text-right")}
        />
        <FieldError id={errorId("email")} message={errors.email} />
      </div>

      <div>
        <label htmlFor={fieldId("message")} className={labelClass}>
          {text.message}
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          enterKeyHint="send"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId("message") : undefined}
          disabled={sending}
          value={values.message}
          onChange={onChange}
          placeholder={text.messagePlaceholder}
          rows={5}
          className={cn(inputClass, "h-[140px] resize-none py-3")}
        />
        <FieldError id={errorId("message")} message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand text-[17px] font-semibold leading-5 text-on-brand transition-[background-color,transform] duration-[var(--duration-hover)] ease-[var(--ease-standard)] hover:bg-brand-hover active:scale-[0.98] active:bg-brand-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-70 motion-reduce:active:scale-100"
      >
        {sending ? <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
        <span>{sending ? text.sending : text.send}</span>
      </button>

      <div role="status" aria-live="polite" className="text-[15px] leading-[22px]">
        {status === "sent" ? (
          <p className="flex items-start gap-2 font-medium text-brand-text">
            <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span>{text.sent}</span>
          </p>
        ) : null}
        {status === "failed" ? (
          <p className="font-medium text-danger">
            {text.failedBefore}
            <a href={`mailto:${site.email}`} dir="ltr" className="underline underline-offset-2">
              {site.email}
            </a>
            {text.failedAfter}
          </p>
        ) : null}
        {status === "wait" ? <p className="font-medium text-danger">{text.wait}</p> : null}
      </div>
    </form>
  );
}
