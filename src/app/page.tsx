import { Suspense, lazy } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/hero/hero-section";

// Lazy load heavy sections for better performance
const SkillsSection = lazy(() =>
  import("@/features/skills/skills-section").then((mod) => ({
    default: mod.SkillsSection,
  }))
);

const ExperienceSection = lazy(() =>
  import("@/features/experience/experience-section").then((mod) => ({
    default: mod.ExperienceSection,
  }))
);

const ProjectsSection = lazy(() =>
  import("@/features/projects/projects-section").then((mod) => ({
    default: mod.ProjectsSection,
  }))
);

const ContactSection = lazy(() =>
  import("@/features/contact/contact-section").then((mod) => ({
    default: mod.ContactSection,
  }))
);

// Loading fallback component
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24 min-h-[400px]">
      <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
        <div className="h-12 bg-card/50 rounded-lg w-3/4"></div>
        <div className="h-8 bg-card/30 rounded-lg w-1/2"></div>
        <div className="h-64 bg-card/20 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <main>
        {/* Hero loads immediately - above the fold */}
        <HeroSection />
        
        {/* Lazy load sections below the fold */}
        <Suspense fallback={<SectionLoader />}>
          <ExperienceSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <SkillsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
