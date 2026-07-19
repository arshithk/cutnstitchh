from PIL import Image, ImageOps, ImageFilter, ImageDraw
from pathlib import Path

ROOT = Path('public/images')

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
    src = ROOT / rel_in
    dst = ROOT / 'products' / rel_out
    if not src.exists():
        raise FileNotFoundError(src)

    img = Image.open(src).convert('RGBA')
    img = ImageOps.exif_transpose(img)

    target_w, target_h = 1400, 1900
    canvas = Image.new('RGB', (target_w, target_h), '#f6efe7')
    draw = ImageDraw.Draw(canvas)
    for y in range(target_h):
        t = y / target_h
        r = int(246 - (246 - 235) * t)
        g = int(239 - (239 - 228) * t)
        b = int(231 - (231 - 223) * t)
        draw.line([(0, y), (target_w, y)], fill=(r, g, b))

    vignette = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    shade = ImageDraw.Draw(vignette)
    for radius in range(0, 900, 20):
        shade.ellipse((100 - radius, 80 - radius, target_w - 100 + radius, target_h - 80 + radius), outline=(0, 0, 0, int(10 / (radius / 100 + 1))))

    canvas = Image.alpha_composite(canvas.convert('RGBA'), vignette).convert('RGB')

    scale = 0.78
    new_w = max(320, int(img.width * scale))
    new_h = max(420, int(img.height * scale))
    product = img.resize((new_w, new_h), Image.LANCZOS)

    shadow = Image.new('RGBA', product.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((8, 12, product.width - 2, product.height - 2), radius=30, fill=(0, 0, 0, 65))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    shadow = shadow.resize((product.width + 40, product.height + 40), Image.LANCZOS)

    base = Image.new('RGBA', (target_w, target_h), (255, 255, 255, 0))
    base.paste(shadow, (target_w // 2 - product.width // 2 - 10, target_h // 2 - product.height // 2 + 35), shadow)
    base.paste(product, (target_w // 2 - product.width // 2, target_h // 2 - product.height // 2), product)

    out = Image.alpha_composite(canvas.convert('RGBA'), base).convert('RGB')
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, quality=95, optimize=True)
    print(f'generated {dst}')
