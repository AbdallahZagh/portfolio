import { navLinks, site } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="page-wrap flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#home" className="hover:text-foreground">
            Home
          </a>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
