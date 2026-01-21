"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking the button or inside the menu
      if (
        target.closest('[aria-label="Toggle menu"]') ||
        target.closest('[data-mobile-menu]')
      ) {
        return;
      }
      // Close if clicking outside the nav entirely
      if (!target.closest("nav")) {
        setIsOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/50 backdrop-blur-lg shadow-[0_12px_40px_rgba(15,23,42,0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(250,204,21,0.16),transparent_25%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.18),transparent_25%)]" />
        <div className="relative container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a
            href="#home"
            className="font-display text-base md:text-lg font-semibold tracking-[0.35em] uppercase bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent z-50 relative"
            onClick={() => setIsOpen(false)}
          >
            AZ
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-xs md:text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Burger Button */}
          <div className="md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="z-50 relative p-2 text-foreground hover:text-primary transition-colors touch-manipulation"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          </div>
          
        </div>
      </nav>

      {/* Mobile Menu - Rendered outside nav for proper z-index stacking */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsOpen(false)}
              style={{ top: '64px' }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-[280px] sm:w-64 bg-card/95 backdrop-blur-xl border-l border-primary/20 shadow-2xl z-[70] md:hidden overflow-y-auto"
              data-mobile-menu
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-6 gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border/20"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                {/* <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-border/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted">Theme</span>
                    <ThemeToggle />
                  </div>
                </motion.div> */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
