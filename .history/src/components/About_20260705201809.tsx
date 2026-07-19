"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ShieldCheck, Leaf, Users, Cpu } from "lucide-react";

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, value, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const coreValues = [
    {
      icon: <Leaf className="text-emerald-500" size={24} />,
      title: "Ethical Production",
      desc: "Fair wages, safe working environments, and green manufacturing practices.",
    },
    {
      icon: <Users className="text-sky-500" size={24} />,
      title: "Experienced Workforce",
      desc: "Master tailors and skilled artisans ensuring meticulous stitching in every garment.",
    },
    {
      icon: <Cpu className="text-indigo-500" size={24} />,
      title: "Modern Machinery",
      desc: "Equipped with state-of-the-art Japanese sewing machines, auto-cutters, and finishing units.",
    },
    {
      icon: <ShieldCheck className="text-amber-500" size={24} />,
      title: "Strict Quality Control",
      desc: "A rigorous 4-stage inspection covering fabric, inline, post-line, and final packaging.",
    },
  ];

  const statCounters = [
    { value: 12, suffix: "+", label: "Years of Expertise" },
    { value: 15000, suffix: "+", label: "Daily Production" },
    { value: 250, suffix: "+", label: "Brands Partnered" },
    { value: 4, suffix: " Stages", label: "Quality Inspections" },
  ];

  return (
    <section id="about" className="scroll-mt-20 relative overflow-hidden bg-background py-10 sm:py-12 lg:py-14" ref={containerRef}>
      {/* Decorative side shape */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[30vw] w-[30vw] rounded-full bg-accent-custom/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Left Column: Intro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
              Our Identity
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Redefining B2B Apparel Manufacturing.
            </h2>
            <p className="text-base text-muted-custom leading-relaxed">
              Founded on the pillars of craftsmanship and technology, <strong>CutnStitch Apparel</strong> has grown to become a trusted manufacturing partner for top-tier fashion brands, scaling startups, and corporate entities.
            </p>
            <p className="text-base text-muted-custom leading-relaxed">
              We specialize in turning design concepts into high-grade retail merchandise. By maintaining strict control over fabric procurement, stitching, and finishing, we deliver unmatched garment feel and endurance.
            </p>
          </motion.div>

          {/* Right Column: Values Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:col-span-7 lg:gap-8">
            {coreValues.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-card border border-border-custom/60 p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover-lift"
              >
                <div className="p-3 bg-foreground/[0.03] dark:bg-white/[0.03] w-fit rounded-xl">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-custom leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Counter Stats Section */}
        <div className="mt-10 border-t border-border-custom/60 pt-8 sm:mt-12 sm:pt-10">
          <div className="grid grid-cols-2 gap-6 text-center sm:gap-8 lg:grid-cols-4">
            {statCounters.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="flex flex-col gap-2"
              >
                <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center justify-center">
                  <Counter value={stat.value} />
                  <span className="text-accent-custom ml-0.5">{stat.suffix}</span>
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-custom font-semibold">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
