"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Instagram, Facebook } from "lucide-react";
import { ContactForm } from "./contact-form";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/AbdallahZagh",
    icon: Github,
    color: "text-foreground hover:text-secondary",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/abdallah-zaghloul",
    icon: Linkedin,
    color: "text-foreground hover:text-secondary",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/abdallahzagh?igsh=Z3Y4M2t0Ynh0bGgw",
    icon: Instagram,
    color: "text-foreground hover:text-secondary",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1CFGmxiMcT/",
    icon: Facebook,
    color: "text-foreground hover:text-secondary",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/10 to-background" />
      <div className="container relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center space-y-3"
        >
          <p className="text-xl font-mono uppercase tracking-[0.3em] text-primary">
            Contact
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">
            Let&apos;s collaborate <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">on your next frontend.</span>
          </h2>
          <p className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-muted leading-relaxed">
            Open to remote opportunities worldwide. If you&apos;re looking for a React / Next.js
            engineer who cares about performance, motion, and maintainable architecture, reach out.
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >

          {/* Contact Info & Social Links */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
            {/* Direct Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-display">
                  Get in touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="hidden sm:block p-2 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:f2002.a.z@gmail.com"
                        className="text-base md:text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        f2002.a.z@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="hidden sm:block p-2 rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+963932200022"
                        className="text-base md:text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        +963 932 200 022
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/40">
                    <div className="hidden sm:block p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted mb-1">
                        Location
                      </p>
                      <p className="text-base md:text-lg font-medium text-foreground">
                        Damascus, Syria (Remote)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
                    Available for worldwide remote opportunities
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-display">
                  Connect with me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {social.name}
                          </p>
                          <p className="text-xs text-muted">Visit my profile</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            </motion.div>
            {/* Contact Form */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-display">
                  Send me a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
