"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircleMore } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface CTASectionProps {
  productName: string;
  inquiryOnly?: boolean;
}

export default function CTASection({ productName, inquiryOnly = false }: CTASectionProps) {
  const siteSettings = useSiteSettings();
  const phoneNumber = siteSettings.whatsAppNumber
    ? siteSettings.whatsAppNumber.replace(/\D/g, "")
    : "919944466311";

  const message = productName
    ? `Hi Cut N Stitch Apparel 👋\n\nI’m interested in your custom apparel manufacturing services for ${productName}. I’d like to know more about products, pricing, MOQ, and customization options.\n\nPlease share the details. Thank you!`
    : `Hi Cut N Stitch Apparel 👋\n\nI’m interested in your custom apparel manufacturing services. I’d like to know more about your products, pricing, MOQ, and customization options.\n\nPlease share the details. Thank you!`;

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-custom/40 bg-accent-custom px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
      >
        <MessageCircleMore size={16} />
        Inquire Now
      </a>
      <Link href="/live-stock" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent-custom/40 hover:text-accent-custom">
        Get Quote
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
