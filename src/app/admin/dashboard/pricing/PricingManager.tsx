"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Save, Check } from "lucide-react";
import type { ProductPricing } from "@prisma/client";

export default function PricingManager({ initialPricing }: { initialPricing: ProductPricing[] }) {
    const [pricingState, setPricingState] = useState<ProductPricing[]>(initialPricing);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // Grouping logic: category -> pricing items
    const grouped = pricingState.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ProductPricing[]>);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const handlePriceChange = (id: string, field: keyof ProductPricing, newPrice: string) => {
        const parsed = parseFloat(newPrice);
        const validPrice = isNaN(parsed) ? 0 : parsed;

        setPricingState(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: validPrice } : item
        ));
    };

    const handleSave = async (item: ProductPricing) => {
        setSavingId(item.id);
        try {
            const res = await fetch("/api/product-pricing", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: item.id,
                    price_100_999: item.price_100_999,
                    price_1000_4999: item.price_1000_4999,
                    price_5000_plus: item.price_5000_plus,
                }),
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
            {(Object.entries(grouped) as [string, ProductPricing[]][]).map(([category, items]) => {
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
                            <div className="border-t border-neutral-800 divide-y divide-neutral-800/50 bg-neutral-900/30">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col xl:flex-row xl:items-center justify-between px-6 py-4 gap-4">
                                        <div className="flex flex-col mb-2 xl:mb-0 min-w-48">
                                            <span className="text-sm font-medium text-neutral-200">{item.variantName}</span>
                                            <span className="text-xs text-neutral-500 mt-1">{item.fabric} • {item.gsm}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 self-start xl:self-center">
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-xs text-neutral-400">100-999</span>
                                                <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2 w-28 transition-all">
                                                    <span className="text-neutral-500 text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        value={item.price_100_999}
                                                        onChange={(e) => handlePriceChange(item.id, 'price_100_999', e.target.value)}
                                                        className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-xs text-neutral-400">1000-4999</span>
                                                <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2 w-28 transition-all">
                                                    <span className="text-neutral-500 text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        value={item.price_1000_4999}
                                                        onChange={(e) => handlePriceChange(item.id, 'price_1000_4999', e.target.value)}
                                                        className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-xs text-neutral-400">5000+</span>
                                                <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg focus-within:border-[#D4AF37] px-2 w-28 transition-all">
                                                    <span className="text-neutral-500 text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        value={item.price_5000_plus}
                                                        onChange={(e) => handlePriceChange(item.id, 'price_5000_plus', e.target.value)}
                                                        className="w-full bg-transparent py-1.5 text-right text-sm text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleSave(item)}
                                            disabled={savingId === item.id}
                                            className="self-end xl:self-center flex items-center justify-center h-10 w-24 shrink-0 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-50 mt-2 xl:mt-0"
                                            title="Save Price"
                                        >
                                            {savedId === item.id ? (
                                                <span className="text-sm font-medium flex gap-1 items-center"><Check className="h-4 w-4 text-emerald-500" /> Saved</span>
                                            ) : (
                                                <span className="text-sm font-medium flex gap-1 items-center"><Save className="h-4 w-4" /> Save</span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

