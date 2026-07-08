"use client";

import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";

interface StickyCTAProps {
  productName: string;
}

export default function StickyCTA({ productName }: StickyCTAProps) {
  return (
    <div className="sticky bottom-4 z-30 mt-10 rounded-3xl border border-accent-custom/30 bg-black/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur xl:bottom-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-custom">Ready to scale</p>
          <p className="text-sm text-muted-custom">Request a quote for {productName} with premium bulk manufacturing support.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="#contact"
            className="rounded-full bg-accent-custom px-5 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110"
          >
            Get Quote
          </Link>
          <a
            href="https://wa.me/919999999999?text=Hello%20CutnStitch%2C%20I%20would%20like%20to%20inquire%20about%20the%20selected%20product."
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-accent-custom/40 px-5 py-3 text-sm font-semibold text-accent-custom transition hover:bg-accent-custom hover:text-black"
          >
            <MessageCircle className="h-4 w-4" />
            Inquire Now
          </a>
        </div>
      </div>
    </div>
  );
}
