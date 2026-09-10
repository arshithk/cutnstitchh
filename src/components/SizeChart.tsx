"use client";

import React, { useState, useId } from "react";
import { Ruler, ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MetricRow {
  name: string;
  description?: string;
  inches: (string | number)[];
  cm: (string | number)[];
}

export interface SizeChartData {
  title: string;
  fitBadge: string;
  sizes: string[];
  metrics: MetricRow[];
  guideTips: { title: string; instruction: string }[];
}

const CATEGORY_CHARTS: Record<string, SizeChartData> = {
  "regular-fit": {
    title: "Regular Fit T-Shirt",
    fitBadge: "Classic Regular Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Measured flat across chest from armpit seam to armpit seam",
        inches: [19, 20, 21, 22, 23, 24],
        cm: [48.5, 51.0, 53.5, 56.0, 58.5, 61.0],
      },
      {
        name: "Full Chest",
        description: "Total circumference around the widest chest area",
        inches: [38, 40, 42, 44, 46, 48],
        cm: [96.5, 101.5, 106.5, 112.0, 117.0, 122.0],
      },
      {
        name: "Body Length",
        description: "From highest point of shoulder down to bottom hem",
        inches: [26, 27, 28, 29, 30, 31],
        cm: [66.0, 68.5, 71.0, 73.5, 76.0, 78.5],
      },
      {
        name: "Shoulder Width",
        description: "Shoulder seam to shoulder seam straight across back",
        inches: [16.5, 17.5, 18.5, 19.5, 20.5, 21.5],
        cm: [42.0, 44.5, 47.0, 49.5, 52.0, 54.5],
      },
      {
        name: "Sleeve Length",
        description: "From shoulder seam down to cuff edge",
        inches: [8.0, 8.25, 8.5, 8.75, 9.0, 9.25],
        cm: [20.5, 21.0, 21.5, 22.0, 23.0, 23.5],
      },
    ],
    guideTips: [
      { title: "Chest", instruction: "Measure around the fullest part of your chest, keeping the tape horizontal." },
      { title: "Length", instruction: "Measure from the highest point of your shoulder down to your waistline or desired hem." },
      { title: "Shoulder", instruction: "Measure straight across the back from shoulder tip to shoulder tip." },
    ],
  },
  polo: {
    title: "Polo T-Shirt",
    fitBadge: "Structured Smart Casual Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Measured flat across chest from armpit seam to armpit seam",
        inches: [19, 20, 21, 22, 23, 24],
        cm: [48.5, 51.0, 53.5, 56.0, 58.5, 61.0],
      },
      {
        name: "Full Chest",
        description: "Total circumference around the widest chest area",
        inches: [38, 40, 42, 44, 46, 48],
        cm: [96.5, 101.5, 106.5, 112.0, 117.0, 122.0],
      },
      {
        name: "Body Length",
        description: "From collar seam down to bottom edge of hem",
        inches: [26.5, 27.5, 28.5, 29.5, 30.5, 31.5],
        cm: [67.5, 70.0, 72.5, 75.0, 77.5, 80.0],
      },
      {
        name: "Shoulder Width",
        description: "Shoulder point across back to opposite shoulder point",
        inches: [17.0, 18.0, 19.0, 20.0, 21.0, 22.0],
        cm: [43.0, 45.5, 48.0, 51.0, 53.5, 56.0],
      },
      {
        name: "Sleeve Length",
        description: "Shoulder seam to bottom of ribbed sleeve band",
        inches: [8.5, 8.75, 9.0, 9.25, 9.5, 9.75],
        cm: [21.5, 22.0, 23.0, 23.5, 24.0, 25.0],
      },
    ],
    guideTips: [
      { title: "Chest", instruction: "Measure around the chest at the widest point under armpits." },
      { title: "Collar & Hem", instruction: "Polos feature ribbed collars and side vents for tucked or untucked styling." },
    ],
  },
  oversized: {
    title: "Oversized T-Shirt",
    fitBadge: "Relaxed Boxy / Drop Shoulder Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Wide streetwear cut, measured flat across chest",
        inches: [21, 22, 23, 24, 25, 26],
        cm: [53.5, 56.0, 58.5, 61.0, 63.5, 66.0],
      },
      {
        name: "Full Chest",
        description: "Generous loose circumference",
        inches: [42, 44, 46, 48, 50, 52],
        cm: [106.5, 112.0, 117.0, 122.0, 127.0, 132.0],
      },
      {
        name: "Body Length",
        description: "Extended streetwear length from shoulder to hem",
        inches: [28, 29, 30, 31, 32, 33],
        cm: [71.0, 73.5, 76.0, 78.5, 81.5, 84.0],
      },
      {
        name: "Drop Shoulder",
        description: "Extended dropped shoulder seam width across back",
        inches: [21, 22, 23, 24, 25, 26],
        cm: [53.5, 56.0, 58.5, 61.0, 63.5, 66.0],
      },
      {
        name: "Sleeve Length",
        description: "Elongated drop sleeve to elbow level",
        inches: [9.5, 10.0, 10.5, 11.0, 11.5, 12.0],
        cm: [24.0, 25.5, 26.5, 28.0, 29.0, 30.5],
      },
    ],
    guideTips: [
      { title: "Fit Advice", instruction: "This garment has an intentional roomy, drop-shoulder silhouette. Order your normal size for the loose oversized aesthetic." },
    ],
  },
  hoodie: {
    title: "Hoodie",
    fitBadge: "Comfort Heavyweight Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Measured flat across chest below armholes",
        inches: [20, 21, 22, 23, 24, 25],
        cm: [51.0, 53.5, 56.0, 58.5, 61.0, 63.5],
      },
      {
        name: "Full Chest",
        description: "Full circumference around chest",
        inches: [40, 42, 44, 46, 48, 50],
        cm: [101.5, 106.5, 112.0, 117.0, 122.0, 127.0],
      },
      {
        name: "Body Length",
        description: "From high shoulder point to bottom ribbed waist",
        inches: [26.5, 27.5, 28.5, 29.5, 30.5, 31.5],
        cm: [67.5, 70.0, 72.5, 75.0, 77.5, 80.0],
      },
      {
        name: "Sleeve Length",
        description: "Shoulder seam to ribbed wrist cuff edge",
        inches: [24.0, 24.5, 25.0, 25.5, 26.0, 26.5],
        cm: [61.0, 62.0, 63.5, 65.0, 66.0, 67.5],
      },
    ],
    guideTips: [
      { title: "Layering", instruction: "Crafted with 300+ GSM fleece/terry with generous room for under-layers." },
    ],
  },
  sweatshirt: {
    title: "Sweatshirt",
    fitBadge: "Classic Crewneck Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Measured flat across chest below armholes",
        inches: [20, 21, 22, 23, 24, 25],
        cm: [51.0, 53.5, 56.0, 58.5, 61.0, 63.5],
      },
      {
        name: "Full Chest",
        description: "Full circumference around chest",
        inches: [40, 42, 44, 46, 48, 50],
        cm: [101.5, 106.5, 112.0, 117.0, 122.0, 127.0],
      },
      {
        name: "Body Length",
        description: "From shoulder seam to bottom hem",
        inches: [26.0, 27.0, 28.0, 29.0, 30.0, 31.0],
        cm: [66.0, 68.5, 71.0, 73.5, 76.0, 78.5],
      },
      {
        name: "Sleeve Length",
        description: "Shoulder seam down to wrist cuff edge",
        inches: [24.0, 24.5, 25.0, 25.5, 26.0, 26.5],
        cm: [61.0, 62.0, 63.5, 65.0, 66.0, 67.5],
      },
    ],
    guideTips: [
      { title: "Crewneck Collar", instruction: "Comfortable spandex rib at neck, cuffs, and hem for stretch recovery." },
    ],
  },
  joggers: {
    title: "Joggers",
    fitBadge: "Tapered Activewear Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "Waist (To Fit)",
        description: "Elasticated waistband with drawcord adjustment",
        inches: ["28-30", "30-32", "32-34", "34-36", "36-38", "38-40"],
        cm: ["71-76", "76-81", "81-86", "86-91", "91-97", "97-102"],
      },
      {
        name: "Hip Circumference",
        description: "Widest circumference across hip and seat",
        inches: [38, 40, 42, 44, 46, 48],
        cm: [96.5, 101.5, 106.5, 112.0, 117.0, 122.0],
      },
      {
        name: "Outseam (Total Length)",
        description: "From top of waistband down along side to ankle cuff",
        inches: [38, 39, 40, 41, 42, 43],
        cm: [96.5, 99.0, 101.5, 104.0, 106.5, 109.0],
      },
      {
        name: "Inseam Length",
        description: "From crotch point down along inner leg seam",
        inches: [28.0, 28.5, 29.0, 29.5, 30.0, 30.5],
        cm: [71.0, 72.5, 73.5, 75.0, 76.0, 77.5],
      },
    ],
    guideTips: [
      { title: "Waistline", instruction: "Measure around your natural waistline where your pants usually sit." },
      { title: "Ankle Cuff", instruction: "Features elasticated rib cuffs engineered to rest neatly above footwear." },
    ],
  },
  shorts: {
    title: "Shorts",
    fitBadge: "Athletic Relaxed Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "Waist (To Fit)",
        description: "Elasticated comfort waistband with internal cord",
        inches: ["28-30", "30-32", "32-34", "34-36", "36-38", "38-40"],
        cm: ["71-76", "76-81", "81-86", "86-91", "91-97", "97-102"],
      },
      {
        name: "Hip Circumference",
        description: "Widest circumference across hip seat",
        inches: [38, 40, 42, 44, 46, 48],
        cm: [96.5, 101.5, 106.5, 112.0, 117.0, 122.0],
      },
      {
        name: "Outseam (Total Length)",
        description: "From top of waistband down outside edge to leg hem",
        inches: [18.0, 18.5, 19.0, 19.5, 20.0, 20.5],
        cm: [45.5, 47.0, 48.5, 49.5, 51.0, 52.0],
      },
      {
        name: "Inseam Length",
        description: "From inner crotch down to bottom hem",
        inches: [7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
        cm: [19.0, 20.5, 21.5, 23.0, 24.0, 25.5],
      },
    ],
    guideTips: [
      { title: "Length", instruction: "Designed to fall comfortably just above the knee for sports and leisure." },
    ],
  },
  uniforms: {
    title: "Corporate Uniforms & Shirts",
    fitBadge: "Tailored Executive Fit",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    metrics: [
      {
        name: "½ Chest (Pit to Pit)",
        description: "Measured flat across chest from armpit seam to armpit seam",
        inches: [19, 20, 21, 22, 23, 24],
        cm: [48.5, 51.0, 53.5, 56.0, 58.5, 61.0],
      },
      {
        name: "Full Chest",
        description: "Total circumference around the widest chest area",
        inches: [38, 40, 42, 44, 46, 48],
        cm: [96.5, 101.5, 106.5, 112.0, 117.0, 122.0],
      },
      {
        name: "Body Length",
        description: "Collar seam to bottom hem",
        inches: [27, 28, 29, 30, 31, 32],
        cm: [68.5, 71.0, 73.5, 76.0, 78.5, 81.5],
      },
      {
        name: "Shoulder Width",
        description: "Shoulder point across back to opposite shoulder point",
        inches: [17.5, 18.5, 19.5, 20.5, 21.5, 22.5],
        cm: [44.5, 47.0, 49.5, 52.0, 54.5, 57.0],
      },
    ],
    guideTips: [
      { title: "Custom Grading", instruction: "Custom corporate fit specifications and plus-size grading are available on request for bulk contracts." },
    ],
  },
};

function resolveChartKey(categorySlug?: string, categoryName?: string, productName?: string): string {
  const combined = `${categorySlug || ""} ${categoryName || ""} ${productName || ""}`.toLowerCase();

  if (combined.includes("oversize")) return "oversized";
  if (combined.includes("polo")) return "polo";
  if (combined.includes("hoodie")) return "hoodie";
  if (combined.includes("sweatshirt")) return "sweatshirt";
  if (combined.includes("jogger")) return "joggers";
  if (combined.includes("short")) return "shorts";
  if (combined.includes("uniform") || combined.includes("corporate")) return "uniforms";
  if (combined.includes("regular") || combined.includes("t-shirt") || combined.includes("tee")) return "regular-fit";

  return "regular-fit";
}

interface SizeChartProps {
  categorySlug?: string;
  categoryName?: string;
  productName?: string;
  defaultOpen?: boolean;
  className?: string;
}

export default function SizeChart({
  categorySlug,
  categoryName,
  productName,
  defaultOpen = true,
  className = "",
}: SizeChartProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [showGuide, setShowGuide] = useState(false);
  const contentId = useId();

  const chartKey = resolveChartKey(categorySlug, categoryName, productName);
  const chartData = CATEGORY_CHARTS[chartKey] || CATEGORY_CHARTS["regular-fit"];

  return (
    <div
      id="size-chart"
      className={`rounded-3xl border border-border-custom/70 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all sm:p-6 ${className}`}
    >
      {/* Header: Title, Fit Badge, Unit Switcher, Accordion Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent-custom/30 bg-accent-custom/10 text-accent-custom shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Ruler size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Size Chart & Measurements
              </h3>
              <span className="hidden rounded-full border border-accent-custom/30 bg-accent-custom/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-custom sm:inline-block">
                {chartData.fitBadge}
              </span>
            </div>
            <p className="text-xs text-muted-custom">
              {chartData.title} specifications • Standard Indian B2B Sizing
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {/* Unit Toggle */}
          <div className="flex items-center rounded-full border border-border-custom/70 bg-background/90 p-1">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                unit === "in"
                  ? "bg-accent-custom text-black shadow-xs"
                  : "text-muted-custom hover:text-foreground"
              }`}
              aria-label="Display measurements in inches"
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                unit === "cm"
                  ? "bg-accent-custom text-black shadow-xs"
                  : "text-muted-custom hover:text-foreground"
              }`}
              aria-label="Display measurements in centimeters"
            >
              CM
            </button>
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-custom/70 bg-background/80 text-foreground transition hover:border-accent-custom/50 hover:bg-white/5"
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={isOpen ? "Collapse size chart" : "Expand size chart"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Main Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Table wrapper with smooth scroll */}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border-custom/60 bg-black/40">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border-custom/50 bg-white/5">
                    <th className="py-3 pl-4 pr-3 font-semibold uppercase tracking-wider text-muted-custom">
                      Measurement ({unit === "in" ? "Inches" : "CM"})
                    </th>
                    {chartData.sizes.map((size) => (
                      <th
                        key={size}
                        className="px-3 py-3 text-center font-bold tracking-wider text-accent-custom"
                      >
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/30 font-medium">
                  {chartData.metrics.map((metric, rowIdx) => {
                    const values = unit === "in" ? metric.inches : metric.cm;
                    return (
                      <tr
                        key={metric.name}
                        className={`transition-colors hover:bg-white/5 ${
                          rowIdx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="py-3 pl-4 pr-3 text-foreground">
                          <div className="font-semibold text-foreground/95">{metric.name}</div>
                          {metric.description && (
                            <div className="hidden text-[11px] font-normal text-muted-custom sm:block">
                              {metric.description}
                            </div>
                          )}
                        </td>
                        {values.map((val, idx) => (
                          <td
                            key={`${metric.name}-${idx}`}
                            className="px-3 py-3 text-center text-foreground/90 font-mono text-xs sm:text-sm"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tolerance, 3XL surcharge note, and Measurement Tips toggle */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-custom">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  📐 <strong>Tolerance:</strong> ±0.5 in / 1.2 cm standard apparel tolerance
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  🏷️ <strong>3XL Surcharge:</strong> +₹20/unit applies on 3XL sizes
                </span>
              </div>

              {chartData.guideTips.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="inline-flex items-center gap-1 font-semibold text-accent-custom transition hover:underline"
                >
                  <Info size={14} />
                  {showGuide ? "Hide Measuring Tips" : "How to Measure"}
                </button>
              )}
            </div>

            {/* Expandable Measuring Guide Tips */}
            <AnimatePresence>
              {showGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid gap-3 rounded-2xl border border-accent-custom/20 bg-accent-custom/5 p-4 text-xs">
                    <p className="font-semibold uppercase tracking-wider text-accent-custom">
                      Measurement Instructions:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {chartData.guideTips.map((tip) => (
                        <div key={tip.title} className="space-y-0.5">
                          <span className="font-semibold text-foreground">• {tip.title}:</span>{" "}
                          <span className="text-muted-custom">{tip.instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
