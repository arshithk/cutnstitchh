"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Palette, CheckCircle, RefreshCw } from "lucide-react";

export default function Customizer() {
  const [garment, setGarment] = useState<"tee" | "hoodie" | "polo">("tee");
  const [color, setColor] = useState({ name: "Off White", hex: "#faf9f6" });
  const [gsm, setGsm] = useState(240);
  const [print, setPrint] = useState("Puff Printing");
  const [label, setLabel] = useState("Woven Label");

  const colors = [
    { name: "Off White", hex: "#faf9f6" },
    { name: "Jet Black", hex: "#151515" },
    { name: "Warm Sand", hex: "#d8c3a5" },
    { name: "Sage Green", hex: "#8eb897" },
    { name: "Burgundy", hex: "#5c1d24" },
  ];

  const garments = [
    { id: "tee", name: "Oversized T-Shirt" },
    { id: "hoodie", name: "Premium Hoodie" },
    { id: "polo", name: "Classic Polo" },
  ];

  const gsms = [180, 240, 280, 360, 400];

  const printMethods = [
    "Screen Printing",
    "Puff Printing",
    "High-Density Embroidery",
    "DTF Printing",
    "Heat Transfer",
  ];

  const labels = [
    "Woven Neck Label",
    "Printed Neck Label",
    "Satin Wash Care Label",
    "Custom Hang Tags",
  ];

  const handleInquireConfig = () => {
    const target = document.querySelector("#contact");
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Dispatch event to autofill contact form with configurations
      setTimeout(() => {
        const configText = `Customizer Order: ${
          garments.find((g) => g.id === garment)?.name
        }, Color: ${color.name}, GSM: ${gsm}g, Method: ${print}, Labeling: ${label}.`;
        const selectEvent = new CustomEvent("select-product", {
          detail: {
            product: garments.find((g) => g.id === garment)?.name || "Oversized T-Shirts",
            message: `Hi, we would like to get a quote for a custom run of ${
              garments.find((g) => g.id === garment)?.name
            }. Spec configuration: Color: ${color.name}, GSM: ${gsm}g, Branding: ${print}, Labeling: ${label}. Please share pricing and sampling guidelines.`,
          },
        });
        window.dispatchEvent(selectEvent);
      }, 300);
    }
  };

  const handleReset = () => {
    setGarment("tee");
    setColor({ name: "Off White", hex: "#faf9f6" });
    setGsm(240);
    setPrint("Puff Printing");
    setLabel("Woven Label");
  };

  return (
    <section id="customization" className="py-24 bg-card/10 border-b border-border-custom/50 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="flex flex-col gap-4 mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Apparel Configurator
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Custom Manufacturing.
          </h2>
          <p className="text-base text-muted-custom leading-relaxed">
            Configure fabric weight, colors, customization types, and labels below to preview your brand's premium production spec.
          </p>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Controls - Left */}
          <div className="lg:col-span-6 flex flex-col gap-6 bg-card border border-border-custom/60 rounded-3xl p-8 shadow-sm">
            {/* Garment Selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-bold text-foreground/80 flex items-center gap-1.5">
                <Sliders size={14} className="text-accent-custom" />
                1. Garment Style
              </span>
              <div className="grid grid-cols-3 gap-3">
                {garments.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGarment(g.id as any)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      garment === g.id
                        ? "border-accent-custom bg-accent-custom/5 text-accent-custom"
                        : "border-border-custom hover:border-foreground/20 text-muted-custom"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-bold text-foreground/80 flex items-center gap-1.5">
                <Palette size={14} className="text-accent-custom" />
                2. Dye Color: <strong className="text-accent-custom">{color.name}</strong>
              </span>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                      color.name === c.name ? "border-accent-custom scale-110" : "border-border-custom"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Select ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* GSM selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-bold text-foreground/80">
                3. Fabric Density (GSM): <strong className="text-accent-custom">{gsm} GSM</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {gsms.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setGsm(weight)}
                    className={`py-2 px-4 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      gsm === weight
                        ? "border-accent-custom bg-accent-custom/10 text-accent-custom"
                        : "border-border-custom hover:border-foreground/20 text-muted-custom"
                    }`}
                  >
                    {weight} GSM
                  </button>
                ))}
              </div>
            </div>

            {/* Print Type */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-bold text-foreground/80">
                4. Printing & Branding Method
              </span>
              <div className="grid grid-cols-2 gap-2">
                {printMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPrint(m)}
                    className={`py-2 px-3 text-[11px] text-left font-medium rounded-lg border transition-all cursor-pointer ${
                      print === m
                        ? "border-accent-custom bg-accent-custom/5 text-accent-custom"
                        : "border-border-custom hover:border-foreground/20 text-muted-custom"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Label selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-bold text-foreground/80">
                5. Custom Labelling & Tags
              </span>
              <div className="grid grid-cols-2 gap-2">
                {labels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLabel(l)}
                    className={`py-2 px-3 text-[11px] text-left font-medium rounded-lg border transition-all cursor-pointer ${
                      label === l
                        ? "border-accent-custom bg-accent-custom/5 text-accent-custom"
                        : "border-border-custom hover:border-foreground/20 text-muted-custom"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-custom/50">
              <button
                onClick={handleInquireConfig}
                className="flex-1 py-3 px-6 bg-primary-custom text-primary-foreground-custom hover:bg-accent-custom hover:text-white font-semibold text-sm rounded-xl transition-all cursor-pointer text-center"
              >
                Inquire With This Spec
              </button>
              <button
                onClick={handleReset}
                className="p-3 border border-border-custom hover:border-foreground/20 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer text-muted-custom"
                aria-label="Reset Configurator"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Interactive Preview - Right */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-foreground/[0.01] dark:bg-white/[0.01] border border-border-custom/40 rounded-3xl min-h-[450px] relative overflow-hidden">
            <div className="absolute top-4 left-6 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-custom">
                Interactive Preview
              </span>
              <span className="text-xs font-bold text-foreground">
                {garments.find((g) => g.id === garment)?.name}
              </span>
            </div>

            {/* Dynamically Styled SVG Preview */}
            <motion.div
              key={garment}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[280px] aspect-square flex items-center justify-center filter drop-shadow-lg"
            >
              {garment === "tee" && (
                <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-500" style={{ fill: color.hex }}>
                  {/* Oversized T-Shirt Fill and Stroke */}
                  <path
                    d="M20,25 L32,15 C35,17 38,18 41,18 C44,18 47,17 50,15 L62,25 L55,42 L48,40 L48,85 L12,85 L12,40 L5,42 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-foreground/20 dark:text-white/20"
                  />
                  {/* Sleeve Lines */}
                  <path d="M12,40 L20,38" stroke="currentColor" strokeWidth="0.8" className="text-foreground/30 dark:text-white/30" />
                  <path d="M48,40 L40,38" stroke="currentColor" strokeWidth="0.8" className="text-foreground/30 dark:text-white/30" />
                  {/* Collar detailing */}
                  <path d="M32,15 C34,17 37,18 40,18 C43,18 46,17 48,15" stroke="currentColor" strokeWidth="1" className="text-foreground/45 dark:text-white/45" fill="none" />
                </svg>
              )}

              {garment === "hoodie" && (
                <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-500" style={{ fill: color.hex }}>
                  {/* Hood outline overlay */}
                  <path
                    d="M30,22 C30,12 50,12 50,22 L30,22 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-foreground/30 dark:text-white/30"
                  />
                  {/* Hoodie shape */}
                  <path
                    d="M30,22 L20,26 L12,48 L18,50 L22,44 L22,82 C22,85 48,85 48,82 L48,44 L52,50 L58,48 L50,26 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-foreground/20 dark:text-white/20"
                  />
                  {/* Kangaroo Pocket */}
                  <path
                    d="M27,62 L43,62 L40,74 L30,74 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-foreground/30 dark:text-white/30"
                  />
                </svg>
              )}

              {garment === "polo" && (
                <svg viewBox="0 0 100 100" className="w-full h-full transition-colors duration-500" style={{ fill: color.hex }}>
                  {/* Polo garment shape */}
                  <path
                    d="M22,22 L33,16 L38,25 L42,25 L47,16 L58,22 L53,35 L47,34 L47,85 L13,85 L13,34 L7,35 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-foreground/20 dark:text-white/20"
                  />
                  {/* Collar details */}
                  <path
                    d="M33,16 L37,25 L37,32 L43,32 L43,25 L47,16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-foreground/40 dark:text-white/40"
                  />
                </svg>
              )}

              {/* Decorative print method badge on chest */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold tracking-widest text-foreground/50 dark:text-white/50 bg-foreground/5 dark:bg-white/5 py-1 px-2.5 rounded-full border border-foreground/10 dark:border-white/10 shadow-sm">
                  {print}
                </span>
              </div>
            </motion.div>

            {/* Spec breakdown overlay */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs w-full max-w-sm">
              <span className="flex items-center gap-1 bg-foreground/[0.03] dark:bg-white/[0.03] border border-border-custom/50 py-1.5 px-3 rounded-full">
                <CheckCircle size={10} className="text-accent-custom" />
                Dye: {color.name}
              </span>
              <span className="flex items-center gap-1 bg-foreground/[0.03] dark:bg-white/[0.03] border border-border-custom/50 py-1.5 px-3 rounded-full">
                <CheckCircle size={10} className="text-accent-custom" />
                Density: {gsm}g
              </span>
              <span className="flex items-center gap-1 bg-foreground/[0.03] dark:bg-white/[0.03] border border-border-custom/50 py-1.5 px-3 rounded-full">
                <CheckCircle size={10} className="text-accent-custom" />
                Branding: {print}
              </span>
              <span className="flex items-center gap-1 bg-foreground/[0.03] dark:bg-white/[0.03] border border-border-custom/50 py-1.5 px-3 rounded-full">
                <CheckCircle size={10} className="text-accent-custom" />
                Label: {label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
