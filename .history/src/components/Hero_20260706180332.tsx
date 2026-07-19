"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Scissors } from "lucide-react";
import TextileSimulation from "./TextileSimulation";

export default function Hero() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 90;
      const position =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-background pt-20 pb-10 sm:pt-24 md:pt-26 md:pb-14 lg:min-h-[calc(100vh-5rem)] lg:pt-16 lg:pb-16 xl:pt-20"
    >
      <TextileSimulation />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(184,156,114,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(184,156,114,0.05)_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 sm:px-6 md:gap-8 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-5 lg:col-span-7 lg:gap-6 lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Premium Apparel
              <br />
              <span className="bg-linear-to-r from-foreground via-accent-custom to-accent-custom bg-clip-text text-transparent">
                Manufacturing
              </span>{" "}
              for
              <br />
              Growing Brands.
            </h1>

            <p className="max-w-xl text-base leading-7 text-muted-custom sm:text-lg sm:leading-8">
              CutnStitch Apparel helps clothing brands, startups, and corporate
              clients manufacture retail-grade garments at scale. High-end
              quality control, low MOQs, and end-to-end support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-3 lg:pt-2"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-custom px-6 py-3.5 text-base font-semibold text-primary-foreground-custom shadow-lg transition-all hover:scale-[1.02] hover:bg-accent-custom hover:text-white sm:w-auto sm:px-8"
              >
                Request a Quote
                <ArrowRight size={16} />
              </a>

              <a
                href="#products"
                onClick={(e) => handleScroll(e, "#products")}
                className="flex w-full items-center justify-center rounded-full border border-border-custom px-6 py-3.5 text-base font-semibold transition-all hover:scale-[1.02] hover:bg-foreground/5 sm:w-auto sm:px-8"
              >
                View Products
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              whileHover={{ y: -5, scale: 1.01, boxShadow: "0 18px 50px -22px rgba(184, 156, 114, 0.45)" }}
              className="glass flex max-w-xl flex-col gap-3 rounded-2xl border border-border-custom/60 p-4 shadow-[0_16px_50px_-22px_rgba(0,0,0,0.24)] sm:flex-row sm:items-start sm:gap-4 sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-custom/10 text-accent-custom">
                <Scissors size={20} />
              </div>

              <div>
                <p className="text-base font-semibold text-foreground">
                  48-Hour Rapid Sample Development
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-custom">
                  From your design to a high-quality garment sample in just 48
                  hours, helping you approve styles and start bulk production
                  faster.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent-custom/5 blur-[80px] sm:h-72 sm:w-72" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-8 flex justify-center pb-2 lg:absolute lg:bottom-4 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
        <a
          href="#about"
          onClick={(e) => handleScroll(e, "#about")}
          className="flex flex-col items-center gap-1.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">
            Discover More
          </span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-custom"
          />
        </a>
      </div>
    </section>
  );
}