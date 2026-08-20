import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/hero/hero-section";
import { ExperienceSection } from "@/features/experience/experience-section";
import { ProjectsSection } from "@/features/projects/projects-section";
import { SkillsSection } from "@/features/skills/skills-section";
import { ContactSection } from "@/features/contact/contact-section";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
