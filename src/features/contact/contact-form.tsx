"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

export function ContactForm() {
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
      // Check if environment variables are set
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "JU0OSAtw3eIOUZnyC";
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_p4og2ep";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_p58b5ov";

      // Debug: Log what we're using (remove in production)
      console.log("EmailJS Config:", {
        publicKey: publicKey ? "✓ Set" : "✗ Missing",
        serviceId: serviceId ? "✓ Set" : "✗ Missing",
        templateId: templateId ? "✓ Set" : "✗ Missing",
      });

      if (!publicKey || !serviceId || !templateId) {
        throw new Error("EmailJS configuration is missing. Please restart your dev server after creating .env.local file.");
      }

      // Initialize EmailJS with your Public Key
      emailjs.init(publicKey);

      // Send email using EmailJS
      // Make sure these variable names match your EmailJS template variables
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,           // Maps to {{name}} in template
          email: formData.email,         // Maps to {{email}} in template
          message: formData.message,     // Maps to {{message}} in template
          // from_name: formData.name,      // Alternative if template uses {{from_name}}
          // from_email: formData.email,    // Alternative if template uses {{from_email}}
          time: new Date().toLocaleString(), // Optional: for {{time}} in template
        }
      );

      if (result.text === "OK") {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or contact me directly at f2002.a.z@gmail.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
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
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
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
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-2"
          >
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
            rows={6}
          />
        </div>
      </div>

      {submitStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-sm ${
            submitStatus.type === "success"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {submitStatus.message}
        </motion.div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="secondary"
        disabled={isSubmitting}
        className="w-full"
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
