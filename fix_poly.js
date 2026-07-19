const fs = require('fs');
let content = fs.readFileSync('src/data/products.ts', 'utf8');

// The dynamic generator part (line ~462) was already fixed previously
// Wait, we should double check the dynamic part and variants.
// Replace all "Screen Printing, " or "screen printing, " in polyester strings. 

let blocks = content.split(/(?=\s*(?:slug:\s*|'slug':\s*|\"slug\":\s*)['\"])/i);
for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (/fabric:\s*['\"].*?(Polyester|lycra|dri|dot knit|saleena).*?['\"]/i.test(block) && !/fabric:\s*['\"].*?PolyCotton.*?['\"]/i.test(block) && /printingCompatibility/.test(block)) {
        block = block.replace(/(printingCompatibility:\s*['\"])(.*?)(['\"])/i, (match, p1, p2, p3) => {
            let cleaned = p2.replace(/Screen printing,?/gi, '');

            cleaned = cleaned.replace(/Ideal for\s+and\s+heat/gi, 'Ideal for heat');
            cleaned = cleaned.replace(/Excellent for\s+and\s+heat/gi, 'Excellent for heat');
            cleaned = cleaned.replace(/Sublimation, , and/gi, 'Sublimation and');
            cleaned = cleaned.replace(/Sublimation,\s+and/gi, 'Sublimation and');

            // Cleanup extra spaces and commas
            cleaned = cleaned.replace(/,\s*,/g, ',');
            cleaned = cleaned.replace(/,\s+and/gi, ' and');
            cleaned = cleaned.replace(/\s+and\s+heat/gi, ' and heat');
            cleaned = cleaned.replace(/Ideal for ,/gi, 'Ideal for');
            cleaned = cleaned.replace(/for\s+and/gi, 'for');
            cleaned = cleaned.replace(/Ideal for heat transfer applications/gi, 'Ideal for heat transfer applications');
            cleaned = cleaned.replace(/Great for and/gi, 'Great for');
            cleaned = cleaned.replace(/  +/g, ' ');
            // Fix capitalization
            cleaned = cleaned.trim();
            if (cleaned.startsWith('and ')) cleaned = cleaned.substring(4);
            if (cleaned.startsWith(', ')) cleaned = cleaned.substring(2);
            if (cleaned.startsWith('and ')) cleaned = cleaned.substring(4);
            if (cleaned.startsWith('And ')) cleaned = cleaned.substring(4);
            cleaned = cleaned.trim();
            if (cleaned.startsWith(',')) cleaned = cleaned.substring(1);
            cleaned = cleaned.trim();
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
            return p1 + cleaned + p3;
        });
        blocks[i] = block;
    }
}
fs.writeFileSync('src/data/products.ts', blocks.join(''));
console.log('Update finished');
