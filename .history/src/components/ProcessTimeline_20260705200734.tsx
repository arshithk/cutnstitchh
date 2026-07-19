"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare,
  Users,
  Palette,
  Scissors,
  ClipboardCheck,
  Factory,
  CheckCircle,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      no: "01",
      name: "Inquiry",
      icon: <MessageSquare size={20} />,
      desc: "Submit your tech packs, design mockups, and bulk apparel requirements.",
    },
    {
      no: "02",
      name: "Consultation",
      icon: <Users size={20} />,
      desc: "Discuss fabrics, GSM, styles, size grids, and target cost estimates.",
    },
    {
      no: "03",
      name: "Design & Pattern",
      icon: <Palette size={20} />,
      desc: "Prepare digital blueprints, sizing blocks, and artwork print setups.",
    },
    {
      no: "04",
      name: "Fabric Selection",
      icon: <Scissors size={20} />,
      desc: "Source and select knit/woven fibers, Pantone dyes, and GSM weights.",
    },
    {
      no: "05",
      name: "Sampling",
      icon: <ClipboardCheck size={20} />,
      desc: "Manufacture a physical mock garment for fitting and detailing approval.",
    },
    {
      no: "06",
      name: "Bulk Production",
      icon: <Factory size={20} />,
      desc: "Precision cutting, printing/embroidery, and premium assembly.",
    },
    {
      no: "07",
      name: "Quality Check",
      icon: <CheckCircle size={20} />,
      desc: "Rigorous measurements checking, thread snipping, and inspection.",
    },
    {
      no: "08",
      name: "Packaging",
      icon: <Package size={20} />,
      desc: "Steam ironing, custom neck tagging, poly bagging, and boxing.",
    },
    {
      no: "09",
      name: "Shipping",
      icon: <Truck size={20} />,
      desc: "Secure dispatch via surface/air cargo with live shipment tracking.",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 340;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="scroll-mt-24 relative overflow-hidden border-y border-border-custom/50 bg-card/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
              Our Methodology
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              The Manufacturing Process.
            </h2>
            <p className="text-base text-muted-custom leading-relaxed max-w-xl">
              An end-to-end transparent workflow designed to deliver pristine garments from design to doorstep.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-3 self-start md:self-auto">
            <button
              onClick={() => scroll("left")}
              className="p-3.5 rounded-full border border-border-custom hover:bg-foreground/5 transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3.5 rounded-full border border-border-custom hover:bg-foreground/5 transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Timeline Container */}
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto pb-2 pt-2 snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing sm:gap-6 sm:pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.no}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative flex w-70 shrink-0 snap-start flex-col gap-6 rounded-2xl border border-border-custom bg-background p-6 shadow-sm sm:w-75 sm:p-7"
            >
              {/* Backside step numbering watermark */}
              <div className="pointer-events-none absolute top-2 right-4 text-7xl font-black text-foreground/3 transition-colors group-hover:text-accent-custom/5">
                {step.no}
              </div>

              <div className="flex items-center justify-between">
                <div className="p-3.5 bg-accent-custom/10 text-accent-custom rounded-xl w-fit">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-accent-custom bg-accent-custom/5 px-2.5 py-1 rounded-full border border-accent-custom/10">
                  Step {step.no}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-extrabold text-foreground group-hover:text-accent-custom transition-colors">
                  {step.name}
                </h3>
                <p className="text-sm text-muted-custom leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
