"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import emailjs from "@emailjs/browser";
import { site } from "@/data/portfolio";

const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "JU0OSAtw3eIOUZnyC";
const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_p4og2ep";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_p58b5ov";

function emailJsMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const text = "text" in error ? String(error.text) : "";
    const message = "message" in error ? String(error.message) : "";
    const detail = text || message;
    if (/invalid grant|reconnect your gmail/i.test(detail)) {
      return "Gmail access for EmailJS expired. In the EmailJS dashboard, open Email Services → your Gmail service → Disconnect, then Connect Account again and enable “Send email on your behalf”.";
    }
    if (detail && detail !== "Network Error") return detail;
  }
  if (error instanceof Error && error.message) return error.message;
  return `Could not send the message. Email me at ${site.email}`;
}

export function ContactForm({ className }: { className?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: new Date().toLocaleString(),
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          user_name: formData.name,
          user_email: formData.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      if (result.status !== 200) {
        throw result;
      }

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({
        type: "error",
        message: emailJsMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex min-h-0 flex-1 flex-col gap-4", className)}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-muted">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-muted">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project or opportunity..."
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          rows={4}
          className="h-full min-h-[108px] flex-1"
        />
      </div>

      {submitStatus.type ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-4 text-sm ${
            submitStatus.type === "success"
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-red-500/20 bg-red-500/10 text-red-500"
          }`}
        >
          {submitStatus.message}
        </motion.div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        variant="primary"
        disabled={isSubmitting}
        className="mt-auto w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
