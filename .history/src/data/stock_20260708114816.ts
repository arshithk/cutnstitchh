export interface StockColorVariant {
  color: string;
  hex: string;
  quantity: number;
}

export interface StockEntry {
  slug: string;
  productName: string;
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: StockColorVariant[];
}

export const stockEntries: StockEntry[] = [
  {
    slug: "oversized-t-shirts",
    productName: "Oversized T-Shirts",
    fabric: "100% Cotton",
    gsmRange: "220-280 GSM",
    lastUpdated: "Today, 10:45 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#0f1115", quantity: 482 },
      { color: "White", hex: "#f5f5f2", quantity: 315 },
      { color: "Navy", hex: "#20354d", quantity: 210 },
      { color: "Olive", hex: "#6b7140", quantity: 127 },
      { color: "Grey", hex: "#6b7280", quantity: 58 },
    ],
  },
  {
    slug: "regular-fit-t-shirts",
    productName: "Regular Fit T-Shirts",
    fabric: "100% Cotton",
    gsmRange: "180-200 GSM",
    lastUpdated: "Today, 11:10 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 394 },
      { color: "White", hex: "#f7f7f2", quantity: 268 },
      { color: "Charcoal", hex: "#4a4a4a", quantity: 176 },
      { color: "Mint", hex: "#7db89a", quantity: 92 },
    ],
  },
  {
    slug: "polo-t-shirts",
    productName: "Polo T-Shirts",
    fabric: "Pique Cotton",
    gsmRange: "220-240 GSM",
    lastUpdated: "Today, 09:35 AM",
    availableForBulk: true,
    colors: [
      { color: "Navy", hex: "#22334d", quantity: 241 },
      { color: "White", hex: "#f5f5f2", quantity: 198 },
      { color: "Black", hex: "#111111", quantity: 154 },
      { color: "Olive", hex: "#6e7140", quantity: 81 },
    ],
  },
  {
    slug: "hoodies",
    productName: "Hoodies",
    fabric: "Fleece / Terry",
    gsmRange: "320-400 GSM",
    lastUpdated: "Today, 08:50 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 312 },
      { color: "Grey", hex: "#6b7280", quantity: 224 },
      { color: "Maroon", hex: "#6d2c2c", quantity: 143 },
      { color: "Olive", hex: "#5f6d35", quantity: 97 },
    ],
  },
  {
    slug: "sweatshirts",
    productName: "Sweatshirts",
    fabric: "French Terry",
    gsmRange: "280-340 GSM",
    lastUpdated: "Today, 12:20 PM",
    availableForBulk: true,
    colors: [
      { color: "Cream", hex: "#e8d8c2", quantity: 188 },
      { color: "Black", hex: "#111111", quantity: 172 },
      { color: "Sand", hex: "#c2a37c", quantity: 116 },
      { color: "Navy", hex: "#22334d", quantity: 88 },
    ],
  },
  {
    slug: "tracksuits",
    productName: "Tracksuits",
    fabric: "Polyester Blend",
    gsmRange: "260-320 GSM",
    lastUpdated: "Today, 01:15 PM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 221 },
      { color: "Grey", hex: "#6b7280", quantity: 164 },
      { color: "Navy", hex: "#22334d", quantity: 142 },
      { color: "Wine", hex: "#5b2338", quantity: 63 },
    ],
  },
];

export function getStockStatus(quantity: number) {
  if (quantity >= 250) return "In Stock";
  if (quantity >= 100) return "Low Stock";
  return "Out of Stock";
}
