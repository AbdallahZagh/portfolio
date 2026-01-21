"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Figma, LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/animation-variants";

export interface Project {
  name: string;
  description: string;
  tools: string[];
  github: string | null;
  demo1: string | null;
  demo2: string | null;
  figma: string | null;
  icon: LucideIcon;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative"
    >
      <div className="m-2 group px-6 py-6  md:h-[550px] bg-card/60 rounded-xl flex flex-col items-center justify-center gap-3 relative after:absolute after:h-full after:bg-primary/90 after:dark:bg-primary z-20 shadow-lg after:-z-20 after:w-full after:inset-0 after:rounded-lg transition-all duration-300 hover:translate-y-[-10px] hover:bg-primary/5 hover:transition-all hover:duration-300 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden cursor-pointer after:-translate-y-full after:hover:translate-y-0 [&_p]:delay-200 [&_p]:transition-all backdrop-blur-sm border border-border/40">
        {/* Icon */}
        <div className="w-20 aspect-square text-primary group-hover:text-foreground group-hover:bg-primary/20 text-5xl rounded-full p-3 transition-all duration-300 group-hover:transition-all group-hover:duration-300 group-hover:-translate-y-2 mx-auto flex items-center justify-center">
          <Icon className="w-10 h-10" />
        </div>

        {/* Title */}
        <p className="cardtxt font-semibold text-foreground tracking-wider group-hover:text-foreground text-lg md:text-xl text-center transition-all duration-300">
          {project.name}
        </p>
        
        {/* Description */}
        <p className="text-sm text-muted group-hover:text-foreground/50 text-center leading-relaxed transition-all duration-300">
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          {project.tools.map((tool, toolIndex) => (
            <Badge 
              key={toolIndex} 
              variant="outline" 
              className="text-xs px-2 py-0.5 border-muted/40 group-hover:border-primary/40 group-hover:text-foreground/90 transition-all duration-300"
            >
              {tool}
            </Badge>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full mt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary/40 hover:text-primary hover:bg-primary/10 group-hover:bg-background/20 bg-primary/20 cursor-pointer py-2 px-4 text-xs font-semibold rounded-full transition-all duration-300"
            >
              <Code className="h-4 w-4" />
              <span className="text-primary dark:text-primary group-hover:text-foreground transition-colors duration-300">Code</span>
            </a>
          )}
          {project.demo1 && (
            <a
              href={project.demo1}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-secondary/40 hover:text-secondary hover:bg-secondary/10 group-hover:bg-background/20 bg-secondary/20 cursor-pointer py-2 px-4 text-xs font-semibold rounded-full transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-secondary dark:text-secondary group-hover:text-foreground transition-colors duration-300">Admin Demo</span>
            </a>
          )}
          {project.demo2 && (
            <a
              href={project.demo2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-secondary/40 hover:text-secondary hover:bg-secondary/10 group-hover:bg-background/20 bg-secondary/20 cursor-pointer py-2 px-4 text-xs font-semibold rounded-full transition-all duration-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-secondary dark:text-secondary group-hover:text-foreground transition-colors duration-300">User Demo</span>
            </a>  
          )}
          {project.figma && (
            <a
              href={project.figma}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-muted/40 hover:text-muted hover:bg-muted/10 group-hover:bg-background/20 bg-muted/30 group-hover:border-primary/40 group-hover:text-primary cursor-pointer py-2 px-4 text-xs font-semibold rounded-full transition-all duration-300"
            >
              <Figma className="h-4 w-4" />
              <span className="text-foreground group-hover:text-foreground transition-colors duration-300">Figma</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
