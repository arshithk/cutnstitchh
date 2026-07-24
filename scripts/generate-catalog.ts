import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { catalogCategories } from '../src/data/products';

const PROJECT_ROOT = process.cwd();

function getBase64Image(imagePath: string): string {
    const fullPath = path.join(PROJECT_ROOT, 'public', imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
    if (!fs.existsSync(fullPath)) return '';
    const ext = path.extname(fullPath).slice(1);
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : (ext === 'svg' ? 'svg+xml' : ext);
    const data = fs.readFileSync(fullPath);
    return `data:image/${mime};base64,${data.toString('base64')}`;
}

async function main() {
    console.log("Starting catalog generation...");
    let variants: any[] = [];

    // Extract all variants
    for (const cat of catalogCategories) {
        for (const variant of cat.variants) {
            const pricing = variant.pricing && variant.pricing.length >= 3
                ? variant.pricing
                : [
                    { min: 100, max: 999, price: 175 },
                    { min: 1000, max: 4999, price: 173 },
                    { min: 5000, price: 170 },
                ];

            variants.push({
                ...variant,
                categoryName: cat.name,
                pricing: pricing
            });
        }
    }

    console.log(`Extracted ${variants.length} variants.`);

    const logoBase64 = getBase64Image('/images/cut-n-stitch-apparel.jpeg');
    const heroBgImage = logoBase64; // Can use something else if needed

    // Generate HTML pages
    let pagesHtml = '';

    // 1. Cover Page
    pagesHtml += `
    <div class="page cover-page">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="background:#fff; padding: 20px; border-radius: 8px;" />` : ''}
        <h1>Premium Product Catalogue</h1>
        <p>Expertly Crafted Uniforms, Merchandise & Sportswear</p>
        
        <div style="margin-top: 80px; text-transform:uppercase; font-size: 14px; letter-spacing: 2px; color: #f2c94c;">
            Cut N Stitch Apparel &bull; Made in India
        </div>
    </div>
    `;

    // 2. About Us Page
    pagesHtml += `
    <div class="page">
        <div class="page-header">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="border-radius:4px;" />` : `<h2 style="margin:0; color:#f2c94c;">Cut N Stitch Apparel</h2>`}
        </div>
        <div class="about-page">
            <h2>About Us</h2>
            <p>At <strong>Cut N Stitch Apparel</strong>, we specialize in high-quality, reliable, and premium B2B custom merchandise, uniforms, and sportswear. With over a decade of industry expertise, we manufacture and deliver excellence.</p>
            <p>Our commitment strictly resides in unparalleled stitching standards, premium fabric selection, and modern printing compatibilities—empowering your brand from design to dispatch.</p>
            <p>Whether you require corporate uniforms, event merchandise, or complex bulk export assignments, Cut N Stitch operates on core pillars: Durability, Consistency, and Timeline accuracy.</p>

            <div class="about-contact">
                <h3 style="margin-top:0; color: #111;">Get In Touch For Bulk Orders</h3>
                <p style="margin-bottom: 5px;"><strong>Email:</strong> vidhyashankar@cutnstitchapparel.com</p>
                <p style="margin-bottom: 5px;"><strong>Phone / WhatsApp:</strong> +91 99444 66311</p>
                <p style="margin-bottom: 0;"><strong>Office:</strong> No.51(2), Sugam Residency, 1st Floor, Rakkiyapalayam Road, Ammapalayam, Tirupur - 641 652</p>
            </div>
        </div>
        <div class="page-footer">
            <span>Cut N Stitch Apparel | Premium B2B Merchandise</span>
            <span>Page 2</span>
        </div>
    </div>
    `;

    // 3. Variant Pages
    variants.forEach((v, idx) => {
        const imageB64 = getBase64Image(v.heroImage);
        const p1 = v.pricing[0].price;
        const p2 = v.pricing[1].price;
        const p3 = v.pricing.length > 2 ? v.pricing[2].price : v.pricing[1].price;

        pagesHtml += `
        <div class="page">
            <div class="page-header">
               ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="border-radius:4px;" />` : `<h2 style="margin:0; color:#f2c94c;">Cut N Stitch Apparel</h2>`}
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div class="product-title">
                        <h2>${v.name}</h2>
                        <div class="product-specs">
                            <span class="spec-badge">${v.gsm || 'Custom GSM'}</span>
                            <span class="spec-badge" style="background:#333; color:#fff;">${v.fabric || 'Premium Blend'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="product-image-container">
                    ${imageB64 ? `<img src="${imageB64}" alt="${v.name}" />` : `<div style="padding:100px; color:#aaa;">Image Not Available</div>`}
                </div>
                
                <div class="product-description">
                    <strong>Description:</strong> ${v.productDescription || v.description}
                    <br /><br />
                    <strong>Printing Compatibility:</strong> ${v.printingCompatibility || 'All custom printing supported.'}
                </div>
                
                <div class="pricing-section">
                    <h3>Bulk Pricing Tiers</h3>
                    <table class="pricing-table">
                        <thead>
                            <tr>
                                <th>100 - 999 Pcs</th>
                                <th>1000 - 4999 Pcs</th>
                                <th>5000+ Pcs</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>₹${p1}/pc</td>
                                <td>₹${p2}/pc</td>
                                <td>₹${p3}/pc</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="page-footer">
                <span>Cut N Stitch Apparel | Premium B2B Merchandise</span>
                <span>Page ${idx + 3}</span>
            </div>
        </div>
        `;
    });

    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
    @page { margin: 0; size: A4; }
    body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        color: #111;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    .page {
        page-break-after: always;
        width: 100%;
        height: 296mm; /* slightly under 297mm to prevent blank pages */
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
    }
    .page:last-child {
        page-break-after: avoid;
    }
    
    .page-header {
        height: 80px;
        background: #111;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 40px;
        border-bottom: 4px solid #f2c94c;
    }
    .page-header img {
        height: 50px;
        object-fit: contain;
    }
    
    .page-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
        background: #f2c94c;
        color: #111;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        font-weight: 600;
        font-size: 14px;
        box-sizing: border-box;
    }
    
    .cover-page {
        background: #111;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 40px;
    }
    .cover-page h1 {
        font-family: 'Playfair Display', serif;
        font-size: 52px;
        color: #f2c94c;
        margin-bottom: 10px;
        line-height: 1.2;
    }
    .cover-page p {
        font-size: 20px;
        font-weight: 400;
        color: #ddd;
    }
    .cover-page img {
        height: 150px;
        margin-bottom: 40px;
    }
    
    .about-page {
        padding: 60px 80px;
    }
    .about-page h2 {
        font-size: 40px;
        color: #111;
        border-left: 6px solid #f2c94c;
        padding-left: 20px;
        margin-bottom: 30px;
    }
    .about-page p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
    }
    .about-contact {
        margin-top: 40px;
        padding: 25px;
        background: #f9f9f9;
        border: 1px solid #eaeaea;
        border-radius: 8px;
    }
    
    .product-content {
        padding: 40px 60px;
        display: flex;
        flex-direction: column;
        height: calc(100% - 140px);
    }
    .product-header {
        margin-bottom: 20px;
    }
    .product-title h2 {
        font-size: 32px;
        margin: 0 0 10px 0;
        color: #111;
        line-height: 1.2;
    }
    .product-specs {
        display: flex;
        gap: 12px;
    }
    .spec-badge {
        background: #111;
        color: #f2c94c;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
    }
    
    .product-image-container {
        flex: 1;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #eaeaea;
        max-height: 400px;
    }
    .product-image-container img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
    }
    
    .product-description {
        font-size: 15px;
        line-height: 1.5;
        color: #333;
        margin-bottom: 25px;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 8px;
    }
    
    .pricing-section h3 {
        font-size: 18px;
        margin: 0 0 15px 0;
        border-bottom: 3px solid #f2c94c;
        display: inline-block;
        padding-bottom: 5px;
    }
    .pricing-table {
        width: 100%;
        border-collapse: collapse;
    }
    .pricing-table th, .pricing-table td {
        padding: 12px 15px;
        text-align: center;
        border: 1px solid #eaeaea;
    }
    .pricing-table th {
        background: #111;
        color: #f2c94c;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 13px;
    }
    .pricing-table td {
        font-size: 18px;
        font-weight: 700;
        color: #111;
        background: #fff;
    }
    </style>
    </head>
    <body>
        ${pagesHtml}
    </body>
    </html>
    `;

    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(fullHtml, { waitUntil: 'domcontentloaded' });

    const outputPath = path.join(PROJECT_ROOT, 'public', 'catalog.pdf');
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    console.log("Successfully generated:", outputPath);
}

main().catch(console.error);
