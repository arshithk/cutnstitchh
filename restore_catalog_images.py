from pathlib import Path
import shutil

root = Path('public/images/products')
pairs = [
    ('regular-fit/cotton-180gsm.jpg', 'regular-fit-tshirt-white.jpg'),
    ('regular-fit/polycotton-180gsm.jpg', 'regular-fit-tshirt-grey.jpg'),
    ('regular-fit/polyester-100gsm.jpg', 'regular-fit-tshirt-red.jpg'),
    ('regular-fit/polyester-110gsm.jpg', 'regular-fit-tshirt-navy-blue.jpg'),
    ('regular-fit/dri-fit-mars-200gsm.jpg', 'regular-fit-tshirt-yellow.jpg'),
    ('regular-fit/dot-knit-160gsm.jpg', 'regular-fit-tshirt-purple.jpg'),
    ('polo/cotton-220gsm.jpg', 'polo-tshirt-white.jpg'),
    ('polo/cotton-220gsm-dual-tipping.jpg', 'polo-tshirt-dark-blue.jpg'),
    ('polo/cotton-240gsm.jpg', 'polo-tshirt-maroon.jpg'),
    ('polo/cotton-240gsm-tipping.jpg', 'polo-tshirt-red.jpg'),
    ('polo/premium-cotton-240gsm.jpg', 'polo-tshirt-brown.jpg'),
    ('polo/polycotton-220gsm.jpg', 'polo-tshirt-grey.jpg'),
    ('polo/polyester-110gsm.jpg', 'polo-tshirt-orange.jpg'),
    ('polo/polyester-140gsm.jpg', 'polo-tshirt-yellow.jpg'),
    ('polo/dri-fit-mars-200gsm.jpg', 'polo-tshirt-purple.jpg'),
    ('polo/dot-knit-180gsm.jpg', 'polo-tshirt-dark-blue.jpg'),
    ('polo/honeycomb-160gsm.jpg', 'polo-tshirt-grey.jpg'),
    ('oversized/cotton-oversized-220gsm.jpg', 'oversized-tshirt-white.jpg'),
    ('oversized/french-terry-240gsm.jpg', 'oversized-tshirt-brown.jpg'),
]

for rel_out, rel_in in pairs:
    src = Path('public/images') / rel_in
    dst = root / rel_out
    if src.exists():
        shutil.copy2(src, dst)
        print(f'copied {src} -> {dst}')
    else:
        print(f'skipped missing {src}')
