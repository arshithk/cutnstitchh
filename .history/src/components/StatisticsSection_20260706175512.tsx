"use client";

import { motion } from "framer-motion";
import { Layers, ShieldCheck, Sparkles, Truck } from "lucide-react";

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
];

export default function StatisticsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(184,156,114,0.12),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-accent-custom/80">
            Why Leading Brands Choose CutnStitch
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Built for premium manufacturing at scale.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-custom sm:text-lg sm:leading-8">
            From design to delivery, we help brands manufacture premium-quality
            garments with reliability, scale, and precision.
          </p>
        </motion.div>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 lg:gap-8">
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
