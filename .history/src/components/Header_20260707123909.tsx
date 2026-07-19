"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function BrandWordmark() {
  return (
    <div className="flex items-center whitespace-nowrap">
      <Image
        src="/images/cut-n-stitch-logo.png"
        alt="Cut n Stitch Apparel"
        width={420}
        height={90}
        priority
        className="h-8 w-auto object-contain sm:h-10 lg:h-12"
      />
    </div>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-black/10 bg-background/95 px-3 py-2 shadow-sm backdrop-blur transition-transform duration-300 ease-out supports-backdrop-filter:bg-background/80 sm:px-6 sm:py-5 lg:px-8 dark:border-white/10 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <a
            href="#top"
            className="group flex items-center text-left transition-all duration-300 hover:brightness-110"
            aria-label="cut n stitchapparel.com"
          >
            <BrandWordmark />
          </a>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col gap-3 rounded-xl border border-border-custom/60 bg-background/95 p-3 shadow-sm sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:text-base`}
        >
          <a
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom"
          >
            About
          </a>

          <a
            href="#industries"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom"
          >
            Industries
          </a>

          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom"
          >
            Contact
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom sm:flex"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg bg-primary-custom px-4 py-3 text-center font-semibold text-primary-foreground-custom transition hover:bg-accent-custom hover:text-white sm:px-6"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}