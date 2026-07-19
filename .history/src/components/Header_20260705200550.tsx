"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-background/95 px-4 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 sm:py-5 lg:px-8 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            CutnStitch
          </h1>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-3 text-sm text-foreground sm:justify-end sm:gap-6 sm:text-base">
          <a href="#about" className="transition hover:text-accent-custom">
            About
          </a>

          <a href="#industries" className="transition hover:text-accent-custom">
            Industries
          </a>

          <a href="#contact" className="transition hover:text-accent-custom">
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
            className="rounded-lg bg-primary-custom px-4 py-3 font-semibold text-primary-foreground-custom transition hover:bg-accent-custom hover:text-white sm:px-6"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}