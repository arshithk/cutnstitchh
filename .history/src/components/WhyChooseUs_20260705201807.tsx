"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Scissors,
  Layers,
  Factory,
  Tag,
  Zap,
  DollarSign,
  Users,
  Cpu,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: <Scissors className="text-accent-custom" size={24} />,
      title: "Premium Fabric",
      desc: "Sourced directly from ISO-certified spinning mills. Choose from organic cotton, pique, terry, and lycra blends.",
    },
    {
      icon: <Layers className="text-accent-custom" size={24} />,
      title: "Low MOQ",
      desc: "Flexible production quantities starting at just 100 pcs per style/color, supporting emerging fashion labels.",
    },
    {
      icon: <Factory className="text-accent-custom" size={24} />,
      title: "OEM Manufacturing",
      desc: "Full custom garment engineering matching your specifications, patterns, tech packs, and dimensional tolerances.",
    },
    {
      icon: <Tag className="text-accent-custom" size={24} />,
      title: "Private Label",
      desc: "White-label production with custom woven neck tags, printed care instructions, barcode stickers, and retail packaging.",
    },
    {
      icon: <Zap className="text-accent-custom" size={24} />,
      title: "Fast Delivery",
      desc: "Optimized cutting and sewing lines ensure production lead times of 15-25 days, helping you restock quickly.",
    },
    {
      icon: <DollarSign className="text-accent-custom" size={24} />,
      title: "Competitive Pricing",
      desc: "Direct manufacturer pricing with no middlemen markups, giving you healthy retail margins and startup viability.",
    },
    {
      icon: <Users className="text-accent-custom" size={24} />,
      title: "Experienced Team",
      desc: "A veteran workforce of designers, merchants, pattern masters, and tailors with over a decade of apparel expertise.",
    },
    {
      icon: <Cpu className="text-accent-custom" size={24} />,
      title: "Modern Machines",
      desc: "Equipped with specialized Japanese sewing units, computer-controlled cutters, and flatlock machines.",
    },
    {
      icon: <ShieldCheck className="text-accent-custom" size={24} />,
      title: "Quality Assurance",
      desc: "Every batch undergoes rigorous AQL 2.5 standards checking before leaving the factory gate.",
    },
    {
      icon: <Globe className="text-accent-custom" size={24} />,
      title: "Pan India Shipping",
      desc: "Seamless logistics coordination delivering directly to offices, warehouses, and fulfillment centers across India.",
    },
  ];

  return (
    <section id="why-choose-us" ref={ref} className="scroll-mt-20 relative overflow-hidden bg-background py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-3 text-center sm:mb-10 lg:mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Core Competencies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Why Choose Us.
          </h2>
          <p className="text-base text-muted-custom leading-relaxed">
            We merge premium raw materials, skilled craftsmanship, and ethical scale to deliver retail-ready products.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="flex h-full flex-col gap-4 rounded-2xl border border-border-custom/50 bg-card p-6 transition-colors hover:border-accent-custom/40 hover-lift"
            >
              <div className="p-3 bg-accent-custom/10 w-fit rounded-xl">
                {benefit.icon}
              </div>
              <h3 className="text-base font-bold text-foreground">{benefit.title}</h3>
              <p className="text-xs text-muted-custom leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
