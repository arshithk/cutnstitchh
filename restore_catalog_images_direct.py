from pathlib import Path
import shutil

base = Path('public/images')
pairs = [
    ('products/regular-fit/cotton-180gsm.jpg', 'regular-fit-tshirt-white.jpg'),
    ('products/regular-fit/polycotton-180gsm.jpg', 'regular-fit-tshirt-grey.jpg'),
    ('products/regular-fit/polyester-100gsm.jpg', 'regular-fit-tshirt-red.jpg'),
    ('products/regular-fit/polyester-110gsm.jpg', 'regular-fit-tshirt-navy-blue.jpg'),
    ('products/regular-fit/dri-fit-mars-200gsm.jpg', 'regular-fit-tshirt-yellow.jpg'),
    ('products/regular-fit/dot-knit-160gsm.jpg', 'regular-fit-tshirt-purple.jpg'),
    ('products/polo/cotton-220gsm.jpg', 'polo-tshirt-white.jpg'),
    ('products/polo/cotton-220gsm-dual-tipping.jpg', 'polo-tshirt-dark-blue.jpg'),
    ('products/polo/cotton-240gsm.jpg', 'polo-tshirt-maroon.jpg'),
    ('products/polo/cotton-240gsm-tipping.jpg', 'polo-tshirt-red.jpg'),
    ('products/polo/premium-cotton-240gsm.jpg', 'polo-tshirt-brown.jpg'),
    ('products/polo/polycotton-220gsm.jpg', 'polo-tshirt-grey.jpg'),
    ('products/polo/polyester-110gsm.jpg', 'polo-tshirt-orange.jpg'),
    ('products/polo/polyester-140gsm.jpg', 'polo-tshirt-yellow.jpg'),
    ('products/polo/dri-fit-mars-200gsm.jpg', 'polo-tshirt-purple.jpg'),
    ('products/polo/dot-knit-180gsm.jpg', 'polo-tshirt-dark-blue.jpg'),
    ('products/polo/honeycomb-160gsm.jpg', 'polo-tshirt-grey.jpg'),
    ('products/oversized/cotton-oversized-220gsm.jpg', 'oversized-tshirt-white.jpg'),
    ('products/oversized/french-terry-240gsm.jpg', 'oversized-tshirt-brown.jpg'),
]

for dst_rel, src_rel in pairs:
    src = base / src_rel
    dst = base / dst_rel
    if src.exists() and dst.exists():
        shutil.copy2(src, dst)
        print(f'copied {src_rel} -> {dst_rel}')
    else:
        print(f'skipped {src_rel} -> {dst_rel}')
