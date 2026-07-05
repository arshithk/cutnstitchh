"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import TextileSimulation from "./TextileSimulation";

export default function Hero() {
  const stats = [
    {
      icon: <Sparkles className="text-accent-custom" size={22} />,
      value: "1000+",
      label: "Custom Designs",
      desc: "Ready to manufacture catalog",
    },
    {
      icon: <Layers className="text-accent-custom" size={22} />,
      value: "Bulk Scale",
      label: "High Capacity",
      desc: "Optimized production lines",
    },
    {
      icon: <ShieldCheck className="text-accent-custom" size={22} />,
      value: "100%",
      label: "Quality Assured",
      desc: "Double-stage QC inspection",
    },
    {
      icon: <Truck className="text-accent-custom" size={22} />,
      value: "PAN India",
      label: "Doorstep Delivery",
      desc: "Reliable logistics partners",
    },
  ];

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
    <section className="relative overflow-hidden bg-background pt-28 pb-20 sm:pt-32 sm:pb-24 lg:min-h-screen lg:pt-36 lg:pb-28">
      <TextileSimulation />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(184,156,114,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:gap-14 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="flex flex-col gap-7 lg:col-span-7 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-5 sm:gap-6"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-custom/25 bg-accent-custom/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-custom" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-custom sm:text-[11px]">
                Premium Apparel Manufacturer
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Premium Apparel
              <br />
              <span className="bg-gradient-to-r from-foreground via-accent-custom to-accent-custom bg-clip-text text-transparent">
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
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
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
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent-custom/5 blur-[80px] sm:h-72 sm:w-72" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="glass flex min-h-[185px] flex-col gap-4 rounded-2xl border border-border-custom/50 p-5 shadow-sm hover-lift sm:p-6"
              >
                <div className="w-fit rounded-xl bg-accent-custom/10 p-3">
                  {stat.icon}
                </div>

                <div>
                  <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground/80">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-custom">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex justify-center lg:absolute lg:bottom-6 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2">
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