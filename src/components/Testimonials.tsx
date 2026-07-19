"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  logoText: string;
}

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "CutnStitch has transformed our supply chain. Their custom oversized t-shirts have the exact heavy drop and premium feel our street wear label demanded. Outstanding puff printing quality!",
      author: "Rohan Malhotra",
      role: "Creative Director",
      company: "Aether Streetwear",
      logoText: "A E T H E R",
    },
    {
      id: 2,
      quote: "Managing corporate uniforms for 1,500+ employees was seamless with CutnStitch. The polo t-shirts fit perfectly, don't bleed color, and their delivery timeline was spot on.",
      author: "Priya Sharma",
      role: "Operations Head",
      company: "Innova TechCorp",
      logoText: "I N N O V A",
    },
    {
      id: 3,
      quote: "The quality check standards at CutnStitch are top-notch. Our export order of 5,000 custom apparel pieces was packaged neatly and delivered directly to our custom clearances port.",
      author: "Marcus Vance",
      role: "Sourcing Manager",
      company: "Vance & Co. Exports",
      logoText: "V A N C E",
    },
    {
      id: 4,
      quote: "As a startup, finding a factory with low MOQs and private labeling support was difficult. CutnStitch helped us sample and launch our debut athleisure jogger collection easily.",
      author: "Vikram Dev",
      role: "Co-Founder",
      company: "Kinetix Activewear",
      logoText: "K I N E T I X",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="relative overflow-hidden border-y border-border-custom/50 bg-card/40 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Client Success
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Testimonials.
          </h2>
        </div>

        {/* Testimonial Box */}
        <div className="relative flex min-h-[280px] w-full items-center justify-center px-2 sm:px-4">
          <Quote className="absolute top-0 left-0 text-foreground/[0.03] w-24 h-24 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="z-10 flex flex-col items-center gap-6"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent-custom text-accent-custom" />
                ))}
              </div>

              <p className="max-w-2xl text-lg font-medium leading-relaxed text-foreground italic md:text-xl">
                "{testimonials[activeIdx].quote}"
              </p>

              <div className="flex flex-col items-center gap-1 mt-4">
                <span className="font-bold text-foreground text-base">
                  {testimonials[activeIdx].author}
                </span>
                <span className="text-xs text-muted-custom font-semibold">
                  {testimonials[activeIdx].role}, {testimonials[activeIdx].company}
                </span>
              </div>

              {/* Dynamic Company Logo Watermark */}
              <div className="mt-6 text-xs uppercase tracking-[0.3em] font-extrabold text-foreground/40 bg-foreground/[0.03] dark:bg-white/[0.03] py-2 px-6 rounded border border-border-custom/40">
                {testimonials[activeIdx].logoText}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full border border-border-custom hover:bg-foreground/5 transition-colors cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIdx ? "bg-accent-custom w-5" : "bg-border-custom hover:bg-foreground/20"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-3 rounded-full border border-border-custom hover:bg-foreground/5 transition-colors cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
