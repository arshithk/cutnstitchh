import Link from "next/link";
import { ArrowUpRight, MessageCircleMore } from "lucide-react";

interface CTASectionProps {
  productName: string;
  inquiryOnly?: boolean;
}

export default function CTASection({ productName, inquiryOnly = false }: CTASectionProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href={`https://wa.me/919342936939?text=Hello%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(productName)}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-custom/40 bg-accent-custom px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110">
        <MessageCircleMore size={16} />
        Inquire Now
      </Link>
      <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent-custom/40 hover:text-accent-custom">
        Get Quote
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
