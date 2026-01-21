"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";
import { Calendar, MapPin, GraduationCap } from "lucide-react";

const experiences = [
  {
    title: "Frontend Team Lead (React)",
    company: "PawsPalConnect",
    period: "Oct 2025 - Present",
    location: "Remote",
    achievements: [
      "Lead and mentor a 3-member frontend team, overseeing technical decisions and ensuring high-quality delivery.",
      "Architected a production-grade pet-care platform utilizing React 19 and Redux Toolkit, resulting in a highly scalable and maintainable codebase.",
      "Developed complex features including appointment booking, vaccination tracking, and an e-commerce dashboard.",
      "Implemented a modern, responsive design system using Tailwind CSS v4, reducing CSS technical debt.",
      "Integrated real-time data visualization using Chart.js and Recharts for operational insights.",
    ],
  },
  {
    title: "Frontend Web Developer (Freelance)",
    company: "Self-Employed",
    period: "2023 - Present",
    location: "Remote",
    achievements: [
      "Developed 5+ responsive web applications, focusing on high performance and component reusability.",
      "Built custom booking systems and API-driven dashboards for international clients.",
      "Optimized web performance and accessibility, achieving 90+ Lighthouse scores for key client projects.",
    ],
  },
  {
    title: "Frontend Web Developer",
    company: "Goma+",
    period: "Nov 2022 - Nov 2023",
    location: "Remote",
    achievements: [
      "Collaborated with cross-functional teams to build responsive interfaces using React and Tailwind CSS.",
      "Maintained existing codebases, reducing bug reports by resolving critical performance bottlenecks.",
    ],
  },
];

const education = {
  degree: "BSc in Information Technology (AI Specialization)",
  institution: "Al-Sham Private University",
  date: "March 2025",
};

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="w-full h-full pointer-events-none absolute inset-0 bg-linear-to-bl from-secondary/25 via-background/50  to-background/100" />
      <div className="container relative mx-auto max-w-7xl space-y-10 sm:space-y-12 lg:space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3 sm:space-y-4 text-center md:text-left"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">
            Experience &amp; <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"> Education</span>
          </h2>
          <p className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto md:mx-0 text-base sm:text-lg md:text-xl lg:text-2xl text-muted leading-relaxed">
            From pet care platforms and dashboards to high-motion creative sites, I lead and ship
            React-based frontends that balance performance, DX, and long-term maintainability.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-10 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.1fr)]"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="space-y-6 border-l border-primary/30 pl-4 md:pl-6">
            {experiences.map((exp, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="relative overflow-hidden bg-card/95 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary/80 before:to-secondary/80">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-xl md:text-2xl">{exp.title}</CardTitle>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted">
                          <span className="font-semibold text-foreground">{exp.company}</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {exp.period}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1 text-primary">▹</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-primary">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-sm md:text-base">
                  <p className="font-semibold">{education.degree}</p>
                  <p className="text-muted">{education.institution}</p>
                  <p className="text-xs text-muted">{education.date}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
