"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import TextileSimulation from "./TextileSimulation";

export default function Hero() {
  const stats = [
    {
      icon: <Sparkles className="text-accent-custom" size={24} />,
      value: "1000+",
      label: "Custom Designs",
      desc: "Ready to manufacture catalog",
    },
    {
      icon: <Layers className="text-accent-custom" size={24} />,
      value: "Bulk Scale",
      label: "High Capacity",
      desc: "Optimized production lines",
    },
    {
      icon: <ShieldCheck className="text-accent-custom" size={24} />,
      value: "100%",
      label: "Quality Assured",
      desc: "Double-stage QC inspection",
    },
    {
      icon: <Truck className="text-accent-custom" size={24} />,
      value: "PAN India",
      label: "Doorstep Delivery",
      desc: "Reliable logistics partners",
    },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-background">
      {/* Background Interactive Thread Simulator */}
      <TextileSimulation />

      {/* Grid Overlay for subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(184,156,114,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        {/* Hero Left Content */}
        <div className="flex flex-col justify-center lg:col-span-7 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center self-start gap-2 px-3 py-1 rounded-full bg-accent-custom/10 border border-accent-custom/25">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-custom animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-accent-custom">
                Premium Apparel Manufacturer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
              Premium Apparel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-accent-custom to-accent-custom">
                Manufacturing
              </span>{" "}
              for <br />
              Growing Brands.
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-custom leading-relaxed max-w-xl">
              CutnStitch Apparel helps clothing brands, startups, and corporate clients manufacture retail-grade garments at scale. High-end quality control, low MOQs, and end-to-end support.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="flex items-center gap-2 bg-primary-custom text-primary-foreground-custom font-semibold text-base px-8 py-3.5 rounded-full shadow-lg hover:bg-accent-custom hover:text-white transition-all hover:scale-105"
            >
              Request a Quote
              <ArrowRight size={16} />
            </a>
            <a
              href="#products"
              onClick={(e) => handleScroll(e, "#products")}
              className="flex items-center justify-center font-semibold text-base px-8 py-3.5 rounded-full border border-border-custom hover:bg-foreground/5 transition-all hover:scale-105"
            >
              View Products
            </a>
          </motion.div>
        </div>

        {/* Hero Right Floating Stats Grid */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          {/* Subtle glowing orb in background */}
          <div className="absolute w-72 h-72 rounded-full bg-accent-custom/5 blur-[80px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="glass p-6 rounded-2xl border border-border-custom/50 shadow-sm flex flex-col gap-4 hover-lift"
              >
                <div className="p-3 bg-accent-custom/10 w-fit rounded-xl">
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm font-bold text-foreground/80 mt-1">
                    {stat.label}
                  </span>
                  <span className="text-xs text-muted-custom mt-0.5">
                    {stat.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        <a
          href="#about"
          onClick={(e) => handleScroll(e, "#about")}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-custom">
            Discover More
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent-custom mt-2"
          />
        </a>
      </div>
    </section>
  );
}
