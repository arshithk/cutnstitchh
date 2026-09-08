const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function readEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const text = fs.readFileSync(envPath, 'utf8');
  const lines = text.split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1);
  }
  return out;
}

(async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const env = readEnv(path.join(repoRoot, '.env.local'));
  const uri = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('missing MONGODB_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 20000 });
    const collections = (await mongoose.connection.db.listCollections().toArray()).map((c) => c.name);
    console.log('collections:', collections.join(','));
    const count = await mongoose.connection.db.collection('products').countDocuments();
    console.log('products count:', count);
    const sample = await mongoose.connection.db.collection('products').find({}).project({ slug: 1, name: 1, category: 1, variants: 1 }).limit(5).toArray();
    console.log('sample:', JSON.stringify(sample, null, 2));
  } catch (error) {
    console.error('error:', error && error.message ? error.message : error);
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
    } catch (err) {
      // ignore
    }
  }
})();
