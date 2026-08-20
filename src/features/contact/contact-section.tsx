"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { site, socialLinks } from "@/data/portfolio";

function CopyRow({
  icon: Icon,
  label,
  value,
  copyValue,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  copyValue: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const input = document.createElement("textarea");
      input.value = copyValue;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <span className="block text-xs text-muted">{label}</span>
        <span className="block truncate text-sm font-medium">{value}</span>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-primary"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-primary" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border py-16 md:py-24">
      <Reveal className="page-wrap">
        <SectionHeading
          title="Contact"
          aside="Open to remote opportunities worldwide. If you need a React / Next.js engineer who cares about craft, reach out."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealItem>
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              Get in touch
            </h3>
            <div className="mt-6 divide-y divide-border/70 border-y border-border/70">
              <CopyRow
                icon={Mail}
                label="Email"
                value={site.email}
                copyValue={site.email}
              />
              <CopyRow
                icon={Phone}
                label="Phone"
                value={site.phone}
                copyValue={site.phone}
              />
              <div className="flex items-center gap-3 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted">Location</span>
                  <span className="text-sm font-medium">{site.location}</span>
                </span>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted">{site.availability}</p>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {social.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                );
              })}
            </div>
          </RevealItem>

          <RevealItem>
            <h3 className="mb-6 font-display text-2xl font-semibold tracking-tight">
              Send a message
            </h3>
            <ContactForm />
          </RevealItem>
        </div>
      </Reveal>
    </section>
  );
}
