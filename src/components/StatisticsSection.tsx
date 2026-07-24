"use client";

import { motion } from "framer-motion";
import { Layers, Scissors, ShieldCheck, Sparkles, Truck } from "lucide-react";

const stats = [
  {
    icon: Sparkles,
    value: "1000+",
    title: "Custom Designs",
    description: "Ready to manufacture catalog",
  },
  {
    icon: Layers,
    value: "Bulk Scale",
    title: "High Capacity",
    description: "Optimized production lines",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    title: "Quality Assured",
    description: "Double-stage QC inspection",
  },
  {
    icon: Truck,
    value: "PAN India / Overseas",
    title: "Doorstep Delivery",
    description: "Reliable logistics partners",
  },
  {
    icon: Scissors,
    value: "48 Hours",
    title: "Rapid Sample Development",
    description: "From design to a premium sample quickly for faster approvals.",
  },
];

export default function StatisticsSection() {
  return (
    <section className="relative overflow-hidden bg-transparent pt-2 pb-10 sm:pt-3 sm:pb-12 lg:pt-4 lg:pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(184,156,114,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <h2 className="flex flex-wrap items-center justify-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="mr-2 sm:mr-3">Why Leading Brands Choose</span>
            <span className="font-sans font-black tracking-tighter uppercase text-white">
              <span className="text-accent-custom">Cut</span> n <span className="text-accent-custom">Stitch</span>
            </span>
            <span className="ml-2 -mt-2 rounded border border-accent-custom/30 bg-accent-custom/20 px-1.5 py-0.5 text-[11px] sm:text-[13px] font-bold uppercase tracking-widest text-accent-custom sm:-mt-3">
              B2B
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-custom sm:text-lg sm:leading-8">
            <i>
              From design to delivery, we help brands manufacture premium-quality
              garments with reliability, scale, and precision.
            </i>
          </p>
        </motion.div>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.article
                key={stat.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.01, boxShadow: "0 20px 50px -24px rgba(184, 156, 114, 0.45)" }}
                className="group relative rounded-[28px] border border-border-custom/70 bg-card/80 p-7 text-left shadow-[0_18px_60px_-24px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:border-accent-custom/70 sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-custom/10 text-accent-custom transition-colors duration-300 group-hover:bg-accent-custom/15">
                  <Icon size={22} />
                </div>

                <div className="mt-6">
                  <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground/85">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-custom">
                    {stat.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
