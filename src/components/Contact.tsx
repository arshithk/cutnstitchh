"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

// ── Product → GSM → Colors mapping ────────────────────────────────────────────
interface ColorOption {
  name: string;
  hex: string;
}

interface GsmVariant {
  label: string;   // e.g. "180 GSM – 100% Cotton"
  colors: ColorOption[];
}

const PRODUCT_GSM_MAP: Record<string, GsmVariant[]> = {
  "Oversized T-Shirts": [
    {
      label: "220 GSM – 100% Cotton",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#0f1115" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Red", hex: "#a52424" },
        { name: "Brown", hex: "#6f4b2f" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Golden Yellow", hex: "#b88c12" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
    {
      label: "180 GSM – 100% Cotton",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#0f1115" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Red", hex: "#a52424" },
        { name: "Brown", hex: "#6f4b2f" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Golden Yellow", hex: "#b88c12" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
    {
      label: "240 GSM – 100% Cotton",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Red", hex: "#a52424" },
        { name: "Brown", hex: "#6f4b2f" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Golden Yellow", hex: "#b88c12" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
    {
      label: "180 GSM – PolyCotton",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Red", hex: "#a52424" },
        { name: "Brown", hex: "#6f4b2f" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Golden Yellow", hex: "#b88c12" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
  ],
  "Regular Fit T-Shirts": [
    {
      label: "180 GSM – 100% Cotton",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Red", hex: "#a52424" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
    {
      label: "180 GSM – PolyCotton",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "90 GSM – 100% Polyester",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Red", hex: "#a52424" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
      ],
    },
    {
      label: "110 GSM – 100% Polyester",
      colors: [
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Black", hex: "#111111" },
        { name: "Orange", hex: "#c96a17" },
        { name: "White", hex: "#f7f7f2" },
      ],
    },
    {
      label: "140 GSM – 100% Polyester",
      colors: [
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Black", hex: "#111111" },
        { name: "Orange", hex: "#c96a17" },
        { name: "White", hex: "#f7f7f2" },
      ],
    },
    {
      label: "160 GSM – Dot Knit Polyester",
      colors: [
        { name: "Purple", hex: "#6b3fa0" },
        { name: "Grey", hex: "#6b7280" },
        { name: "White", hex: "#f7f7f2" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "200 GSM – Dri Fit Mars",
      colors: [
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Black", hex: "#111111" },
        { name: "White", hex: "#f7f7f2" },
        { name: "Navy Blue", hex: "#20354d" },
      ],
    },
  ],
  "Polo T-Shirts": [
    {
      label: "220 GSM – 100% Cotton Piqué",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Black", hex: "#111111" },
        { name: "Royal Blue", hex: "#1f3b64" },
      ],
    },
    {
      label: "240 GSM – 100% Cotton Piqué",
      colors: [
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Navy Blue", hex: "#22334d" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Red", hex: "#a52424" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Golden Yellow", hex: "#b88c12" },
        { name: "Brown", hex: "#6f4b2f" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "220 GSM – PolyCotton Piqué",
      colors: [
        { name: "Grey", hex: "#6b7280" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#22334d" },
      ],
    },
    {
      label: "110 GSM – PP-Polyester",
      colors: [
        { name: "Orange", hex: "#c96a17" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "140 GSM – PP-Polyester",
      colors: [
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Black", hex: "#111111" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
      ],
    },
    {
      label: "160 GSM – Honeycomb Knit",
      colors: [
        { name: "Grey", hex: "#6b7280" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "160 GSM – Saleena Knit",
      colors: [
        { name: "Grey", hex: "#6b7280" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Brown", hex: "#6f4b2f" },
      ],
    },
    {
      label: "180 GSM – Dot Knit Polyester",
      colors: [
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#111111" },
      ],
    },
    {
      label: "200 GSM – Dri Fit Mars",
      colors: [
        { name: "Purple", hex: "#6b3fa0" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
      ],
    },
  ],
  "Shorts": [
    {
      label: "180 GSM – PolyCotton",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Dark Grey", hex: "#4b5563" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Olive", hex: "#6b6e2d" },
      ],
    },
    {
      label: "160 GSM – 100% Polyester",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Air Force Blue", hex: "#5d8aa8" },
        { name: "Bottle Green", hex: "#3f6b3f" },
      ],
    },
    {
      label: "200 GSM – French Terry Cotton",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Maroon", hex: "#6d2c2c" },
      ],
    },
  ],
  "Joggers": [
    {
      label: "280 GSM – PolyCotton Fleece",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Dark Grey", hex: "#4b5563" },
        { name: "Maroon", hex: "#6d2c2c" },
      ],
    },
    {
      label: "240 GSM – French Terry Cotton",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Olive", hex: "#6b6e2d" },
      ],
    },
    {
      label: "320 GSM – Cotton Fleece",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
      ],
    },
  ],
  "Corporate Wear": [
    {
      label: "220 GSM – 100% Cotton Piqué Polo",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
        { name: "Black", hex: "#111111" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Royal Blue", hex: "#1f3b64" },
      ],
    },
    {
      label: "180 GSM – 100% Cotton Round Neck",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
      ],
    },
    {
      label: "240 GSM – Premium Cotton Piqué",
      colors: [
        { name: "Navy Blue", hex: "#22334d" },
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#111111" },
        { name: "Brown", hex: "#6f4b2f" },
      ],
    },
  ],
  "Uniforms": [
    {
      label: "180 GSM – PolyCotton",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Black", hex: "#111111" },
        { name: "Maroon", hex: "#6d2c2c" },
      ],
    },
    {
      label: "90 GSM – 100% Polyester",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Red", hex: "#a52424" },
        { name: "Royal Blue", hex: "#1f3b64" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
      ],
    },
    {
      label: "220 GSM – Cotton Piqué Polo",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Navy Blue", hex: "#22334d" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Black", hex: "#111111" },
      ],
    },
  ],
  "Custom Merchandise": [
    {
      label: "220 GSM – 100% Cotton Oversized",
      colors: [
        { name: "White", hex: "#f5f5f2" },
        { name: "Black", hex: "#0f1115" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
      ],
    },
    {
      label: "180 GSM – 100% Cotton Regular",
      colors: [
        { name: "White", hex: "#f7f7f2" },
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Maroon", hex: "#6d2c2c" },
        { name: "Yellow", hex: "#f2c94c" },
        { name: "Orange", hex: "#c96a17" },
        { name: "Red", hex: "#a52424" },
        { name: "Purple", hex: "#6b3fa0" },
      ],
    },
    {
      label: "320 GSM – PolyCotton Hoodie",
      colors: [
        { name: "Black", hex: "#111111" },
        { name: "Navy Blue", hex: "#20354d" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Maroon", hex: "#6d2c2c" },
      ],
    },
  ],
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: "Oversized T-Shirts",
    gsm: "",
    color: "",
    quantity: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colorOpen, setColorOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  // Close colour dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(e.target as Node)) {
        setColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const productsList = Object.keys(PRODUCT_GSM_MAP);

  // Derived options based on selected product
  const gsmOptions: GsmVariant[] = PRODUCT_GSM_MAP[formData.product] ?? [];

  // All unique colours across every GSM variant of the selected product
  const colorOptions: ColorOption[] = React.useMemo(() => {
    const seen = new Set<string>();
    const result: ColorOption[] = [];
    for (const variant of gsmOptions) {
      for (const c of variant.colors) {
        if (!seen.has(c.name)) {
          seen.add(c.name);
          result.push(c);
        }
      }
    }
    return result;
  }, [formData.product]);

  // Reset GSM and color when product changes
  useEffect(() => {
    const firstGsm = PRODUCT_GSM_MAP[formData.product]?.[0]?.label ?? "";
    setFormData((prev) => ({ ...prev, gsm: firstGsm, color: "" }));
  }, [formData.product]);

  // Listen to select-product events from other components
  useEffect(() => {
    const handleSelectProduct = (e: Event) => {
      const customEvent = e as CustomEvent<{ product: string; message?: string }>;
      if (customEvent.detail) {
        const newProduct = customEvent.detail.product;
        const firstGsm = PRODUCT_GSM_MAP[newProduct]?.[0]?.label ?? "";
        setFormData((prev) => ({
          ...prev,
          product: newProduct,
          gsm: firstGsm,
          color: "",
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

    const colorLine = formData.color ? `\nColour Preference: ${formData.color}` : "";
    const subject = encodeURIComponent(`Production Inquiry: ${formData.product} from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Company: ${formData.company}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Garment Category: ${formData.product}\n` +
      `GSM / Fabric: ${formData.gsm}` +
      colorLine +
      `\nTarget Quantity: ${formData.quantity}\n\n` +
      `Spec Details / Message:\n${formData.message}`
    );
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=vidhyashankar@cutnstitchapparel.com&su=${subject}&body=${body}`, "_blank");

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
    const colorText = formData.color ? `, Colour: ${formData.color}` : "";
    const text = encodeURIComponent(
      `Hi Cut n Stitch team, my name is ${formData.name || "[Name]"} from ${formData.company || "[Company]"}. We are looking to manufacture custom ${formData.product} (${formData.gsm}${colorText}, Target Qty: ${formData.quantity || "100"} pcs). Please connect us with a merchant.`
    );
    window.open(`https://wa.me/919944466311?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="scroll-mt-20 relative border-y border-border-custom/50 bg-card/25 py-8 sm:py-10 lg:py-12">
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
                Fill out the manufacturing inquiry form. Our merchandising desk will review your specifications and email a production timeline and price quotation within 8 business hours.
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

              {/* Direct Email Card */}
              <div
                onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=vidhyashankar@cutnstitchapparel.com", "_blank")}
                className="bg-background border border-border-custom p-6 rounded-2xl flex flex-col gap-3 cursor-pointer hover:border-accent-custom/40 transition-colors group"
              >
                <div className="p-3 bg-accent-custom/10 text-accent-custom rounded-xl w-fit group-hover:scale-105 transition-transform">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-foreground">Direct Email</h4>
                <p className="text-xs text-muted-custom">Send your tech packs and custom design patterns directly to sales.</p>
                <span className="text-[11px] font-bold text-accent-custom mt-2 block group-hover:translate-x-1 transition-transform">
                  Send Mail &rarr;
                </span>
              </div>
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
                  Thank you for contacting Cut <span className="text-white">n</span> Stitch Apparel. A dedicated merchant has been assigned to your project and will reach out to <strong>{formData.email}</strong> shortly.
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
                      gsm: PRODUCT_GSM_MAP["Oversized T-Shirts"][0].label,
                      color: "",
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
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"}`}
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
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${errors.company ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"}`}
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
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${errors.email ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"}`}
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
                      className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${errors.phone ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"}`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Garment Category */}
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
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* GSM + Color Row — dynamic per product */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formData.product}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {/* GSM Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="gsm" className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                        GSM / Fabric
                      </label>
                      <select
                        id="gsm"
                        name="gsm"
                        value={formData.gsm}
                        onChange={handleChange}
                        className="py-3 px-4 rounded-xl border bg-card/25 text-sm border-border-custom focus:border-accent-custom focus:bg-background focus:outline-none cursor-pointer"
                      >
                        {gsmOptions.map((g) => (
                          <option key={g.label} value={g.label}>{g.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Colour Custom Dropdown */}
                    <div className="flex flex-col gap-1.5" ref={colorDropdownRef}>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-custom">
                        Colour Preference
                      </label>
                      <div className="relative">
                        {/* Trigger button */}
                        <button
                          type="button"
                          onClick={() => setColorOpen((o) => !o)}
                          className="w-full flex items-center gap-2 py-3 px-4 rounded-xl border bg-card/25 text-sm border-border-custom hover:border-accent-custom focus:border-accent-custom focus:outline-none cursor-pointer transition-colors"
                        >
                          {formData.color ? (
                            <>
                              <span
                                className="w-4 h-4 rounded-full border border-border-custom/60 shrink-0"
                                style={{ backgroundColor: colorOptions.find((c) => c.name === formData.color)?.hex ?? "transparent" }}
                              />
                              <span className="flex-1 text-left">{formData.color}</span>
                            </>
                          ) : (
                            <span className="flex-1 text-left text-muted-custom">Select a colour…</span>
                          )}
                          <ChevronDown
                            size={14}
                            className={`text-muted-custom transition-transform duration-200 ${colorOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Dropdown panel */}
                        <AnimatePresence>
                          {colorOpen && (
                            <motion.ul
                              initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
                              animate={{ opacity: 1, y: 0, scaleY: 1 }}
                              exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
                              transition={{ duration: 0.15 }}
                              style={{ transformOrigin: "top" }}
                              className="absolute z-50 top-full mt-1 w-full rounded-xl border border-border-custom bg-background shadow-xl overflow-y-auto max-h-52"
                            >
                              {colorOptions.map((c) => (
                                <li key={c.name}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, color: c.name }));
                                      setColorOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-card/50 ${formData.color === c.name ? "bg-accent-custom/10 text-accent-custom font-semibold" : "text-foreground"
                                      }`}
                                  >
                                    <span
                                      className="w-4 h-4 rounded-full border border-border-custom/60 shrink-0"
                                      style={{ backgroundColor: c.hex }}
                                    />
                                    {c.name}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

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
                    className={`py-3 px-4 rounded-xl border bg-card/25 text-sm transition-colors focus:bg-background focus:outline-none ${errors.quantity ? "border-red-500/50 focus:border-red-500" : "border-border-custom focus:border-accent-custom"}`}
                  />
                  {errors.quantity && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={10} /> {errors.quantity}
                    </span>
                  )}
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
                    rows={3}
                    placeholder="Enter printing type, additional specs, custom patterns, or any other requirements..."
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
