"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "Oversized T-Shirts",
    quantity: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productsList = [
    "Oversized T-Shirts",
    "Regular Fit T-Shirts",
    "Polo T-Shirts",
    "Hoodies",
    "Sweatshirts",
    "Tracksuits",
    "Shorts",
    "Joggers",
    "Tank Tops",
    "Corporate Wear",
    "Uniforms",
    "Custom Merchandise",
  ];

  // Listen to select-product events from other components
  useEffect(() => {
    const handleSelectProduct = (e: Event) => {
      const customEvent = e as CustomEvent<{ product: string; message?: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          product: customEvent.detail.product,
          message: customEvent.detail.message || prev.message,
        }));
      }
    };

    window.addEventListener("select-product", handleSelectProduct);
    return () => window.removeEventListener("select-product", handleSelectProduct);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit number";
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = "Target quantity is required";
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    // Simulate API request delay
    setTimeout(() => {
      setStatus("success");
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#b89c72", "#ffffff", "#000000"],
      });
    }, 1500);
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Hi CutnStitch team, my name is ${formData.name || "[Name]"} from ${formData.company || "[Company]"}. We are looking to manufacture custom ${formData.product} (Target Qty: ${formData.quantity || "100"} pcs). Please connect us with a merchant.`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="scroll-mt-20 relative border-y border-border-custom/50 bg-card/25 py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          
          {/* Left Column: Context Card */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase font-bold tracking-widest text-accent-custom">
                Start Production
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Let's Build Your Collection.
              </h2>
              <p className="text-base text-muted-custom leading-relaxed">
within 24 business hours. 
              
              </p>
            </div>

            {/* Direct Connect Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* WhatsApp Card */}
              <div
                onClick={handleWhatsAppChat}
                className="bg-background border border-border-custom p-6 rounded-2xl flex flex-col gap-3 cursor-pointer hover:border-accent-custom/40 transition-colors group"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <h4 className="font-bold text-foreground">Chat on WhatsApp</h4>
                <p className="text-xs text-muted-custom">Connect instantly with an apparel specialist for quick drafts.</p>
                <span className="text-[11px] font-bold text-emerald-500 mt-2 block group-hover:translate-x-1 transition-transform">
                  Open Chat &rarr;
                </span>
              </div>

              {/* Direct Call Card */}
              <a
                href="mailto:info@cutnstitch.com"
                className="bg-background border border-border-custom p-6 rounded-2xl flex flex-col gap-3 hover:border-accent-custom/40 transition-colors group"
              >
                <div className="p-3 bg-accent-custom/10 text-accent-custom rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-foreground">Direct Email</h4>
                <p className="text-xs text-muted-custom">Send your tech packs and custom design patterns directly to sales.</p>
                <span className="text-[11px] font-bold text-accent-custom mt-2 block group-hover:translate-x-1 transition-transform">
                  Send Mail &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="rounded-3xl border border-border-custom/60 bg-background p-6 shadow-md sm:p-8 lg:col-span-7">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-16 gap-4"
              >
                <CheckCircle2 size={64} className="text-accent-custom animate-bounce" />
                <h3 className="text-2xl font-black text-foreground">Inquiry Submitted!</h3>
                <p className="text-sm text-muted-custom max-w-sm leading-relaxed mt-2">
                  Thank you for contacting CutnStitch Apparel. A dedicated merchant has been assigned to your project and will reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      name: "",
                      company: "",
                      email: "",
                      phone: "",
                      product: "Oversized T-Shirts",
                      quantity: "",
                      message: "",
                    });
                  }}
                  className="mt-6 px-6 py-2 border border-border-custom hover:border-foreground/20 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rohan Malhotra"
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${
                        errors.name ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g. Aether Clothing"
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${
                        errors.company ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"
                      }`}
                    />
                    {errors.company && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.company}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rohan@aether.com"
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${
                        errors.email ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 99999 99999"
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${
                        errors.phone ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Product Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="product" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Garment Category
                    </label>
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="py-3 px-4 rounded-xl border bg-card/25 text-sm border-border-custom focus:border-accent-custom focus:bg-background focus:outline-none cursor-pointer"
                    >
                      {productsList.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                      Target Quantity (Pcs)
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="Min. 100 Pcs"
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${
                        errors.quantity ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"
                      }`}
                    />
                    {errors.quantity && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.quantity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                    Message / Spec Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter fabric specifications, target GSM, custom colors, printing types, and patterns information..."
                    className="py-3 px-4 rounded-xl border bg-card/25 text-sm border-border-custom focus:border-accent-custom focus:bg-background focus:outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 w-full py-4 bg-primary-custom text-primary-foreground-custom hover:bg-accent-custom hover:text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-muted-custom disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground-custom border-t-transparent rounded-full animate-spin" />
                      Processing Inquiry...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Submit Production Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
