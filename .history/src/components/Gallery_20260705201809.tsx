"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Search, ArrowRight } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: "tshirts" | "hoodies" | "corporate" | "dyeing";
  categoryLabel: string;
  gsm: string;
  fabric: string;
  branding: string;
  description: string;
  svgGraphic: React.ReactNode;
}

export default function Gallery() {
  const [filter, setFilter] = useState<"all" | "tshirts" | "hoodies" | "corporate" | "dyeing">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const categories = [
    { id: "all", name: "All Works" },
    { id: "tshirts", name: "T-Shirts" },
    { id: "hoodies", name: "Hoodies & Sweatshirts" },
    { id: "corporate", name: "Corporate Wear" },
    { id: "dyeing", name: "Custom Dyeing" },
  ];

  const items: GalleryItem[] = [
    {
      id: 1,
      title: "Premium Heavyweight Oversized Tee",
      category: "tshirts",
      categoryLabel: "T-Shirts",
      gsm: "240 GSM",
      fabric: "100% Combed Cotton, Loopknit",
      branding: "Front Puff Print + Neck Woven Tag",
      description: "Designed with dropped shoulders and a thick ribbed collar, tailored for high-fashion streetwear labels.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          <rect width="100" height="100" fill="none" />
          <path d="M25,25 L35,16 C38,18 42,18 45,18 C48,18 52,16 55,25 L65,27 L58,45 L50,43 L50,85 L20,85 L20,43 L12,45 Z" />
          <path d="M30,38 L30,46 M26,42 L34,42" strokeWidth="0.8" strokeDasharray="1,1" />
          <text x="50%" y="75%" textAnchor="middle" className="fill-foreground font-sans font-bold text-[6px] tracking-widest opacity-25">240 GSM</text>
        </svg>
      ),
    },
    {
      id: 2,
      title: "French Terry Kangaroo Pocket Hoodie",
      category: "hoodies",
      categoryLabel: "Hoodies",
      gsm: "380 GSM",
      fabric: "80% Cotton / 20% Polyester fleece",
      branding: "High-density 3D chest embroidery",
      description: "Extremely soft brushed fleece lining, double-layered hood with metallic drawstrings and matching elastic cuffs.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          <path d="M30,22 C30,12 50,12 50,22" />
          <path d="M30,22 L20,26 L12,48 L18,50 L22,44 L22,82 C22,85 48,85 48,82 L48,44 L52,50 L58,48 L50,26 Z" />
          <path d="M26,62 L44,62 L40,74 L30,74 Z" strokeWidth="0.8" />
          <text x="50%" y="38%" textAnchor="middle" className="fill-foreground font-sans font-bold text-[6px] tracking-widest opacity-25">FLEECE</text>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Executive Oxford Collared Shirt",
      category: "corporate",
      categoryLabel: "Corporate Wear",
      gsm: "160 GSM",
      fabric: "100% Giza Cotton, Twill Weave",
      branding: "Subtle tone-on-tone pocket embroidery",
      description: "Tailored fit with stiff button-down collars and adjustable double-button cuffs, optimized for corporate employees.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          <path d="M20,22 L32,15 L36,25 L40,25 L44,15 L56,22 L52,38 L46,36 L46,85 L14,85 L14,38 L10,22 Z" />
          <path d="M30,15 L30,85" strokeWidth="0.8" />
          <path d="M14,24 L22,35 L30,85" strokeWidth="0.8" />
          <rect x="34" y="34" width="8" height="10" rx="1" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Custom Pantone Swatch Dyeing",
      category: "dyeing",
      categoryLabel: "Custom Dyeing",
      gsm: "N/A",
      fabric: "Reactive Soft-Dyes, AZO-Free",
      branding: "Eco-friendly Dye Matching",
      description: "Dyeing laboratory matching precise Pantone TCX color swatches, ensuring zero bleed and high colorfastness.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          {/* Swatch card representations */}
          <rect x="15" y="15" width="20" height="35" rx="2" />
          <rect x="15" y="38" width="20" height="12" fill="currentColor" className="text-accent-custom" />
          
          <rect x="40" y="15" width="20" height="35" rx="2" />
          <rect x="40" y="38" width="20" height="12" fill="currentColor" className="text-zinc-500" />
          
          <rect x="27" y="55" width="20" height="35" rx="2" />
          <rect x="27" y="78" width="20" height="12" fill="currentColor" className="text-emerald-600" />
          
          <text x="25" y="30" textAnchor="middle" className="fill-foreground font-sans font-bold text-[4px] tracking-wider opacity-30">PANTONE</text>
        </svg>
      ),
    },
    {
      id: 5,
      title: "French Terry Embroidered Sweatshirt",
      category: "hoodies",
      categoryLabel: "Hoodies & Sweatshirts",
      gsm: "340 GSM",
      fabric: "100% Organic Cotton French Terry",
      branding: "Chain-stitch embroidery branding",
      description: "Ribbed collar crewneck sweatshirt with ribbed side gussets, ideal for premium loungewear capsules.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          <path d="M22,20 C25,23 35,23 38,20 L58,25 L50,45 L45,43 L45,82 C45,85 15,85 15,82 L15,43 L10,45 Z" />
          <path d="M15,80 L45,80" strokeWidth="1.5" />
          <path d="M20,38 Q30,42 40,38" strokeWidth="0.8" strokeDasharray="2,1" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Honeycomb Pique Corporate Polo",
      category: "corporate",
      categoryLabel: "Corporate Wear",
      gsm: "220 GSM",
      fabric: "60% Cotton / 40% Poly Pique blend",
      branding: "Left chest computer-stitched emblem",
      description: "Durable pique knit structure featuring anti-roll collar ribs, ideal for executive uniforms and events.",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground fill-none opacity-80" strokeWidth="1">
          <path d="M22,22 L33,16 L38,25 L42,25 L47,16 L58,22 L53,35 L47,34 L47,85 L13,85 L13,34 L7,35 Z" />
          <path d="M33,16 L37,25 L37,32 L43,32 L43,25 L47,16" />
          <text x="30" y="44" className="fill-foreground font-sans font-bold text-[5px] opacity-25">PIQUE</text>
        </svg>
      ),
    },
  ];

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter);

  const handleInquireFromGallery = (itemName: string) => {
    setSelectedItem(null);
    const target = document.querySelector("#contact");
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        const selectEvent = new CustomEvent("select-product", {
          detail: {
            product: itemName.includes("Tee") ? "Oversized T-Shirts" : itemName.includes("Hoodie") || itemName.includes("Sweatshirt") ? "Hoodies" : "Corporate Wear",
            message: `Hi, we saw the "${itemName}" in your gallery and would like to receive pricing and sample fabric swatch details for a custom production run.`,
          },
        });
        window.dispatchEvent(selectEvent);
      }, 300);
    }
  };

  return (
    <section id="gallery" ref={ref} className="scroll-mt-20 relative overflow-hidden bg-background py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between lg:mb-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
              Our Portolio
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Production Gallery.
            </h2>
            <p className="text-base text-muted-custom leading-relaxed max-w-xl">
              Inspect actual client production runs, colorways, embroidery, and printing detail.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-10 flex flex-wrap gap-3 border-b border-border-custom/50 pb-6 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`py-2 px-5 text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                filter === cat.id
                  ? "border-accent-custom bg-accent-custom/5 text-accent-custom"
                  : "border-border-custom hover:border-foreground/20 text-muted-custom"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedItem(item)}
                className="group overflow-hidden rounded-3xl border border-border-custom/60 bg-card shadow-sm transition-all duration-300 hover:border-accent-custom/40 hover:shadow-md"
              >
                {/* SVG Visual Header */}
                <div className="relative flex aspect-4/3 items-center justify-center border-b border-border-custom/40 bg-foreground/2 p-6 transition-colors group-hover:bg-accent-custom/2 dark:bg-white/2 sm:p-8">
                  {item.svgGraphic}
                  <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="p-3 bg-white text-black dark:bg-black dark:text-white rounded-full shadow-lg">
                      <Search size={18} />
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-6 flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent-custom">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-accent-custom transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-muted-custom mt-2">
                    <span>{item.gsm}</span>
                    <span>{item.fabric.split(",")[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-background text-foreground w-full max-w-3xl rounded-3xl overflow-hidden border border-border-custom/60 shadow-2xl relative grid grid-cols-1 md:grid-cols-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X size={18} />
              </button>

              {/* Lightbox Left: Graphic */}
              <div className="md:col-span-6 bg-foreground/2 dark:bg-white/2 flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-border-custom/40">
                <div className="w-full max-w-50 aspect-square">
                  {selectedItem.svgGraphic}
                </div>
              </div>

              {/* Lightbox Right: Content */}
              <div className="md:col-span-6 p-8 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent-custom">
                      {selectedItem.categoryLabel}
                    </span>
                    <h3 className="text-xl font-black text-foreground leading-snug">
                      {selectedItem.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-custom leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* Technical Spec Matrix */}
                  <div className="grid grid-cols-2 gap-4 border-t border-border-custom/50 pt-4 mt-2 text-xs">
                    <div>
                      <span className="text-muted-custom block mb-0.5">GSM Weight</span>
                      <strong className="text-foreground">{selectedItem.gsm}</strong>
                    </div>
                    <div>
                      <span className="text-muted-custom block mb-0.5">Fabrication</span>
                      <strong className="text-foreground">{selectedItem.fabric}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-custom block mb-0.5">Sample Customization Done</span>
                      <strong className="text-foreground">{selectedItem.branding}</strong>
                    </div>
                  </div>
                </div>

                {/* Inquiry Link */}
                <button
                  onClick={() => handleInquireFromGallery(selectedItem.title)}
                  className="mt-8 w-full py-3.5 bg-primary-custom text-primary-foreground-custom hover:bg-accent-custom hover:text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Inquire For Bulk Production
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
