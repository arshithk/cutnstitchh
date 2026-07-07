export interface StockItem {
  color: string;
  hex: string;
  quantity: number;
}

export interface ProductStock {
  productName: string;
  lastUpdated: string;
  items: StockItem[];
}

export const productStockData: Record<string, ProductStock> = {
  "Oversized T-Shirts": {
    productName: "Oversized T-Shirts",
    lastUpdated: "Today, 10:45 AM",
    items: [
      { color: "Black", hex: "#111111", quantity: 482 },
      { color: "White", hex: "#F5F5F5", quantity: 315 },
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 210 },
      { color: "Olive", hex: "#6B7A3C", quantity: 127 },
      { color: "Red", hex: "#B33A3A", quantity: 58 },
    ],
  },
  "Regular Fit T-Shirts": {
    productName: "Regular Fit T-Shirts",
    lastUpdated: "Today, 11:10 AM",
    items: [
      { color: "Black", hex: "#111111", quantity: 394 },
      { color: "White", hex: "#F5F5F5", quantity: 268 },
      { color: "Charcoal", hex: "#4A4A4A", quantity: 176 },
      { color: "Mint", hex: "#7DBE9A", quantity: 92 },
    ],
  },
  "Polo T-Shirts": {
    productName: "Polo T-Shirts",
    lastUpdated: "Today, 09:35 AM",
    items: [
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 241 },
      { color: "White", hex: "#F5F5F5", quantity: 198 },
      { color: "Black", hex: "#111111", quantity: 154 },
      { color: "Olive", hex: "#6B7A3C", quantity: 81 },
    ],
  },
  Hoodies: {
    productName: "Hoodies",
    lastUpdated: "Today, 08:50 AM",
    items: [
      { color: "Black", hex: "#111111", quantity: 312 },
      { color: "Grey", hex: "#6E7280", quantity: 224 },
      { color: "Maroon", hex: "#6D2C2C", quantity: 143 },
      { color: "Army Green", hex: "#4E5E2C", quantity: 97 },
    ],
  },
  Sweatshirts: {
    productName: "Sweatshirts",
    lastUpdated: "Today, 12:20 PM",
    items: [
      { color: "Cream", hex: "#E7D8C1", quantity: 188 },
      { color: "Black", hex: "#111111", quantity: 172 },
      { color: "Sand", hex: "#C2A37C", quantity: 116 },
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 88 },
    ],
  },
  Tracksuits: {
    productName: "Tracksuits",
    lastUpdated: "Today, 01:15 PM",
    items: [
      { color: "Black", hex: "#111111", quantity: 221 },
      { color: "Grey", hex: "#6E7280", quantity: 164 },
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 142 },
      { color: "Wine", hex: "#5B2338", quantity: 63 },
    ],
  },
  Shorts: {
    productName: "Shorts",
    lastUpdated: "Today, 02:05 PM",
    items: [
      { color: "Black", hex: "#111111", quantity: 205 },
      { color: "Khaki", hex: "#BDA46E", quantity: 136 },
      { color: "Olive", hex: "#6B7A3C", quantity: 92 },
      { color: "White", hex: "#F5F5F5", quantity: 74 },
    ],
  },
  Joggers: {
    productName: "Joggers",
    lastUpdated: "Today, 03:40 PM",
    items: [
      { color: "Black", hex: "#111111", quantity: 278 },
      { color: "Grey", hex: "#6E7280", quantity: 192 },
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 138 },
      { color: "Olive", hex: "#6B7A3C", quantity: 85 },
    ],
  },
  "Tank Tops": {
    productName: "Tank Tops",
    lastUpdated: "Today, 04:25 PM",
    items: [
      { color: "Black", hex: "#111111", quantity: 176 },
      { color: "White", hex: "#F5F5F5", quantity: 142 },
      { color: "Olive", hex: "#6B7A3C", quantity: 98 },
      { color: "Maroon", hex: "#6D2C2C", quantity: 61 },
    ],
  },
  "Corporate Wear": {
    productName: "Corporate Wear",
    lastUpdated: "Today, 05:10 PM",
    items: [
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 310 },
      { color: "White", hex: "#F5F5F5", quantity: 234 },
      { color: "Grey", hex: "#6E7280", quantity: 168 },
      { color: "Black", hex: "#111111", quantity: 123 },
    ],
  },
  Uniforms: {
    productName: "Uniforms",
    lastUpdated: "Today, 06:00 PM",
    items: [
      { color: "Navy Blue", hex: "#1E3A5F", quantity: 438 },
      { color: "Black", hex: "#111111", quantity: 251 },
      { color: "Grey", hex: "#6E7280", quantity: 165 },
      { color: "Olive", hex: "#6B7A3C", quantity: 97 },
    ],
  },
  "Custom Merchandise": {
    productName: "Custom Merchandise",
    lastUpdated: "Today, 06:40 PM",
    items: [
      { color: "Black", hex: "#111111", quantity: 189 },
      { color: "White", hex: "#F5F5F5", quantity: 141 },
      { color: "Red", hex: "#B33A3A", quantity: 83 },
      { color: "Royal Blue", hex: "#2858A7", quantity: 67 },
    ],
  },
};
