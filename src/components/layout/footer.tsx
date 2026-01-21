import { Mail, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-muted/20 bg-linear-to-b from-primary/10 via-primary/5 to-background/95 py-10">
      <div className="container mx-aut lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] items-start">
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary">
              Abdallah Zaghloul
            </p>
            <p className="max-w-md text-sm md:text-base text-muted">
              Frontend Developer &amp; React Team Lead focused on scalable architectures, motion-rich
              interfaces, and shipping products that feel fast and polished.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <a href="mailto:f2002.a.z@gmail.com" className="hover:text-primary">
                  f2002.a.z@gmail.com
                </a>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Damascus, Syria (Remote)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs md:text-sm">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Navigate
              </p>
              <nav className="space-y-1.5 text-muted">
                <a href="#home" className="block hover:text-primary">
                  Home
                </a>
                <a href="#experience" className="block hover:text-primary">
                  Experience
                </a>
                <a href="#projects" className="block hover:text-primary">
                  Projects
                </a>
                <a href="#skills" className="block hover:text-primary">
                  Skills
                </a>
                <a href="#contact" className="block hover:text-primary">
                  Contact
                </a>
              </nav>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Focus
              </p>
              <ul className="space-y-1.5 text-muted">
                <li>React &amp; Next.js frontends</li>
                <li>Design systems &amp; DX</li>
                <li>Motion &amp; interactive UI</li>
                <li>Remote team leadership</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-muted/20 pt-6  md:flex-row text-muted">
          <p>
            &copy; {year} Abdallah Zaghloul. Built with Next.js, Tailwind CSS v4, Framer Motion,
            and Three.js.
          </p>
          <p className="font-mono uppercase tracking-[0.2em] text-primary/80">
            Available for remote work
          </p>
        </div>
      </div>
    </footer>
  );
}
