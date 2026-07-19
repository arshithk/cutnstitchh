"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Category {
  name: string;
  moq: string;
  fabric: string;
  imagePath?: string;
  svgPath: React.ReactNode;
}

export default function ProductCategories() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const categories: Category[] = [
    {
      name: "Oversized T-Shirts",
      moq: "100 Pcs",
      fabric: "100% Cotton, 220-280 GSM",
      imagePath: "/images/oversized_tshirt_model.png",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Boxy Oversized Tee Shadow & Body */}
          <path d="M20,25 L12,40 L16,42 L22,27 Z" fill="#4d5766" opacity="0.2" />
          <path d="M60,25 L68,40 L64,42 L58,27 Z" fill="#4d5766" opacity="0.2" />
          <path d="M20,25 L32,15 C35,17 38,18 41,18 C44,18 47,17 50,15 L62,25 L55,42 L48,40 L48,85 L12,85 L12,40 L5,42 Z" fill="#697587" stroke="#4d5766" strokeWidth="1" />
          {/* Ribbed neck collar */}
          <path d="M32,15 C35,17 38,18 41,18 C44,18 47,17 50,15 C47,16 44,16.5 41,16.5 C38,16.5 35,16 32,15 Z" fill="#4d5766" />
          {/* Palm Tree minimal print */}
          <circle cx="30" cy="40" r="8" fill="#ecdcb9" opacity="0.85" />
          <path d="M30,35 Q32,41 30,48 M27,37 Q32,38 35,42 M33,36 Q28,40 25,44" stroke="#4d5766" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          {/* Double stitch line on sleeve & bottom */}
          <path d="M12,40 L15,41 M45,41 L48,40" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5" />
          <path d="M12,83 L48,83" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.5" />
        </svg>
      ),
    },
    {
      name: "Regular Fit T-Shirts",
      moq: "100 Pcs",
      fabric: "100% Cotton, 180-200 GSM",
      imagePath: "/images/men_tshirt_model.png",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Regular Tee Body */}
          <path d="M22,22 L33,16 C35,17.5 38,18 40,18 C42,18 45,17.5 47,16 L58,22 L53,35 L47,34 L47,85 L13,85 L13,34 L7,35 Z" fill="#e5ba73" stroke="#a07d3b" strokeWidth="1" />
          {/* Collar */}
          <path d="M33,16 C35,17.5 38,18 40,18 C42,18 45,17.5 47,16 C45,17 42,17.2 40,17.2 C38,17.2 35,17 33,16 Z" fill="#a07d3b" />
          {/* Retro Waves Graphic */}
          <path d="M20,38 Q30,42 40,38" stroke="#c85c5c" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M20,41 Q30,45 40,41" stroke="#d48c46" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M20,44 Q30,48 40,44" stroke="#4a7c59" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Double stitch line on sleeve & bottom */}
          <path d="M13,82 L47,82" stroke="#a07d3b" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.4" />
        </svg>
      ),
    },
    {
      name: "Polo T-Shirts",
      moq: "100 Pcs",
      fabric: "Pique Cotton, 220-240 GSM",
      imagePath: "/images/polo_tshirt.webp",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Polo Body */}
          <path d="M22,22 L33,16 L38,25 L42,25 L47,16 L58,22 L53,35 L47,34 L47,85 L13,85 L13,34 L7,35 Z" fill="#1b2a4a" stroke="#0d162a" strokeWidth="1" />
          {/* Collar Stand & Placket */}
          <path d="M33,16 L37,25 L37,34 L43,34 L43,25 L47,16" fill="#1b2a4a" stroke="#0d162a" strokeWidth="1" />
          <path d="M33,16 C34.5,18.5 37,20 37,20 L37,25 L33,16 Z" fill="#0d162a" />
          <path d="M47,16 C45.5,18.5 43,20 43,20 L43,25 L47,16 Z" fill="#0d162a" />
          {/* Placket Buttons */}
          <circle cx="40" cy="27" r="0.6" fill="#ffffff" />
          <circle cx="40" cy="31" r="0.6" fill="#ffffff" />
          {/* Gold Crest Embroidery */}
          <path d="M20,38 C20,36 22,36 22,38 C22,40 20,41 20,41 C20,41 18,40 18,38 C18,36 20,36 20,38 Z" fill="#d4af37" />
          <circle cx="20" cy="38" r="1" fill="#d4af37" />
        </svg>
      ),
    },
    {
      name: "Hoodies",
      moq: "100 Pcs",
      fabric: "Fleece / Terry, 320-400 GSM",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Hood Inner */}
          <path d="M30,22 C30,12 50,12 50,22 Z" fill="#3e4f24" stroke="#2d3b19" strokeWidth="1" />
          {/* Hoodie Body */}
          <path d="M30,22 L20,26 L12,48 L18,50 L22,44 L22,82 C22,85 48,85 48,82 L48,44 L52,50 L58,48 L50,26 Z" fill="#556b2f" stroke="#3e4f24" strokeWidth="1" />
          {/* Kangaroo Pocket */}
          <path d="M26,60 L44,60 L41,74 L29,74 Z" fill="#4d6129" stroke="#3e4f24" strokeWidth="1" />
          {/* Drawstrings */}
          <path d="M33,22 L33,36" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          <path d="M37,22 L37,32" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          {/* Chest Print "ORIGINAL" */}
          <text x="35" y="44" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.4" opacity="0.9">ORIGINAL</text>
        </svg>
      ),
    },
    {
      name: "Sweatshirts",
      moq: "100 Pcs",
      fabric: "French Terry, 280-340 GSM",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Sweatshirt Body */}
          <path d="M22,20 C25,23 35,23 38,20 L58,25 L50,45 L45,43 L45,82 C45,85 15,85 15,82 L15,43 L10,45 Z" fill="#c89f9c" stroke="#99706e" strokeWidth="1" />
          {/* Ribbed neck collar & cuffs */}
          <path d="M22,20 C25,23 35,23 38,20 C35,21.5 25,21.5 22,20 Z" fill="#99706e" />
          <path d="M15,80 L45,80" stroke="#99706e" strokeWidth="1.5" />
          <line x1="10" y1="44" x2="12" y2="45" stroke="#99706e" strokeWidth="1" />
          <line x1="48" y1="45" x2="50" y2="44" stroke="#99706e" strokeWidth="1" />
          {/* Script Chest Branding */}
          <path d="M22,35 C24,33 26,37 28,34 Q30,32 32,35" stroke="#333333" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Tracksuits",
      moq: "150 Sets",
      fabric: "Polyester Blend, NS Lycra",
      imagePath: "/images/tracksuit.webp",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Top Jacket */}
          <path d="M20,20 L30,16 L40,24 L36,45 L31,43 L31,52 L19,52 L19,43 L14,45 Z" fill="#2c2c2c" stroke="#151515" strokeWidth="1" />
          {/* Golden Zip Line */}
          <line x1="25" y1="16" x2="25" y2="52" stroke="#d4af37" strokeWidth="1" />
          {/* Golden Shoulder Accent stripes */}
          <path d="M20,20 L16,35" stroke="#d4af37" strokeWidth="0.8" />
          <path d="M30,20 L34,35" stroke="#d4af37" strokeWidth="0.8" />
          {/* Pants */}
          <path d="M20,55 L30,55 L32,85 L26,85 L25,70 L24,70 L23,85 L18,85 Z" fill="#2c2c2c" stroke="#151515" strokeWidth="1" />
          {/* Pants Side Stripe */}
          <path d="M19,56 L17,85" stroke="#d4af37" strokeWidth="0.8" />
          <path d="M31,56 L33,85" stroke="#d4af37" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      name: "Shorts",
      moq: "100 Pcs",
      fabric: "Loopknit / Poly-cotton",
      imagePath: "/images/shorts.webp",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Tan Shorts Body */}
          <path d="M15,25 L45,25 L48,58 L32,58 L30,42 L28,42 L26,58 L12,58 Z" fill="#d2b48c" stroke="#a68962" strokeWidth="1" />
          {/* Waist Band Gather lines */}
          <path d="M15,29 L45,29" stroke="#a68962" strokeWidth="1" strokeDasharray="1.5,1.5" />
          {/* Drawstrings */}
          <path d="M28,25 Q28,34 26,38" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M32,25 Q31,32 33,36" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: "Joggers",
      moq: "100 Pcs",
      fabric: "Terry / Interlock, 260-300 GSM",
      imagePath: "/images/joggers.jpg",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Grey Joggers Body */}
          <path d="M18,15 L42,15 L45,82 L38,82 C38,82 31,42 30,42 C29,42 22,82 22,82 L15,82 Z" fill="#708090" stroke="#546270" strokeWidth="1" />
          {/* Waist band line */}
          <path d="M18,19 L42,19" stroke="#546270" strokeWidth="1" />
          {/* Ribbed bottom ankle cuffs */}
          <path d="M22,80 L22,82" stroke="#3c4652" strokeWidth="1.5" />
          <path d="M45,80 L45,82" stroke="#3c4652" strokeWidth="1.5" />
          {/* Drawstring lines */}
          <path d="M28,15 L28,24" stroke="#ffffff" strokeWidth="0.8" />
          <path d="M32,15 L32,22" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      name: "Tank Tops",
      moq: "100 Pcs",
      fabric: "Sinker Cotton, 160-180 GSM",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Olive Tank Top Body */}
          <path d="M22,25 C22,20 28,15 30,15 C33,18 37,18 40,15 C42,15 48,20 48,25 L45,45 L45,85 L15,85 L15,45 Z" fill="#4b5320" stroke="#353b16" strokeWidth="1" />
          {/* Bound seam detailing */}
          <path d="M30,15 C33,18 37,18 40,15" stroke="#353b16" strokeWidth="0.8" fill="none" />
        </svg>
      ),
    },
    {
      name: "Corporate Wear",
      moq: "50 Pcs",
      fabric: "Giza Cotton, Linen, Ox-Weave",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Sky Blue Dress Shirt body */}
          <path d="M15,20 L30,14 L35,28 L30,35 L30,85 L5,85 L5,35 L0,28 Z" fill="#e0ecf8" stroke="#9bbce2" strokeWidth="1" />
          {/* Placket center button line */}
          <path d="M15,20 L15,85" stroke="#9bbce2" strokeWidth="1" />
          {/* White Collar Stand flaps */}
          <path d="M15,20 L5,25 L10,34 L15,20" fill="#ffffff" stroke="#9bbce2" strokeWidth="0.8" />
          <path d="M15,20 L25,25 L20,34 L15,20" fill="#ffffff" stroke="#9bbce2" strokeWidth="0.8" />
          {/* Chest Pocket */}
          <rect x="5" y="38" width="6" height="8" rx="0.5" fill="#e0ecf8" stroke="#9bbce2" strokeWidth="0.8" />
          {/* Buttons dots */}
          <circle cx="15" cy="35" r="0.6" fill="#9bbce2" />
          <circle cx="15" cy="48" r="0.6" fill="#9bbce2" />
          <circle cx="15" cy="62" r="0.6" fill="#9bbce2" />
        </svg>
      ),
    },
    {
      name: "Uniforms",
      moq: "100 Pcs",
      fabric: "Twill, Drill, Anti-static Blend",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Steel Blue Utility Shirt */}
          <path d="M22,22 L33,16 L38,22 L42,22 L47,16 L58,22 L54,42 L48,40 L48,85 L12,85 L12,40 L6,42 Z" fill="#3a4e5d" stroke="#25333f" strokeWidth="1" />
          {/* Flap pockets */}
          <rect x="17" y="34" width="9" height="10" rx="1" fill="#25333f" stroke="#1d2731" strokeWidth="0.8" />
          <rect x="34" y="34" width="9" height="10" rx="1" fill="#25333f" stroke="#1d2731" strokeWidth="0.8" />
          {/* Pocket button detail */}
          <circle cx="21.5" cy="36" r="0.6" fill="#ffffff" />
          <circle cx="38.5" cy="36" r="0.6" fill="#ffffff" />
          {/* Button placket */}
          <path d="M30,22 L30,85" stroke="#25333f" strokeWidth="1" />
        </svg>
      ),
    },
    {
      name: "Custom Merchandise",
      moq: "100 Pcs",
      fabric: "Tailored to Brand Specs",
      svgPath: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
          {/* Matte Black Tee */}
          <path d="M22,22 L33,16 L47,16 L58,22 L53,35 L47,34 L47,85 L13,85 L13,34 L7,35 Z" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="1" />
          <path d="M33,16 C35,17.5 38,18 40,18 C42,18 45,17.5 47,16 Z" fill="#0a0a0a" />
          {/* Linear Neon Gradients */}
          <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          {/* Abstract triangle design */}
          <polygon points="24,35 36,35 30,48" fill="url(#neonGrad)" />
          <polygon points="36,48 24,48 30,35" fill="url(#neonGrad)" opacity="0.8" />
          <circle cx="30" cy="41" r="3" stroke="#ffffff" strokeWidth="0.5" fill="none" />
        </svg>
      ),
    },
  ];

  const handleInquireClick = (productName: string) => {
    // Scroll to contact form
    const target = document.querySelector("#contact");
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Dispatch event to autofill product selection
      setTimeout(() => {
        const selectEvent = new CustomEvent("select-product", {
          detail: { product: productName },
        });
        window.dispatchEvent(selectEvent);
      }, 300);
    }
  };

  return (
    <section id="products" className="scroll-mt-20 relative overflow-hidden bg-background py-10 sm:py-12 lg:py-14" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-3 text-center sm:mb-10 lg:mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Our Catalog
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Product Categories.
          </h2>
          <p className="text-base text-muted-custom leading-relaxed">
            Select a product category to explore MOQ specs, premium blends, and trigger quotes immediately.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group relative flex h-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-border-custom/60 bg-card p-6 text-center transition-all duration-300 hover:border-accent-custom/50 hover:shadow-md"
            >
              {/* Top info and vector outline */}
              <div className="flex flex-col items-center w-full">
                <div className="relative mb-6 flex aspect-4/5 w-full max-w-45 items-center justify-center rounded-xl bg-foreground/2 transition-all duration-300 group-hover:scale-105 group-hover:bg-accent-custom/5 dark:bg-white/2">
                  {cat.imagePath ? (
                    <img src={cat.imagePath} alt={cat.name} className="h-full w-full rounded-xl object-cover object-center" />
                  ) : (
                    cat.svgPath
                  )}
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-accent-custom transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs font-semibold text-accent-custom bg-accent-custom/10 px-2 py-0.5 rounded-full mt-2 border border-accent-custom/25">
                  MOQ: {cat.moq}
                </span>
                <p className="text-xs text-muted-custom mt-3 px-2 leading-relaxed">
                  {cat.fabric}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleInquireClick(cat.name)}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-border-custom hover:border-accent-custom hover:bg-accent-custom hover:text-white transition-all text-xs font-semibold cursor-pointer group-hover:shadow-sm"
              >
                Inquire Now
                <ArrowUpRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
