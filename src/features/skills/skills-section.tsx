"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animation-variants";
import { Code2, Layers, Sparkles, Database, Settings, Globe2, Palette } from "lucide-react";

const skills = {
  frontend: [
    "React (18/19)",
    "Next.js",
    "TypeScript (Core)",
    "JavaScript (ES6+)",
    "HTML5",
    "CSS3",
    "React Router",
  ],
  stateManagement: ["Redux", "Redux Toolkit", "Context API"],
  uiMotion: ["Tailwind CSS (v4)", "Material UI", "GSAP", "Framer Motion", "DaisyUI"],
  interactive: ["Three.js"],
  apisTooling: ["REST APIs", "Axios", "Vite", "Git", "GitHub"],
  process: ["Agile/Scrum", "Sprint Planning", "Code Reviews", "Plane (Project Management)"],
  localization: ["i18n", "i18next"],
};

const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: skills.frontend,
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    title: "State Management",
    icon: Database,
    skills: skills.stateManagement,
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    title: "UI & Motion",
    icon: Sparkles,
    skills: skills.uiMotion,
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
  {
    title: "3D & Interactive",
    icon: Layers,
    skills: skills.interactive,
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    title: "APIs & Tooling",
    icon: Settings,
    skills: skills.apisTooling,
    gradient: "from-indigo-500/20 to-blue-500/20",
    borderColor: "border-indigo-500/30",
    iconColor: "text-indigo-400",
  },
  {
    title: "Process & Localization",
    icon: Globe2,
    skills: skills.process.concat(skills.localization),
    gradient: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/90 via-background/95 to-background" />
      <div className="container relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-xl font-mono uppercase tracking-[0.3em] text-primary mb-4">
            Skills
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight mb-4">
            Technologies &amp; <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Tools</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed">
            A comprehensive stack for building modern, scalable, and performant web applications
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-xl border-none bg-card/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  
                  {/* Animated Border */}
                  <div className={`absolute inset-0 rounded-xl border-2 ${category.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-center flex-col gap-3 mb-3">
                      <div className={`p-3 rounded-lg bg-primary/10 ${category.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-lg text-center font-bold font-display">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          <Badge 
                            variant="outline" 
                            className="cursor-default border-border/40 bg-background/60 backdrop-blur text-xs font-medium px-3 py-1 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA/Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-xl">
            <Palette className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-muted">
              Always learning and exploring new technologies
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
