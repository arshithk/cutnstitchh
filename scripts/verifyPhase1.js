const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const { env } = require('../src/lib/env');
const { dbConnect } = require('../src/lib/db');
const AdminUser = require('../src/models/AdminUser').default;
const Product = require('../src/models/Product').default;
const StockEntry = require('../src/models/StockEntry').default;
const QuoteRequest = require('../src/models/QuoteRequest').default;
const SiteSettings = require('../src/models/SiteSettings').default;

async function main() {
  console.log('env.MONGODB_URI=', !!env.MONGODB_URI);
  console.log('env.ADMIN_EMAIL=', env.ADMIN_EMAIL);
  console.log('env.ADMIN_PASSWORD=', !!env.ADMIN_PASSWORD);
  console.log('env.ADMIN_JWT_SECRET=', !!env.ADMIN_JWT_SECRET);

  await dbConnect();
  console.log('dbConnect OK');

  console.log('AdminUser model:', typeof AdminUser === 'function');
  console.log('Product model:', typeof Product === 'function');
  console.log('StockEntry model:', typeof StockEntry === 'function');
  console.log('QuoteRequest model:', typeof QuoteRequest === 'function');
  console.log('SiteSettings model:', typeof SiteSettings === 'function');

  const docs = await Promise.all([
    AdminUser.countDocuments().catch(() => null),
    Product.countDocuments().catch(() => null),
    StockEntry.countDocuments().catch(() => null),
    QuoteRequest.countDocuments().catch(() => null),
    SiteSettings.countDocuments().catch(() => null),
  ]);

  console.log('counts:', docs);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
