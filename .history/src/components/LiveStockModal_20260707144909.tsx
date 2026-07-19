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
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f1114] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-muted-custom transition hover:border-accent-custom/50 hover:text-accent-custom"
              aria-label="Close stock view"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-accent-custom/80">
                  Live Stock
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">
                  {stock.productName}
                </h3>
                <p className="mt-2 text-sm text-muted-custom">
                  Updated {stock.lastUpdated}. Stock is refreshed in near real time for premium production planning.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {stock.items.map((item) => (
                  <div
                    key={item.color}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ backgroundColor: item.hex }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.color}</p>
                        <p className="text-xs text-muted-custom">Ready for dispatch</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-accent-custom">
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
