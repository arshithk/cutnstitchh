"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { ProductStock } from "../data/productStock";

interface LiveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: ProductStock | null;
}

export function LiveStockModal({ isOpen, onClose, stock }: LiveStockModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && stock ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm dark:bg-slate-950/85"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-7 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-[#D4AF37]/40 dark:hover:text-[#F6D56A]"
              aria-label="Close stock view"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C8A64A] dark:text-[#F6D56A]">
                  Live Stock
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  {stock.productName}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-300">
                  Updated {stock.lastUpdated}. Stock is refreshed in near real time for premium production planning.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {stock.items.map((item) => (
                  <div
                    key={item.color}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700"
                        style={{ backgroundColor: item.hex }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.color}</p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-400">Ready for dispatch</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#8A6A1F] dark:text-[#F6D56A]">
                      {item.quantity} pcs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
