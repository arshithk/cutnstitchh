"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

function BrandWordmark() {
  return (
    <div className="flex flex-col items-start gap-0">
      <span className="text-[1.03rem] font-extrabold uppercase tracking-[0.34em] text-[#d4af37] sm:text-[1.2rem]">
        CUT N STITCH
      </span>
      <span className="text-[0.72rem] font-semibold lowercase tracking-[0.28em] text-foreground/80 sm:text-[0.78rem]">
        apparel.com
      </span>
    </div>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLElement | null>(null);
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

    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
    };

    updateHeaderHeight();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeaderHeight);

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeaderHeight);
      resizeObserver.disconnect();
    };
  }, [lastScrollY, isMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-50 w-full border-b border-black/10 bg-black/95 px-3 py-2 shadow-sm backdrop-blur transition-transform duration-300 ease-out supports-backdrop-filter:bg-black/90 sm:px-6 sm:py-5 lg:px-8 dark:border-white/10 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center justify-between gap-3">
          <a
            href="#top"
            className="group flex items-center justify-start text-left transition-all duration-300 hover:brightness-110"
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
          } flex-col gap-4 rounded-xl border border-border-custom/60 bg-background/95 p-4 shadow-sm sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-5 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:text-base`}
        >
          <a
            href="#about"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom sm:px-2"
          >
            About
          </a>

          <a
            href="#industries"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom sm:px-2"
          >
            Industries
          </a>

          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="transition hover:text-accent-custom sm:px-2"
          >
            Contact
          </a>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/live-stock"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full bg-primary-custom px-5 py-3 text-center font-semibold text-primary-foreground-custom transition hover:bg-accent-custom hover:text-white sm:px-6"
            >
              Live Stock
            </Link>

            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full bg-primary-custom px-5 py-3 text-center font-semibold text-primary-foreground-custom transition hover:bg-accent-custom hover:text-white sm:px-6"
            >
              Get a Quote
            </a>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom sm:flex"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>
      </div>
    </header>
  );
}