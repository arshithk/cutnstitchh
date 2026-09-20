"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useHeroModel, HERO_PRODUCT_MODELS } from "@/context/HeroModelContext";
import TextileSimulation from "./TextileSimulation";

export default function Hero() {
  const heroModelCtx = useHeroModel();
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const activeModel = heroModelCtx?.activeModel || HERO_PRODUCT_MODELS[0];
  const activeIndex = heroModelCtx?.activeModelIndex ?? 0;

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Auto-slide every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || !heroModelCtx) return;
    const timer = setInterval(() => {
      heroModelCtx.nextModel();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, heroModelCtx]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 90;
      const position = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: position, behavior: "smooth" });
    }
  };

  return (
    <section
      id="top"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={isMobile ? { paddingTop: "calc(var(--header-height, 0px) + 0.75rem)" } : undefined}
      className="relative overflow-hidden bg-transparent pt-[5rem] pb-8 sm:pt-[5.5rem] sm:pb-12 md:pt-[6rem] lg:min-h-[82vh] lg:pt-[5.5rem] lg:pb-16 flex flex-col justify-center"
    >
      <TextileSimulation />

      {/* Atmospheric lighting */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.04)_1px,transparent_1px)] bg-size-[28px_28px] opacity-70" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 md:grid-cols-12 md:gap-8 lg:grid-cols-12 lg:gap-14 lg:px-8">
        {/* Left Column: Dynamic Product Copy */}
        <div className="flex flex-col gap-5 md:col-span-6 lg:col-span-6 lg:pr-4 self-center text-left">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-custom/40 bg-accent-custom/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-custom backdrop-blur-md">
              <Sparkles size={13} className="text-accent-custom" />
              {activeModel.badge}
            </span>
          </div>

          {/* Headline & Description with smooth AnimatePresence */}
          <div className="min-h-[180px] sm:min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col gap-3 sm:gap-4"
              >
                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-5xl lg:text-6xl">
                  {activeModel.headline}
                </h1>

                <p className="text-base font-medium text-accent-custom sm:text-lg">
                  {activeModel.subheadline}
                </p>

                <p className="max-w-xl text-sm leading-6 text-muted-custom sm:text-base sm:leading-7">
                  {activeModel.description}
                </p>

                {/* Quick specs pill chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeModel.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-border-custom/80 bg-card/60 px-2.5 py-1 text-[11px] font-semibold text-muted-custom backdrop-blur-xs"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              href={activeModel.href}
              className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-accent-custom px-7 py-3.5 text-sm sm:text-base font-bold text-black shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.03] hover:brightness-110 sm:w-auto"
            >
              Explore {activeModel.navLabel}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="flex w-full items-center justify-center rounded-full border border-border-custom bg-card/40 px-6 py-3.5 text-sm sm:text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-foreground/5 sm:w-auto"
            >
              Request Bulk Quote
            </a>
          </div>
        </div>

        {/* Right Column: Model Spotlight Presentation */}
        <div className="relative mx-auto flex flex-col items-center justify-center md:col-span-6 lg:col-span-6 w-full">
          {/* Glowing Halo / Spotlight centered behind model (matching reference image) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.32)_0%,rgba(212,175,55,0.12)_45%,transparent_70%)] pointer-events-none blur-2xl" />

          {/* Model Card Container with AnimatePresence */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[400px] lg:max-w-[440px] h-[440px] sm:h-[490px] md:h-[500px] lg:h-[530px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModel.id}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-neutral-950/70 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              >
                {/* Clickable Model Image leading to the product page */}
                <Link
                  href={activeModel.href}
                  className="relative block h-full w-full overflow-hidden rounded-[2rem]"
                  title={`View ${activeModel.name}`}
                >
                  <Image
                    src={activeModel.image}
                    alt={`${activeModel.name} - Cut N Stitch B2B Apparel Manufacturing Bangalore`}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />

                  {/* Gradient vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_60%,rgba(0,0,0,0.4)_100%)]" />

                  {/* Floating Badge on Model */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md">
                      {activeModel.navLabel}
                    </span>
                  </div>

                  {/* Hover Prompt CTA Banner */}
                  <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-2xl border border-white/20 bg-black/75 px-4 py-3 backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white">
                        {activeModel.name}
                      </span>
                      <span className="text-[11px] text-accent-custom font-semibold">
                        View Product Details & MOQ →
                      </span>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-custom text-black shadow-md">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Left & Right navigation chevrons */}
            <button
              type="button"
              onClick={() => heroModelCtx?.prevModel()}
              aria-label="Previous model"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-neutral-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-accent-custom hover:text-black hover:border-accent-custom active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => heroModelCtx?.nextModel()}
              aria-label="Next model"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-neutral-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-accent-custom hover:text-black hover:border-accent-custom active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination Indicators & Tagline (matching reference image) */}
          <div className="mt-5 flex flex-col items-center gap-2">
            {/* Dots */}
            <div className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-neutral-950/60 backdrop-blur-md">
              {HERO_PRODUCT_MODELS.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => heroModelCtx?.setActiveModelIndex(idx)}
                    aria-label={`Show ${item.name}`}
                    title={item.name}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      isActive
                        ? "w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                );
              })}
            </div>

            {/* Tagline text below dots */}
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-custom">
              {activeModel.tagline}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}