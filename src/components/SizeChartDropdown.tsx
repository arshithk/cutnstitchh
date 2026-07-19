"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sizeCharts: Record<string, { metrics: string[]; sizes: string[]; data: number[][] }> = {
    "Regular Fit T-Shirt": {
        metrics: ["½ Chest", "Body Length"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [18, 19, 20, 21, 22, 23],
            [25, 26, 27, 28, 29, 30],
        ],
    },
    "Polo T-Shirt": {
        metrics: ["½ Chest", "Body Length"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [18, 19, 20, 21, 22, 23],
            [25, 26, 27, 28, 29, 30],
        ],
    },
    "Oversized T-Shirt": {
        metrics: ["½ Chest", "Body Length"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [20, 21, 22, 23, 24, 25],
            [26, 27, 28, 29, 30, 31],
        ],
    },
    "Hoodie": {
        metrics: ["½ Chest", "Body Length"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [19, 20, 21, 22, 23, 24],
            [26, 27, 28, 29, 30, 31],
        ],
    },
    "Sweatshirt": {
        metrics: ["½ Chest", "Body Length"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [19, 20, 21, 22, 23, 24],
            [26, 27, 28, 29, 30, 31],
        ],
    },
    "Joggers": {
        metrics: ["Waist", "Outseam"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [28, 30, 32, 34, 36, 38],
            [38, 39, 40, 41, 42, 43],
        ],
    },
    "Shorts": {
        metrics: ["Waist", "Outseam"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        data: [
            [28, 30, 32, 34, 36, 38],
            [18, 19, 20, 21, 22, 23],
        ],
    },
};

// Aliases for categories to map to our keys above
const categoryMap: Record<string, string> = {
    "Regular Fit T-Shirts": "Regular Fit T-Shirt",
    "Polo T-Shirts": "Polo T-Shirt",
    "Oversized T-Shirts": "Oversized T-Shirt",
    "Hoodies": "Hoodie",
    "Sweatshirts": "Sweatshirt",
    "Joggers": "Joggers",
    "Shorts": "Shorts",
};

interface SizeChartDropdownProps {
    categoryName: string;
}

export default function SizeChartDropdown({ categoryName }: SizeChartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Default to something if not found, but it should be found based on exact map
    const chartKey = categoryMap[categoryName] || categoryName;
    const chartData = sizeCharts[chartKey] || sizeCharts["Regular Fit T-Shirt"]; // Fallback

    return (
        <div className="mt-4 rounded-xl border border-border-custom/50 bg-background/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-white/5 transition-colors"
            >
                <span className="flex items-center gap-2 text-foreground">
                    <Ruler size={16} className="text-accent-custom" />
                    Size Chart (Inches)
                </span>
                {isOpen ? <ChevronUp size={16} className="text-muted-custom" /> : <ChevronDown size={16} className="text-muted-custom" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 pt-0 border-t border-border-custom/30 text-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr>
                                            <th className="p-2 font-semibold text-muted-custom border-b border-border-custom/20">Metric</th>
                                            {chartData.sizes.map((size) => (
                                                <th key={size} className="p-2 font-semibold text-center text-accent-custom border-b border-border-custom/20">
                                                    {size}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData.metrics.map((metric, idx) => (
                                            <tr key={metric} className="group hover:bg-white/5 transition-colors">
                                                <td className="p-2 font-medium text-foreground text-left">{metric}</td>
                                                {chartData.data[idx].map((val, vIdx) => (
                                                    <td key={vIdx} className="p-2 text-center text-muted-custom group-hover:text-foreground transition-colors">
                                                        {val}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
