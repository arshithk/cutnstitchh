import json
import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find categories
cat_matches = re.findall(r'id:\s*"(.*?)",\s*slug:\s*"(.*?)",\s*name:\s*"(.*?)"', content)
print(f"Categories found ({len(cat_matches)}):")
for cid, slug, name in cat_matches:
    print(f"  - ID: {cid}, Slug: {slug}, Name: {name}")

# Also find variant names
variant_names = re.findall(r'name:\s*"(.*?(?:T-Shirt|Hoodie|Sweatshirt|Shorts|Joggers|Polo|Round Neck).*?)"', content)
print(f"\nUnique Variant sample names ({len(set(variant_names))}):")
for v in list(set(variant_names))[:15]:
    print(f"  * {v}")
