import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { catalogCategories } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seed process...");

    // 1. Create Default Admin
    const adminEmail = "admin@cutnstitch.com";
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.admin.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
            },
        });
        console.log(`Created default admin: ${adminEmail}`);
    } else {
        console.log(`Admin ${adminEmail} already exists.`);
    }

    // 2. Iterate through products and variants
    // We'll track how many records we insert
    let stockCount = 0;
    let pricingCount = 0;

    // Clear existing items if we want a fresh seed (Optional)
    await prisma.productStock.deleteMany({});
    await prisma.productPricing.deleteMany({});

    for (const category of catalogCategories) {
        for (const variant of category.variants) {
            // 2a. Insert ProductPricing
            let p1 = 0, p2 = 0, p3 = 0;
            if (variant.pricing && variant.pricing.length > 0) {
                p1 = variant.pricing[0]?.price || 0;
                p2 = variant.pricing[1]?.price || p1;
                p3 = variant.pricing[2]?.price || p2;
            }

            await prisma.productPricing.create({
                data: {
                    productSlug: category.slug,
                    productName: category.name,
                    category: category.name,
                    variantSlug: variant.slug,
                    variantName: variant.name,
                    gsm: variant.gsm || "Unknown",
                    fabric: variant.fabric || "Unknown",
                    price_100_999: p1,
                    price_1000_4999: p2,
                    price_5000_plus: p3,
                },
            });
            pricingCount++;

            // 2b. Insert ProductStock
            for (const color of variant.colors) {
                // Find existing stock in the legacy file if needed, or default to some arbitrary seeded quantity
                // The prompt asks to migrate, we can default all to 100 for now, as admin will manage it
                await prisma.productStock.create({
                    data: {
                        productSlug: category.slug,
                        productName: category.name,
                        category: category.name,
                        variantSlug: variant.slug,
                        variantName: variant.name,
                        gsm: variant.gsm || "Unknown",
                        fabric: variant.fabric || "Unknown",
                        color: color.name,
                        hex: color.hex,
                        quantity: 100, // Seed placeholder quantity
                    },
                });
                stockCount++;
            }
        }
    }

    console.log(`Seeded ${pricingCount} pricing records and ${stockCount} stock records.`);
    console.log("Seed process completed.");
}

main()
    .catch((e) => {
        console.error("Error seeding database: ", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
