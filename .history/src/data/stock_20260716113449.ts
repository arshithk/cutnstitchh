export interface StockColorVariant {
  color: string;
  hex: string;
  quantity: number;
}

export interface StockEntry {
  slug: string;
  productName: string;
  productType: string; // e.g., "T-Shirt", "Polo", "Hoodie"
  fabric: string;
  gsmRange: string;
  lastUpdated: string;
  availableForBulk: boolean;
  colors: StockColorVariant[];
}

export const stockEntries: StockEntry[] = [
  // T-Shirts
  {
    slug: "oversized-t-shirts-cotton-220",
    productType: "Oversized T-Shirt",
    productName: "Oversized T-Shirt - 100% Cotton 220 GSM",
    fabric: "100% Cotton",
    gsmRange: "220 GSM",
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
    slug: "oversized-t-shirts-cotton-250",
    productType: "Oversized T-Shirt",
    productName: "Oversized T-Shirt - 100% Cotton 250 GSM",
    fabric: "100% Cotton",
    gsmRange: "250 GSM",
    lastUpdated: "Today, 10:30 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#0f1115", quantity: 245 },
      { color: "White", hex: "#f5f5f2", quantity: 189 },
      { color: "Charcoal", hex: "#4a4a4a", quantity: 156 },
    ],
  },
  {
    slug: "regular-fit-t-shirts-cotton-180",
    productType: "Regular Fit T-Shirt",
    productName: "Regular Fit T-Shirt - 100% Cotton 180 GSM",
    fabric: "100% Cotton",
    gsmRange: "180 GSM",
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
    slug: "regular-fit-t-shirts-polycotton-180",
    productType: "Regular Fit T-Shirt",
    productName: "Regular Fit T-Shirt - PolyCotton 180 GSM",
    fabric: "PolyCotton Blend",
    gsmRange: "180 GSM",
    lastUpdated: "Today, 11:05 AM",
    availableForBulk: true,
    colors: [
      { color: "White", hex: "#f7f7f2", quantity: 421 },
      { color: "Grey", hex: "#6b7280", quantity: 305 },
      { color: "Maroon", hex: "#6d2c2c", quantity: 178 },
      { color: "Navy", hex: "#20354d", quantity: 156 },
    ],
  },

  // Polos
  {
    slug: "polo-t-shirts-pique-220",
    productType: "Polo Shirt",
    productName: "Polo Shirt - Pique Cotton 220 GSM",
    fabric: "Pique Cotton",
    gsmRange: "220 GSM",
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
    slug: "polo-t-shirts-cotton-240",
    productType: "Polo Shirt",
    productName: "Polo Shirt - 100% Cotton 240 GSM",
    fabric: "100% Cotton",
    gsmRange: "240 GSM",
    lastUpdated: "Today, 09:20 AM",
    availableForBulk: true,
    colors: [
      { color: "Navy", hex: "#22334d", quantity: 189 },
      { color: "White", hex: "#f5f5f2", quantity: 267 },
      { color: "Black", hex: "#111111", quantity: 201 },
    ],
  },

  // Hoodies & Sweatshirts
  {
    slug: "hoodies-cotton-fleece-300",
    productType: "Hoodie",
    productName: "Hoodie - Cotton Fleece 300 GSM",
    fabric: "80% Cotton 20% Polyester Fleece",
    gsmRange: "300 GSM",
    lastUpdated: "Today, 08:50 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#0f1115", quantity: 158 },
      { color: "Navy", hex: "#20354d", quantity: 134 },
      { color: "Grey", hex: "#6b7280", quantity: 89 },
      { color: "White", hex: "#f5f5f2", quantity: 56 },
    ],
  },
  {
    slug: "sweatshirts-cotton-280",
    productType: "Sweatshirt",
    productName: "Sweatshirt - 100% Cotton 280 GSM",
    fabric: "100% Cotton",
    gsmRange: "280 GSM",
    lastUpdated: "Today, 08:40 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 267 },
      { color: "Grey", hex: "#6b7280", quantity: 198 },
      { color: "Navy", hex: "#20354d", quantity: 142 },
    ],
  },

  // Tank Tops
  {
    slug: "tank-tops-cotton-160",
    productType: "Tank Top",
    productName: "Tank Top - 100% Cotton 160 GSM",
    fabric: "100% Cotton",
    gsmRange: "160 GSM",
    lastUpdated: "Today, 12:15 PM",
    availableForBulk: true,
    colors: [
      { color: "White", hex: "#f5f5f2", quantity: 512 },
      { color: "Black", hex: "#111111", quantity: 398 },
      { color: "Navy", hex: "#20354d", quantity: 276 },
      { color: "Red", hex: "#dc2626", quantity: 164 },
    ],
  },

  // Joggers & Shorts
  {
    slug: "joggers-cotton-320",
    productType: "Jogger",
    productName: "Jogger - 100% Cotton 320 GSM",
    fabric: "100% Cotton",
    gsmRange: "320 GSM",
    lastUpdated: "Today, 07:30 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 201 },
      { color: "Grey", hex: "#6b7280", quantity: 178 },
      { color: "Navy", hex: "#20354d", quantity: 145 },
    ],
  },
  {
    slug: "shorts-cotton-200",
    productType: "Shorts",
    productName: "Shorts - 100% Cotton 200 GSM",
    fabric: "100% Cotton",
    gsmRange: "200 GSM",
    lastUpdated: "Today, 07:15 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 345 },
      { color: "Khaki", hex: "#c9a964", quantity: 289 },
      { color: "Navy", hex: "#20354d", quantity: 223 },
      { color: "Grey", hex: "#6b7280", quantity: 167 },
    ],
  },

  // Jackets
  {
    slug: "windbreaker-polyester-250",
    productType: "Windbreaker",
    productName: "Windbreaker - 100% Polyester 250 GSM",
    fabric: "100% Polyester",
    gsmRange: "250 GSM",
    lastUpdated: "Today, 06:45 AM",
    availableForBulk: true,
    colors: [
      { color: "Black", hex: "#111111", quantity: 134 },
      { color: "Navy", hex: "#20354d", quantity: 98 },
      { color: "Red", hex: "#dc2626", quantity: 76 },
    ],
  },
];

export function getStockStatus(quantity: number) {
  if (quantity >= 250) return "In Stock";
  if (quantity >= 100) return "Low Stock";
  return "Out of Stock";
}
