from pathlib import Path

path = Path('src/data/products.ts')
text = path.read_text(encoding='utf-8')
replacements = {
    '/images/products/regular-fit/cotton-180gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/regular-fit/polycotton-180gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/regular-fit/polyester-100gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/regular-fit/polyester-110gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/regular-fit/dri-fit-mars-200gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/regular-fit/dot-knit-160gsm.jpg': '/images/regular-fit-tshirt-white.jpg',
    '/images/products/polo/cotton-220gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/cotton-220gsm-dual-tipping.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/cotton-240gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/cotton-240gsm-tipping.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/premium-cotton-240gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/polycotton-220gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/polyester-110gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/polyester-140gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/dri-fit-mars-200gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/dot-knit-180gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/polo/honeycomb-160gsm.jpg': '/images/polo-tshirt-white.jpg',
    '/images/products/oversized/cotton-oversized-220gsm.jpg': '/images/oversized-tshirt-white.jpg',
    '/images/products/oversized/french-terry-240gsm.jpg': '/images/oversized-tshirt-white.jpg',
}
updated = text
change_count = 0
for old, new in replacements.items():
    change_count += updated.count(old)
    updated = updated.replace(old, new)
if change_count == 0:
    print('No matches found for replacements.')
else:
    path.write_text(updated, encoding='utf-8')
    print(f'Updated {change_count} image reference occurrences in {path}')
