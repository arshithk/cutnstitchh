"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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
            className="group flex items-center text-left transition-all duration-300 hover:tracking-[0.01em]"
            aria-label="Cut n Stitch apparel.com"
          >
            <span className="font-black tracking-[-0.04em] text-[0.95rem] text-[#f7f1e3] sm:text-[1.45rem] lg:text-[1.6rem]">
              Cut
            </span>
            <span className="ml-0.5 font-black tracking-[-0.04em] text-[0.95rem] text-accent-custom sm:text-[1.45rem] lg:text-[1.6rem]">
              n
            </span>
            <span className="ml-0.5 flex items-center font-black tracking-[-0.04em] text-[0.95rem] text-[#f7f1e3] sm:text-[1.45rem] lg:text-[1.6rem]">
              St
              <span className="mx-[0.06em] inline-flex h-[0.95em] w-[0.3em] items-center justify-center align-middle sm:h-[1.02em] sm:w-[0.33em]">
                <svg
                  viewBox="0 0 20 28"
                  className="h-full w-full text-[#f7f1e3] transition duration-300 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.25)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10 2.5V13.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.2 5.2C8.2 3.7 9.3 2.5 10.8 2.5H11.1C12.4 2.5 13.4 3.4 13.4 4.7C13.4 5.8 12.6 6.6 11.5 6.7L9.5 6.9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 17C9.2 17.8 10.2 18.3 11.4 18.3C13.2 18.3 14.6 17.2 15.3 15.7"
                    stroke="#d4af37"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.3 15.8C10.2 16.4 9.2 16.2 8.5 15.4"
                    stroke="#d4af37"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="10.2" cy="2.6" r="1.1" fill="#d4af37" />
                  <path
                    d="M10.1 2.8C10.8 3.9 10.2 5.2 9.1 5.7"
                    stroke="#d4af37"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              tch
            </span>
            <span className="ml-1 font-semibold tracking-[0.18em] text-[0.72rem] text-accent-custom sm:ml-2 sm:text-[0.84rem] lg:text-[0.9rem]">
              apparel.com
            </span>
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