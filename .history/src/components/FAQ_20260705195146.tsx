"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is your Minimum Order Quantity (MOQ)?",
      answer: "Our standard Minimum Order Quantity (MOQ) is 100 pieces per style/color. For sports jerseys or custom cut-and-sew tracksuits, the MOQ is 150 pieces. This helps startups launch collections without heavy upfront inventory liabilities.",
    },
    {
      question: "What is the typical production lead time?",
      answer: "Bulk production takes 15 to 25 calendar days depending on order size and complexity. This timeline starts once the pre-production sample is approved by you and the advance deposit is received.",
    },
    {
      question: "How do you calculate pricing for custom apparel runs?",
      answer: "Our direct manufacturing pricing depends on four main variables: (1) Garment style (e.g. Tee vs Hoodie), (2) Fabric choice and GSM (e.g. 100% Combed Cotton, French Terry, Pique), (3) Customization branding requirements (puff printing, embroidery, labels), and (4) Total order quantity. Larger volume runs benefit from economies of scale.",
    },
    {
      question: "What fabric blends and GSM weights are available?",
      answer: "We offer a wide catalog: 100% Combed Cotton, Organic Cotton, Poly-Cotton blends, Pique Honeycomb (Polos), French Terry, Loopknit, and Lycra-Spandex sports blends. Weights range from lightweight summer sinkers (160-180 GSM) to heavyweight oversized tees (220-280 GSM) and thick winter fleece (320-400 GSM). Custom dyeing is also available for specific Pantone shades.",
    },
    {
      question: "What print styles and branding options do you offer?",
      answer: "We do Screen Printing, Puff/3D Printing, High-Density Embroidery, Chenille patches, DTF (Direct to Film) Printing, and Heat Transfer sublimations. We also manage private-labeling assets like custom woven neck labels, satin wash cares, printed sizes, and custom-branded eco-poly bags.",
    },
    {
      question: "Do you ship PAN India? What are the logistics?",
      answer: "Yes, we ship PAN India. We have contracted courier partners (Gati, Delhivery, V-Trans) offering door-to-door delivery across all major states, cities, and ports. International container shipping is also supported for global export clients.",
    },
    {
      question: "Can we order a physical sample before bulk production?",
      answer: "Absolutely! Sampling is a key stage of our workflow. We create a physical pre-production sample using your exact tech specs and prints for fitment, fabric feel, and detailing check. A nominal sample fee applies, which is adjusted/refunded in full upon placing the subsequent bulk production order.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col gap-4 mb-16 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Frequently Asked.
          </h2>
          <p className="text-base text-muted-custom leading-relaxed">
            All details relating to MOQ, fabric selections, sampling processes, and shipping.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="bg-card border border-border-custom/60 rounded-2xl overflow-hidden transition-colors hover:border-accent-custom/40"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between gap-4 text-left font-bold text-foreground text-base cursor-pointer focus-visible:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 p-1.5 rounded-full bg-foreground/[0.04] text-foreground/80 dark:bg-white/[0.04]">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-muted-custom leading-relaxed border-t border-border-custom/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
