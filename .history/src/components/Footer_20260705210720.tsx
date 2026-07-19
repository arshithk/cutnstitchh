"use client";

import React from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 pb-8 pt-10 text-neutral-300 sm:pb-10 sm:pt-12">
      <div className="mx-auto mb-14 grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8">
        {/* Company Info */}
        <div className="flex flex-col gap-6">
          <a href="#" className="flex items-center gap-2">
            <span className="font-sans font-black text-2xl tracking-tighter uppercase text-white">
              Cutn<span className="text-accent-custom">Stitch</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-accent-custom/20 text-accent-custom px-1.5 py-0.5 rounded border border-accent-custom/30">
              B2B
            </span>
          </a>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
            High-fashion and premium apparel manufacturing at scale. Empowering clothing brands, startups, and corporates with retail-quality private label manufacturing.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:bg-accent-custom hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:bg-accent-custom hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:bg-accent-custom hover:text-white transition-colors"
            >
              <MessageSquare size={16} />
            </a>
          </div>
        </div>

        {/* Manufacturing Services */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold tracking-wider text-sm uppercase">
            Manufacturing Services
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
            <li>Custom Apparel Development</li>
            <li>OEM / ODM Production</li>
            <li>Private Label Clothing</li>
            <li>Custom Fabric Dyeing</li>
            <li>Screen & Puff Printing</li>
            <li>DTF & Heat Sublimation</li>
            <li>Embroidery & Applique</li>
          </ul>
        </div>

        {/* Product Categories Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold tracking-wider text-sm uppercase">
            Products We Make
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-neutral-400">
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Oversized & Regular T-Shirts
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Hoodies & Sweatshirts
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Polo Shirts & Joggers
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Corporate Wear & Uniforms
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Custom Merch & Tank Tops
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleNavClick(e, "#products")} className="hover:text-accent-custom transition-colors">
                Tracksuits & Fleece Shorts
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold tracking-wider text-sm uppercase">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm text-neutral-400">
            <li className="flex gap-3 items-start">
              <MapPin size={18} className="text-accent-custom shrink-0 mt-0.5" />
              <span>
                <strong>Manufacturing Unit:</strong><br />
                339/2, Thilaga Nagar,<br />
                Anupparapalayam, Tirupur,<br />
                Tamil Nadu - 641 652
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={16} className="text-accent-custom shrink-0" />
              <a href="tel:+919944466311" className="hover:text-white transition-colors">
                +91 99444 66311
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={16} className="text-accent-custom shrink-0" />
              <a href="mailto:mahimaintl2009@gmail.com" className="hover:text-white transition-colors">
                mahimaintl2009@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-neutral-900 px-4 pt-8 text-xs text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
        <div>
          &copy; {currentYear} CutnStitch Apparel. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-neutral-400 cursor-pointer transition-colors">Sitemap</span>
        </div>
        <div className="text-[10px] text-neutral-600 font-medium">
          Premium Apparel Manufacturing Solutions (PAN India Delivery)
        </div>
      </div>
    </footer>
  );
}
