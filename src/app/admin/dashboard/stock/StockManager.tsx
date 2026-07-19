"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Save, Check } from "lucide-react";
import type { ProductStock } from "@prisma/client";

export default function StockManager({ initialStock }: { initialStock: ProductStock[] }) {
    const [stockState, setStockState] = useState<ProductStock[]>(initialStock);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

    // Grouping logic
    // category -> variantName -> color
    const grouped = stockState.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = {};
        if (!acc[item.category][item.variantName]) acc[item.category][item.variantName] = [];
        acc[item.category][item.variantName].push(item);
        return acc;
    }, {} as Record<string, Record<string, ProductStock[]>>);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const toggleVariant = (catVarId: string) => {
        setExpandedVariants(prev => ({ ...prev, [catVarId]: !prev[catVarId] }));
    };

    const handleQuantityChange = (id: string, newQty: string) => {
        const parsed = parseInt(newQty, 10);
        const validQty = isNaN(parsed) ? 0 : parsed;

        setStockState(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: validQty } : item
        ));
    };

    const handleSave = async (item: ProductStock) => {
        setSavingId(item.id);
        try {
            const res = await fetch("/api/product-stock", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, quantity: item.quantity }),
            });
            if (res.ok) {
                setSavedId(item.id);
                setTimeout(() => setSavedId(null), 2000);
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {(Object.entries(grouped) as [string, Record<string, ProductStock[]>][]).map(([category, variants]) => {
                const isCatExpanded = expandedCategories[category];
                return (
                    <div key={category} className="rounded-2xl border border-neutral-800 bg-[#111] overflow-hidden">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="flex w-full items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors"
                        >
                            <h2 className="text-lg font-semibold text-white">{category}</h2>
                            {isCatExpanded ? <ChevronDown className="h-5 w-5 text-neutral-400" /> : <ChevronRight className="h-5 w-5 text-neutral-400" />}
                        </button>

                        {isCatExpanded && (
                            <div className="border-t border-neutral-800 pb-2">
                                {(Object.entries(variants) as [string, ProductStock[]][]).map(([variantName, items]) => {
                                    const catVarId = `${category}-${variantName}`;
                                    const isVarExpanded = expandedVariants[catVarId];
                                    return (
                                        <div key={variantName} className="border-b border-neutral-800/50 last:border-0">
                                            <button
                                                onClick={() => toggleVariant(catVarId)}
                                                className="flex w-full items-center justify-between px-6 py-3 hover:bg-neutral-800/30 transition-colors"
                                            >
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-medium text-neutral-200">{variantName}</span>
                                                    <span className="text-xs text-neutral-500">{items[0].fabric} • {items[0].gsm}</span>
                                                </div>
                                                {isVarExpanded ? <ChevronDown className="h-4 w-4 text-neutral-500" /> : <ChevronRight className="h-4 w-4 text-neutral-500" />}
                                            </button>

                                            {isVarExpanded && (
                                                <div className="bg-neutral-900/50 px-8 py-4">
                                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                        {items.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#111] p-3 shadow-sm">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="h-4 w-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: item.hex }} />
                                                                    <span className="text-sm text-neutral-300 font-medium">{item.color}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                        className="w-20 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-right text-sm text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleSave(item)}
                                                                        disabled={savingId === item.id}
                                                                        className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-50"
                                                                        title="Save"
                                                                    >
                                                                        {savedId === item.id ? (
                                                                            <Check className="h-4 w-4 text-emerald-500" />
                                                                        ) : (
                                                                            <Save className="h-4 w-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
