import { MetadataRoute } from 'next';
import { catalogCategories } from '@/data/products';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://cutnstitchapparel.com';

    const defaultPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/live-stock`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.8,
        },
    ];

    // We will gather URLs and avoid duplicates using a Set
    const urls = new Set<string>();
    const sitemapEntries: MetadataRoute.Sitemap = [];

    const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
        if (!urls.has(entry.url)) {
            urls.add(entry.url);
            sitemapEntries.push(entry);
        }
    };

    defaultPages.forEach(addEntry);

    // Add static categories and variants from catalogCategories
    for (const category of catalogCategories) {
        addEntry({
            url: `${baseUrl}/products/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        });

        for (const variant of category.variants) {
            addEntry({
                url: `${baseUrl}/products/${category.slug}/${variant.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    // Also query prisma for any dynamic products to ensure they are captured
    try {
        const productsDB = await prisma.productPricing.findMany({
            select: {
                productSlug: true,
                variantSlug: true,
            },
        });

        for (const p of productsDB) {
            if (p.productSlug) {
                addEntry({
                    url: `${baseUrl}/products/${p.productSlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.9,
                });
            }
            if (p.productSlug && p.variantSlug) {
                addEntry({
                    url: `${baseUrl}/products/${p.productSlug}/${p.variantSlug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        }
    } catch (error) {
        console.error('Failed to fetch from prisma for sitemap', error);
    }

    return sitemapEntries;
}
