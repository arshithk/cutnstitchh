// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { catalogCategories } from '../src/data/products';
// Removed incorrect stock import

const prisma = new PrismaClient();

async function main() {
    console.log("Checking if collections are empty...");

    const adminCount = await prisma.admin.count();
    const stockCount = await prisma.productStock.count();
    const pricingCount = await prisma.productPricing.count();

    if (adminCount > 0 || stockCount > 0 || pricingCount > 0) {
        console.log("Database already contains data:");
        console.log(`- Admins: ${adminCount}`);
        console.log(`- ProductStock: ${stockCount}`);
        console.log(`- ProductPricing: ${pricingCount}`);
        process.exit(0);
    }

    console.log("Collections are empty. Seeding...");

    // 1. Seed Admin
    const hashedPassword = await bcrypt.hash("VidhyaShankar123", 10);
    await prisma.admin.create({
        data: {
            email: "admin@cutnstitch.com",
            password: hashedPassword
        }
    });
    console.log("Admin seeded.");

    // 2. Seed ProductStock & ProductPricing
    for (const category of catalogCategories) {
        for (const variant of category.variants) {
            // Create pricing for variant
            const staticPricing = variant.pricing || category.pricing || [];
            const price100 = staticPricing.find(p => p.min === 100)?.price || 350;
            const price1000 = staticPricing.find(p => p.min === 1000)?.price || 320;
            const price5000 = staticPricing.find(p => p.min === 5000)?.price || 300;

            await prisma.productPricing.create({
                data: {
                    productSlug: category.slug,
                    productName: category.name,
                    category: category.slug, // Storing slug as category in pricing schema
                    variantSlug: variant.slug,
                    variantName: variant.name,
                    gsm: variant.gsm || "Unknown",
                    fabric: variant.fabric || "Unknown",
                    price_100_999: price100,
                    price_1000_4999: price1000,
                    price_5000_plus: price5000,
                }
            });

            // Create stock for variant
            for (const color of (variant.colors || [])) {
                // Find existing static stock if any
                // Some formats in stock.ts might vary, defaulting to 100 if none defined
                let quantity = 0;

                // Use liveStockQuantityData logic if exists
                const stockEntry = liveStockQuantityData?.find(s => s.categorySlug === category.slug && s.variantSlug === variant.slug && s.color.name === color.name);
                if (stockEntry) {
                    quantity = stockEntry.quantity;
                }

                await prisma.productStock.create({
                    data: {
                        productSlug: category.slug,
                        productName: category.name,
                        category: category.slug,
                        variantSlug: variant.slug,
                        variantName: variant.name,
                        gsm: variant.gsm || "Unknown",
                        fabric: variant.fabric || "Unknown",
                        color: color.name,
                        hex: color.hex,
                        quantity: quantity,
                    }
                });
            }
        }
    }

    console.log("Database seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
