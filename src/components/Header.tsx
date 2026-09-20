"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import { useHeroModel } from "@/context/HeroModelContext";

const NAV_PRODUCTS = [
  { name: "Regular Fit", slug: "regular-fit", href: "/products/regular-fit" },
  { name: "Polo", slug: "polo", href: "/products/polo" },
  { name: "Oversized", slug: "oversized", href: "/products/oversized" },
  { name: "Hoodies", slug: "hoodie", href: "/products/hoodie" },
  { name: "Sweatshirts", slug: "sweatshirt", href: "/products/sweatshirt" },
  { name: "Shorts", slug: "shorts", href: "/products/shorts" },
  { name: "Joggers", slug: "joggers", href: "/products/joggers" },
  { name: "All Products", slug: "all", href: "/#products" },
];

function BrandWordmark() {
  return (
    <div className="inline-grid items-center gap-0 text-center">
      <span className="inline-block w-full text-[1.15rem] font-extrabold uppercase tracking-[0.34em] text-[#d4af37] leading-none sm:text-[1.35rem]">
        CUT N STITCH
      </span>
      <span className="inline-block w-full text-[0.75rem] font-semibold lowercase tracking-[0.42em] text-white/80 leading-none sm:text-[0.85rem]">
        apparel.com
      </span>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const heroModelCtx = useHeroModel();
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isItemActive = (slug: string) => {
    if (!pathname) return false;
    const p = pathname.toLowerCase();
    // On homepage, active pill corresponds to the currently featured model in the Hero!
    if (p === "/") {
      if (slug === "all") return false;
      return heroModelCtx ? heroModelCtx.activeSlug === slug : slug === "regular-fit";
    }

    if (slug === "all") {
      return p === "/products" || p === "/products/";
    }
    if (slug === "regular-fit") return p.includes("regular-fit");
    if (slug === "polo") return p.includes("polo");
    if (slug === "oversized") return p.includes("oversized");
    if (slug === "hoodie") return p.includes("hoodie");
    if (slug === "sweatshirt") return p.includes("sweatshirt");
    if (slug === "shorts") return p.includes("shorts");
    if (slug === "joggers") return p.includes("joggers");
    return false;
  };

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string, href: string) => {
    if (pathname === "/") {
      if (slug === "all") {
        e.preventDefault();
        const target = document.querySelector("#products");
        if (target) {
          const headerOffset = 90;
          const position = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: position, behavior: "smooth" });
        }
        setIsMenuOpen(false);
        return;
      }

      // If user clicks a different product while on homepage, switch the active hero model!
      if (heroModelCtx && heroModelCtx.activeSlug !== slug) {
        e.preventDefault();
        heroModelCtx.setActiveSlug(slug);
        setIsMenuOpen(false);
        return;
      }
      // If user clicks the already active model, let it navigate to the product page!
    }
    setIsMenuOpen(false);
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        const headerOffset = 90;
        const position = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: position, behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

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
      className={`fixed top-0 z-50 w-full border-b border-black/10 bg-black/95 px-3 py-2.5 shadow-md backdrop-blur transition-transform duration-300 ease-out supports-backdrop-filter:bg-black/90 sm:px-6 sm:py-3.5 lg:px-8 dark:border-white/10 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
        {/* Left: Brand Wordmark */}
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="group flex items-center justify-start text-left transition-all duration-300 hover:brightness-110"
            aria-label="cut n stitchapparel.com"
          >
            <BrandWordmark />
          </Link>
        </div>

        {/* Center: Middle Product Navigation Bar (Desktop) */}
        <nav
          aria-label="Products middle navigation"
          className="hidden lg:flex items-center gap-0.5 rounded-full border border-white/15 bg-neutral-900/80 p-1 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md"
        >
          {NAV_PRODUCTS.map((item) => {
            const active = isItemActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={item.href}
                onClick={(e) => handleProductClick(e, item.slug, item.href)}
                className={`relative rounded-full px-2.5 py-1 text-[10.5px] xl:text-[11.5px] 2xl:text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "text-black"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="header-active-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.35)]"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Actions & CTAs */}
        <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-2.5 2xl:gap-3 shrink-0">
          <a
            href="/#about"
            onClick={(e) => handleScrollToSection(e, "#about")}
            className="hidden 2xl:inline-block text-xs uppercase font-semibold tracking-wider text-white/75 hover:text-accent-custom transition px-2"
          >
            About
          </a>

          <a
            href="/#contact"
            onClick={(e) => handleScrollToSection(e, "#contact")}
            className="hidden 2xl:inline-block text-xs uppercase font-semibold tracking-wider text-white/75 hover:text-accent-custom transition px-2"
          >
            Contact
          </a>

          <Link
            href="/live-stock"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-center text-[11px] xl:text-xs font-semibold text-white transition duration-300 ease-out hover:border-accent-custom hover:bg-accent-custom hover:text-black whitespace-nowrap"
          >
            Live Stock
          </Link>

          <a
            href="/#contact"
            onClick={(e) => handleScrollToSection(e, "#contact")}
            className="inline-flex items-center justify-center rounded-full border border-accent-custom bg-accent-custom px-3.5 py-1.5 text-center text-[11px] xl:text-xs font-bold text-black transition duration-300 ease-out hover:scale-[1.03] hover:brightness-110 whitespace-nowrap shadow-sm"
          >
            Get a Quote
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile / Tablet Header Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/live-stock"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:border-accent-custom hover:bg-accent-custom hover:text-black whitespace-nowrap"
          >
            Live Stock
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-custom bg-card text-foreground transition hover:border-accent-custom hover:text-accent-custom"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Product Pill Navigation Strip */}
      <div className="lg:hidden mt-2 pt-2 border-t border-white/10 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1.5 px-1 py-0.5 w-max">
          {NAV_PRODUCTS.map((item) => {
            const active = isItemActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={item.href}
                onClick={(e) => handleProductClick(e, item.slug, item.href)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  active
                    ? "bg-white text-black shadow-md"
                    : "text-white/70 bg-white/5 border border-white/10 hover:text-white hover:bg-white/15"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-3 flex flex-col gap-4 rounded-2xl border border-border-custom/60 bg-background/95 p-4 shadow-xl backdrop-blur-lg">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent-custom">
              Our Products
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {NAV_PRODUCTS.map((item) => {
                const active = isItemActive(item.slug);
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    onClick={(e) => handleProductClick(e, item.slug, item.href)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      active
                        ? "bg-accent-custom text-black shadow-sm"
                        : "bg-card border border-border-custom text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="h-px w-full bg-border-custom/50" />

          <div className="flex flex-col gap-2.5 text-sm font-semibold">
            <a
              href="/#about"
              onClick={(e) => handleScrollToSection(e, "#about")}
              className="py-1 text-foreground/80 hover:text-accent-custom transition"
            >
              About Cut N Stitch
            </a>

            <a
              href="/#contact"
              onClick={(e) => handleScrollToSection(e, "#contact")}
              className="py-1 text-foreground/80 hover:text-accent-custom transition"
            >
              Contact Us
            </a>

            <Link
              href="/live-stock"
              onClick={() => setIsMenuOpen(false)}
              className="py-1 text-foreground/80 hover:text-accent-custom transition"
            >
              Live Stock Inventory
            </Link>
          </div>

          <div className="pt-2">
            <a
              href="/#contact"
              onClick={(e) => handleScrollToSection(e, "#contact")}
              className="flex w-full items-center justify-center rounded-full bg-accent-custom px-4 py-2.5 text-center text-xs font-bold text-black shadow-md hover:brightness-110"
            >
              Get a Free Manufacturing Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}