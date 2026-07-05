"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Rocket,
  Trophy,
  Calendar,
  Store,
  Globe,
} from "lucide-react";

export default function IndustriesServed() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const industries = [
    {
      icon: <Sparkles size={24} className="text-accent-custom" />,
      name: "Fashion Brands",
      desc: "High-end retail garments with bespoke tags, fits, custom dye matching, and premium finishes.",
    },
    {
      icon: <Briefcase size={24} className="text-accent-custom" />,
      name: "Corporate Clients",
      desc: "Polished employee uniforms, promotional polo shirts, blazers, and custom corporate accessories.",
    },
    {
      icon: <GraduationCap size={24} className="text-accent-custom" />,
      name: "Colleges & Universities",
      desc: "Custom college hoodies, department sweatshirts, festival t-shirts, and graduation souvenirs.",
    },
    {
      icon: <Rocket size={24} className="text-accent-custom" />,
      name: "Fashion Startups",
      desc: "Low-MOQ assistance, pattern blocks consultation, sampling, and private-label scaling support.",
    },
    {
      icon: <Trophy size={24} className="text-accent-custom" />,
      name: "Sports Teams & Gyms",
      desc: "Athletic wear, sublimation print jerseys, flexible tracksuits, tank tops, and fleece shorts.",
    },
    {
      icon: <Calendar size={24} className="text-accent-custom" />,
      name: "Event Organizers",
      desc: "Bulk event t-shirts, volunteers uniforms, custom merch runs, and quick-turnaround printing.",
    },
    {
      icon: <Store size={24} className="text-accent-custom" />,
      name: "Retail Stores",
      desc: "Wholesale blanks, replenishment stock, ready-to-sell styles, and custom collection manufacturing.",
    },
    {
      icon: <Globe size={24} className="text-accent-custom" />,
      name: "Export Businesses",
      desc: "International shipping compliance, custom packaging, documentation, and high-volume container runs.",
    },
  ];

  return (
    <section id="industries" ref={ref} className="scroll-mt-24 relative overflow-hidden border-y border-border-custom/50 bg-card/25 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mx-auto mb-12 flex max-w-2xl flex-col gap-4 text-center sm:mb-14 lg:mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Sectors We Support
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Industries Served.
          </h2>
          <p className="text-base text-muted-custom leading-relaxed">
            Tailored apparel supply chains and styling services matching the unique requirements of diverse B2B clients.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex h-full flex-col gap-4 rounded-2xl border border-border-custom bg-background p-6 transition-all hover:border-accent-custom/40 hover-lift"
            >
              <div className="p-3 bg-accent-custom/10 w-fit rounded-xl">
                {ind.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground">{ind.name}</h3>
              <p className="text-xs text-muted-custom leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
