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

  const marker = 'const baseCatalogCategories';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    console.error('Could not find baseCatalogCategories in products.ts');
    process.exit(1);
  }

  // Find the first = [ after marker
  const eqIdx = text.indexOf('=', idx);
  const arrStart = text.indexOf('[', eqIdx);
  if (arrStart === -1) {
    console.error('Could not find array start for baseCatalogCategories');
    process.exit(1);
  }

  // Extract bracket-balanced array literal
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
    console.error('Could not find end of array literal');
    process.exit(1);
  }

  const arrayLiteral = text.slice(arrStart, endPos + 1);

  // Evaluate the array literal in a sandbox to get a JS object
  const sandbox = {};
  try {
    const script = new vm.Script('result = ' + arrayLiteral);
    const ctx = vm.createContext(sandbox);
    script.runInContext(ctx, { timeout: 1000 });
    const categories = sandbox.result;
    if (!Array.isArray(categories)) {
      console.error('Parsed categories is not an array');
      process.exit(1);
    }

    console.log('Parsed', categories.length, 'categories');

    // Connect to MongoDB (Mongoose 8+)
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Do not require the project's TypeScript model file. Define a minimal migration schema below.

    // To be safe, build a minimal mongoose schema inline similar to Product model
    const { Schema } = mongoose;
    const ProductSchema = new Schema(
      {
        slug: { type: String, required: true, trim: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        tagline: { type: String, required: true, trim: true },
        moq: { type: String, required: true, trim: true },
        fabric: { type: String, required: true, trim: true },
        gsmRange: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        availableForBulk: { type: Boolean, required: true, default: true },
        premiumQuality: { type: Boolean, required: true, default: false },
        deliveryTimeline: { type: String, required: true, trim: true },
        heroImage: { type: String, required: true, trim: true },
        colors: { type: [Object], required: true, default: [] },
        sizes: { type: [String], required: true, default: [] },
        pricing: { type: [Object], required: true, default: [] },
        features: { type: [Object], required: true, default: [] },
        relatedSlugs: { type: [String], required: true, default: [] },
        inquiryOnly: { type: Boolean, required: true, default: false },
        variants: { type: [Object], required: false, default: [] },
      },
      { timestamps: true },
    );

    const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    let inserted = 0;
    let skipped = 0;
    for (const category of categories) {
      const catSlug = category.slug || category.id || category.name || 'uncategorized';
      const catName = category.name || catSlug;
      const variants = category.variants || [];
      for (const variant of variants) {
        const doc = {
          slug: variant.slug,
          name: variant.name,
          category: catSlug,
          tagline: variant.productDescription || variant.description || category.description || '',
          moq: variant.moq || '100 Pieces',
          fabric: variant.fabric || '',
          gsmRange: variant.gsm || variant.gsmRange || '',
          description: variant.productDescription || variant.description || category.description || '',
          heroImage: variant.heroImage || category.heroImage || '/images/regular-fit-tshirt-white.jpg',
          availableForBulk: true,
          premiumQuality: false,
          deliveryTimeline: '5-7 business days',
          colors: (variant.colors || []).map((c) => ({ name: c.name, hex: c.hex, imagePath: c.imagePath })),
          sizes: variant.sizes || [],
          pricing: variant.pricing || variant.pricing || [],
          features: [],
          relatedSlugs: [],
          inquiryOnly: false,
          variants: [],
        };

        try {
          const existing = await ProductModel.findOne({ slug: doc.slug }).lean();
          if (existing) {
            console.log('Skipping existing', doc.slug);
            skipped++;
            continue;
          }
          await ProductModel.create(doc);
          inserted++;
          console.log('Inserted', doc.slug);
        } catch (err) {
          console.error('Error inserting', doc.slug, err && err.message);
        }
      }
    }

    // Remove QA test products that were created during manual testing
    const removed = await ProductModel.deleteMany({ slug: { $in: ['qa-runtime-check', 'qa-test-product', 'qa-runtime-check-2'] } });
    const deletedCount = removed.deletedCount || 0;

    const total = await ProductModel.countDocuments();

    console.log('\n=== Migration Summary ===');
    console.log('Inserted:', inserted);
    console.log('Skipped (already existed):', skipped);
    console.log('Deleted QA products:', deletedCount);
    console.log('Total products in collection after migration:', total);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Failed to parse or migrate:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

main();
