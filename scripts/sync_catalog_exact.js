const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mongoose = require('mongoose');

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const text = fs.readFileSync(envPath, 'utf8');
  const lines = text.split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    const v = trimmed.slice(eq + 1).trim();
    out[k] = v;
  }
  return out;
}

// Copy of helper logic from src/data/products.ts (simplified to run standalone)
const STANDARD_PRODUCT_PRICING = [
  { min: 100, max: 999, price: 175 },
  { min: 1000, max: 5000, price: 173 },
  { min: 5001, price: 170 },
];

function enrichDescription(text, fabric, extraKeywords) {
  const base = (text || '').toString().trim();
  if (!base) return base;
  if (base.includes('Made in India') || base.includes('DTF Printing')) return base;
  const kws = new Set();
  kws.add('DTF Printing');
  if (fabric) {
    const f = fabric.toLowerCase();
    if (f.includes('cotton')) kws.add('DTG Printing (Cotton only)');
    if (f.includes('polyester')) kws.add('Sublimation (Polyester only)');
  }
  kws.add('Screen Printing');
  (extraKeywords || []).forEach((k) => kws.add(k));
  const keywordsString = Array.from(kws).join(', ');
  return `${base} ${keywordsString}. Made in India.`;
}

function parseGsmValue(gsmRange) {
  if (!gsmRange) return Number.MAX_SAFE_INTEGER;
  const match = gsmRange.toString().match(/(\d{2,3})/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number.parseInt(match[1], 10);
}

function getFabricPriority(fabric) {
  const normalized = (fabric || '').toLowerCase();
  if (normalized.includes('polycotton') || normalized.includes('poly cotton') || normalized.includes('poly-cotton')) return 1;
  if (normalized.includes('cotton') || normalized.includes('jersey')) return 0;
  if (normalized.includes('polyester')) return 2;
  if (normalized.includes('dri fit')) return 3;
  if (normalized.includes('blend')) return 4;
  return 5;
}

function sortVariantsByFabricAndGsm(variants) {
  if (!Array.isArray(variants)) return variants || [];
  return variants.slice().sort((a, b) => {
    const fabricA = getFabricPriority(a.fabric || '');
    const fabricB = getFabricPriority(b.fabric || '');
    if (fabricA !== fabricB) return fabricA - fabricB;
    const gsmA = parseGsmValue(a.gsmRange || a.gsm);
    const gsmB = parseGsmValue(b.gsmRange || b.gsm);
    if (gsmA !== gsmB) return gsmA - gsmB;
    return (a.name || '').localeCompare(b.name || '');
  });
}

function getPaletteForContext(context) {
  const category = ((context && (context.categorySlug || context.productSlug)) || '').toLowerCase();
  if (category.includes('shorts') || category.includes('joggers')) {
    return [
      { name: 'Bottle Green', hex: '#3f6b3f' },
      { name: 'Black', hex: '#111111' },
      { name: 'Air Force Blue', hex: '#5d8aa8' },
      { name: 'Navy Blue', hex: '#20354d' },
      { name: 'Dark Grey', hex: '#4b5563' },
      { name: 'Maroon', hex: '#6d2c2c' },
      { name: 'Olive', hex: '#6b6e2d' },
    ];
  }
  return [
    { name: 'White', hex: '#f7f7f2' },
    { name: 'Black', hex: '#111111' },
    { name: 'Navy Blue', hex: '#20354d' },
    { name: 'Royal Blue', hex: '#1f3b64' },
    { name: 'Maroon', hex: '#6d2c2c' },
    { name: 'Orange', hex: '#c96a17' },
    { name: 'Red', hex: '#a52424' },
    { name: 'Brown', hex: '#6f4b2f' },
    { name: 'Grey', hex: '#6b7280' },
    { name: 'Yellow', hex: '#f2c94c' },
    { name: 'Golden Yellow', hex: '#b88c12' },
    { name: 'Purple', hex: '#6b3fa0' },
  ];
}

function buildAvailableColors(colors, fallbackImagePath, context) {
  const palette = getPaletteForContext(context);
  const paletteNames = new Set(palette.map((c) => c.name));
  let baseColors;
  if (colors && colors.length > 0) {
    // prefer palette-consistent colors
    const filtered = colors.filter((c) => paletteNames.has(c.name));
    baseColors = filtered.length ? filtered : palette;
  } else {
    baseColors = palette;
  }
  return baseColors.map((color) => ({
    name: color.name,
    hex: color.hex || color.hex,
    imagePath: color.imagePath || fallbackImagePath,
  }));
}

function generatePrintingCompatibility(fabric, name) {
  const f = (fabric || '').toLowerCase();
  if (f.includes('cotton')) return 'Screen Printing, DTF Printing, DTG Printing, Heat Transfer Printing';
  if (f.includes('polycotton')) return 'Screen Printing, DTF Printing, Heat Transfer Printing';
  if (f.includes('polyester') || f.includes('pique') || f.includes('dri fit') || f.includes('mars')) return 'Screen Printing, DTF Printing, Heat Transfer Printing, Sublimation Printing (White garments only)';
  return 'Screen Printing, DTF Printing, Heat Transfer Printing';
}

function generateEmbroideryCompatibility(fabric) {
  const f = (fabric || '').toLowerCase();
  if (f.includes('polycotton')) return 'The polycotton blend offers reliable embroidery performance with sharp logo definition and excellent durability.';
  if (f.includes('polyester') || f.includes('pique') || f.includes('lycra') || f.includes('dri fit')) return 'Compatible with professional embroidery, providing clean stitching, excellent logo clarity, and durable branding.';
  if (f.includes('french terry') || f.includes('fleece') || f.includes('cotton')) return 'Premium cotton fabric delivers excellent stitch definition, clean logo detailing, and long-lasting embroidery performance.';
  return 'Premium cotton fabric delivers excellent stitch definition, clean logo detailing, and long-lasting embroidery performance.';
}

function generateProductDescription(variant, product) {
  const fabric = (variant.fabric || product.fabric || '').toString();
  const gsm = (variant.gsm || variant.gsmRange || product.gsmRange || '').toString();
  const fit = (variant.fit || product.fit || '').toString();
  const type = product.name || product.tagline || 'Product';
  const features = [];
  const f = fabric.toLowerCase();
  if (f.includes('cotton')) features.push('premium cotton', 'soft hand feel', 'breathable', 'durable');
  if (f.includes('polycotton')) features.push('soft', 'durable', 'reduced shrinkage', 'shape retention');
  if (f.includes('polyester') && !f.includes('pique')) features.push('lightweight', 'moisture wicking', 'quick dry', 'durable');
  if (f.includes('pique')) features.push('structured knit', 'breathable', 'polished finish');
  if (f.includes('french terry')) features.push('premium comfort', 'soft loop knit interior', 'breathable');
  if (f.includes('fleece')) features.push('warm', 'soft brushed interior', 'comfortable');
  if (f.includes('lycra') || f.includes('stretch')) features.push('stretch', 'flexible movement', 'athletic performance');
  if (f.includes('dri fit') || f.includes('dri-fit') || f.includes('mars')) features.push('moisture management', 'sweat wicking', 'quick dry', 'performance wear');
  const unique = Array.from(new Set(features));
  const featureSentence = unique.length ? `${unique.slice(0, 4).join(', ')}` : 'premium construction';
  const name = (product.name || '').toString().toLowerCase();
  const uses = [];
  if (name.includes('polo') || name.includes('corporate') || name.includes('uniform')) uses.push('corporate uniforms', 'hospitality uniforms', 'team wear');
  else if (name.includes('hoodie') || name.includes('sweatshirt') || name.includes('joggers') || name.includes('shorts')) uses.push('team wear', 'sportswear', 'loungewear');
  else if (name.includes('t-shirt') || name.includes('tshirts') || name.includes('t shirts') || name.includes('regular') || name.includes('oversized')) uses.push('promotional apparel', 'event merchandise', 'corporate uniforms');
  else uses.push('promotional apparel', 'team wear');
  const usageSentence = `Ideal for ${uses.slice(0, 3).join(', ')} where consistent quality and finish matter.`;
  const desc = `A ${gsm} ${fabric} ${fit ? `${fit.toLowerCase()} ` : ''}${product.name || 'garment'} offering ${featureSentence}. ${usageSentence} Proudly Made in India.`;
  return desc.replace(/\s+/g, ' ').trim();
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const env = readEnvFile(path.join(repoRoot, '.env.local'));
  const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local or env');
    process.exit(1);
  }

  const productsFile = path.join(repoRoot, 'src', 'data', 'products.ts');
  const text = fs.readFileSync(productsFile, 'utf8');

  const marker = 'const baseProducts';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.error('Could not find baseProducts in products.ts');
    process.exit(1);
  }

  const eqIdx = text.indexOf('=', idx);
  const arrStart = text.indexOf('[', eqIdx);
  if (arrStart === -1) {
    console.error('Could not find array start for baseProducts');
    process.exit(1);
  }

  let pos = arrStart;
  let depth = 0;
  let endPos = -1;
  while (pos < text.length) {
    const ch = text[pos];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) { endPos = pos; break; }
    }
    pos++;
  }
  if (endPos === -1) {
    console.error('Could not find end of baseProducts array literal');
    process.exit(1);
  }

  const arrayLiteral = text.slice(arrStart, endPos + 1);

  // Evaluate baseProducts in a sandbox
  const sandbox = {};
  try {
    const script = new vm.Script('result = ' + arrayLiteral);
    const ctx = vm.createContext(sandbox);
    script.runInContext(ctx, { timeout: 2000 });
    const baseProducts = sandbox.result;
    if (!Array.isArray(baseProducts)) {
      console.error('Parsed baseProducts is not an array');
      process.exit(1);
    }

    // Build products (apply enrichments similar to src/data/products.ts)
    const products = baseProducts.map((product) => {
      const enrichedProduct = {
        ...product,
        description: enrichDescription(product.description, product.fabric),
        variants: (product.variants || []).map((variant) => ({
          ...variant,
          description: enrichDescription(variant.description, variant.fabric),
          printingCompatibility: generatePrintingCompatibility(variant.fabric, variant.name),
          embroideryCompatibility: generateEmbroideryCompatibility(variant.fabric),
          productDescription: generateProductDescription(variant, product),
        })),
      };

      const sortedVariants = sortVariantsByFabricAndGsm(enrichedProduct.variants);

      if (!product.colors || product.colors.length === 0) {
        return {
          ...enrichedProduct,
          variants: sortedVariants,
        };
      }

      return {
        ...enrichedProduct,
        colors: buildAvailableColors(product.colors, product.colors[0] && product.colors[0].imagePath ? product.colors[0].imagePath : product.heroImage, {
          categorySlug: product.slug,
          productSlug: product.slug,
          productName: product.name,
          fabric: product.fabric,
          gsmRange: product.gsmRange,
        }),
        variants: (sortedVariants || []).map((variant) => ({
          ...variant,
          colors: buildAvailableColors(variant.colors || [], variant.heroImage || product.heroImage, {
            categorySlug: product.slug,
            productSlug: product.slug,
            productName: product.name,
            fabric: variant.fabric,
            gsmRange: variant.gsmRange,
            variantName: variant.name,
            variantSlug: variant.id,
          }),
        })),
      };
    });

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const { Schema } = mongoose;
    const ProductSchema = new Schema({}, { strict: false });
    const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    let inserted = 0;
    let updated = 0;
    for (const product of products) {
      try {
        const slug = product.slug;
        const existing = await ProductModel.findOne({ slug }).lean();

        // Build doc to set from product source
        const doc = {
          slug: product.slug,
          name: product.name,
          category: product.category || product.category || product.category || product.slug,
          tagline: product.tagline || product.tagline || product.name,
          moq: product.moq || product.moq || '100 Pieces',
          fabric: product.fabric || '',
          gsmRange: product.gsmRange || '',
          description: product.description || '',
          availableForBulk: product.availableForBulk ?? true,
          premiumQuality: product.premiumQuality ?? false,
          deliveryTimeline: product.deliveryTimeline || '5-7 business days',
          heroImage: product.heroImage || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          pricing: (product.pricing && product.pricing.length) ? product.pricing : (existing && existing.pricing ? existing.pricing : STANDARD_PRODUCT_PRICING),
          features: product.features || (existing && existing.features) || [],
          relatedSlugs: product.relatedSlugs || [],
          inquiryOnly: product.inquiryOnly ?? false,
          variants: product.variants || [],
        };

        if (!existing) {
          await ProductModel.create(doc);
          inserted++;
          console.log('Inserted product', slug);
        } else {
          await ProductModel.updateOne({ slug }, { $set: doc });
          updated++;
          console.log('Updated product', slug);
        }
      } catch (err) {
        console.error('Failed to upsert product', product.slug, err && err.message);
      }
    }

    // Log any extra products in DB not in source
    const sourceSlugs = new Set(products.map((p) => p.slug));
    const dbProducts = await ProductModel.find({}, { slug: 1 }).lean();
    const extras = dbProducts.map((d) => d.slug).filter((s) => !sourceSlugs.has(s));
    console.log('\nProducts present in DB but not in source (not deleted):', extras.length);
    extras.slice(0, 50).forEach((s) => console.log('-', s));

    const total = await ProductModel.countDocuments();
    console.log('\n=== Sync Summary ===');
    console.log('Inserted:', inserted);
    console.log('Updated:', updated);
    console.log('Total products in collection after sync:', total);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Failed to parse or sync:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

main();
