# Cut n Stitch — B2B Apparel Manufacturing Website

A production-grade Next.js 16 website for **Cut n Stitch Apparel**, a Tirupur-based B2B garment manufacturer. This site serves as the primary sales and inquiry portal for bulk clothing orders, corporate wear, and private-label manufacturing.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

> **Note:** The project folder is `c:\Projects\CutnStitch` — always `cd CutnStitch` (capital C, capital S) when navigating from `c:\Projects`.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Effects | canvas-confetti |
| Runtime | Node.js / React 19 |

---

## 📁 Full Folder Structure

```
CutnStitch/
│
├── public/                         # Static assets served at root
│   ├── images/
│   │   └── zed-silver.png          # ZED Silver MSME certification badge
│   └── *.svg                       # Next.js default SVGs
│
├── src/
│   │
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (ThemeProvider, fonts, metadata)
│   │   ├── page.tsx                # Homepage — assembles all sections in order
│   │   ├── globals.css             # Global CSS variables & base styles
│   │   │
│   │   ├── products/
│   │   │   ├── [category]/         # /products/regular-fit, /products/polo, etc.
│   │   │   │   ├── page.tsx        # Category listing page (variant cards)
│   │   │   │   └── [variant]/
│   │   │   │       └── page.tsx    # Individual variant detail page
│   │   │   └── details/
│   │   │       └── [slug]/
│   │   │           └── page.tsx    # Product detail page (overview + GSM table)
│   │   │
│   │   ├── live-stock/
│   │   │   └── page.tsx            # Live stock availability page
│   │   │
│   │   ├── admin/                  # Admin panel (internal use)
│   │   └── api/                    # Next.js API routes
│   │
│   ├── components/                 # All UI components (33 total)
│   │   │
│   │   ├── ── Homepage Sections ──
│   │   ├── Header.tsx              # Sticky nav bar with dark/light toggle & mobile menu
│   │   ├── Hero.tsx                # Full-screen hero with headline & CTA buttons
│   │   ├── StatisticsSection.tsx   # Animated counters (units produced, clients, etc.)
│   │   ├── About.tsx               # Company story, certifications
│   │   ├── IndustriesServed.tsx    # Industry segments (sports, corporate, merch, etc.)
│   │   ├── ProductCategories.tsx   # Product grid cards linking to /products/[category]
│   │   ├── ProcessTimeline.tsx     # Step-by-step manufacturing process
│   │   ├── WhyChooseUs.tsx         # USP cards (MOQ, turnaround, quality, etc.)
│   │   ├── Testimonials.tsx        # Client testimonials carousel
│   │   ├── FAQ.tsx                 # Accordion FAQ section
│   │   ├── Contact.tsx             # 🔑 Manufacturing inquiry form (see below)
│   │   ├── Footer.tsx              # 4-column footer with links, address, certifications
│   │   │
│   │   ├── ── Product Pages ──
│   │   ├── ProductCard.tsx         # Card used in category listing
│   │   ├── ProductCategories.tsx   # Homepage product grid
│   │   ├── ProductDetails.tsx      # Full product detail layout
│   │   ├── ProductGallery.tsx      # Image gallery with zoom
│   │   ├── ProductInfo.tsx         # GSM specs, fabric info, MOQ details
│   │   ├── RelatedProducts.tsx     # "You may also like" sidebar
│   │   ├── VariantCard.tsx         # Individual variant card (GSM + fabric label)
│   │   ├── VariantDetails.tsx      # Variant deep-dive with size chart
│   │   ├── VariantListing.tsx      # List of all variants in a category
│   │   │
│   │   ├── ── Shared / Utility ──
│   │   ├── CTASection.tsx          # "Inquire Now" + "Get Quote" button pair
│   │   ├── StickyCTA.tsx           # Sticky bottom bar with WhatsApp & Quote buttons
│   │   ├── SizeChartDropdown.tsx   # Collapsible size chart table (inches)
│   │   ├── SizeSelector.tsx        # Size pill selector UI
│   │   ├── ColourSelector.tsx      # Colour swatch picker component
│   │   ├── GarmentColorPreview.tsx # Live colour preview on garment silhouette
│   │   ├── TextileSimulation.tsx   # Fabric texture simulation display
│   │   ├── Customizer.tsx          # Interactive garment customizer
│   │   ├── Gallery.tsx             # Reusable image gallery
│   │   ├── PricingTable.tsx        # Tiered pricing table component
│   │   ├── FeatureCards.tsx        # Feature highlight cards
│   │   ├── LiveStockModal.tsx      # Modal for live stock details
│   │   └── LiveStockPage.tsx       # Full live stock page layout
│   │
│   ├── context/
│   │   └── ThemeContext.tsx        # Dark/light mode context & toggle logic
│   │
│   ├── data/
│   │   ├── products.ts             # 🔑 Master product catalog (all categories,
│   │   │                           #    variants, GSM, fabrics, colors, images,
│   │   │                           #    printing compatibility, MOQ)
│   │   ├── stock.ts                # Live stock quantities per variant/size
│   │   └── productStock.ts         # Stock helper types & lookup functions
│   │
│   └── lib/
│       ├── colorImagePreview.ts    # Maps colour names → preview image paths
│       ├── productImageMap.ts      # Maps variant slugs → product image files
│       └── image.ts                # Image utility helpers
│
├── scripts/                        # One-off utility scripts (data migration, fixes)
├── fix_poly.js                     # Removed Screen Printing from polyester variants
├── next.config.ts                  # Next.js config (image domains, etc.)
├── tailwind.config / postcss       # Tailwind & PostCSS configuration
├── tsconfig.json                   # TypeScript compiler options
├── package.json                    # Dependencies & npm scripts
└── .gitignore                      # Excludes node_modules, .next, .env, etc.
```

---

## 🔑 Key Component Deep Dives

### `Contact.tsx` — Manufacturing Inquiry Form
The most complex component. Features:
- **Dynamic product selection** — 8 garment categories
- **GSM / Fabric dropdown** — options change per selected product
- **Colour Preference dropdown** — custom dropdown with colour swatches, options aggregated from all GSM variants of the selected product
- **Form validation** — inline error messages for all required fields
- **Dual submit paths:**
  - "Submit Production Inquiry" → opens Gmail compose with pre-filled body
  - "Chat on WhatsApp" → opens WhatsApp with pre-filled message
- **Success state** — confetti animation + confirmation message
- **Event listener** — listens for `select-product` custom events fired from other components (e.g., product pages) to pre-fill the form

### `src/data/products.ts` — Master Product Catalog
The single source of truth for all product data:
- Categories: Regular Fit, Polo, Oversized, Shorts, Joggers, Corporate Wear, Uniforms, Custom Merchandise
- Each product has: name, slug, category, variants array
- Each variant has: GSM, fabric type, available colors, printing compatibility, MOQ, images

### `ThemeContext.tsx` — Dark / Light Mode
Provides `theme` state and `toggleTheme` function. Uses `localStorage` to persist preference. CSS variables in `globals.css` drive all color tokens.

---

## 🌐 URL Structure

| URL | Page |
|---|---|
| `/` | Homepage (all sections) |
| `/products/[category]` | Category listing (e.g. `/products/polo`) |
| `/products/[category]/[variant]` | Variant detail (e.g. `/products/polo/cotton-220gsm`) |
| `/products/details/[slug]` | Product overview page |
| `/live-stock` | Live stock availability |

---

## 📞 Contact Numbers
| Purpose | Number |
|---|---|
| WhatsApp inquiries (all buttons) | +91 99444 66311 |
| Phone (footer) | +91 99444 66311 |
| Email | mahimaintl2009@gmail.com |

---

## 🏭 Business Details
| Field | Value |
|---|---|
| Company | Cut n Stitch Apparel (Mahima International) |
| Location | Tirupur, Tamil Nadu – 641652 |
| GSTIN | 33DDLPD5075B2ZV |
| Certification | ZED Silver MSME |
| MOQ | 100 pieces per style |

---

## 🔄 Development Workflow

### Making Code Changes
1. Edit files in `src/components/`, `src/data/`, or `src/app/`
2. Dev server auto-reloads at `http://localhost:3000`
3. Ask to commit and push when changes are ready

### Committing & Pushing
```bash
# Stage all changes
git add -A

# Commit with a descriptive message
git commit -m "your message here"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

### Branching Convention
Branches are named numerically (e.g. `thirtyone`, `thirtytwo`) — each branch corresponds to a feature batch.

### Deployment
- Hosted on **Vercel**, auto-deploys on push to `main`
- GitHub repo: `https://github.com/arshithk/cutnstitchh`

---

## 🎨 Design Tokens (CSS Variables)

Defined in `globals.css` and toggled by the theme system:

| Variable | Purpose |
|---|---|
| `--accent-custom` | Gold/amber brand colour |
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card surface |
| `--border-custom` | Border colour |
| `--muted-custom` | Secondary text |
| `--primary-custom` | Primary button background |

---

## 📦 Build & Deployment Notes

- Run `npm run build` before deploying to catch TypeScript/lint errors
- The build generates **55 static pages** (SSG via `generateStaticParams`)
- `.next/` folder is git-ignored — never commit it
- `node_modules/` is git-ignored — run `npm install` on fresh clone
