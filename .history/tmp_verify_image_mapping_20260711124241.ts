import fs from "node:fs";
import path from "node:path";
import { catalogCategories, products } from "./src/data/products.ts";
import { getProductImagePath, normalizeColorName } from "./src/lib/productImageMap.ts";

type Check = {
  kind: "catalog" | "detail";
  category: string;
  variant: string;
  color: string;
  resolved: string;
  expectedStem: string;
  stemOk: boolean;
  exists: boolean;
};

const root = process.cwd();
const checks: Check[] = [];

const categories = catalogCategories.filter((category) => category.slug === "shorts" || category.slug === "joggers");
for (const category of categories) {
  for (const variant of category.variants) {
    const isLycra = variant.fabric.toLowerCase().includes("lycra");
    const expectedBase = category.slug === "shorts"
      ? (isLycra ? "lycra-shorts" : "shorts")
      : (isLycra ? "lycra-joggers" : "joggers");

    for (const color of variant.colors) {
      const resolved = getProductImagePath({
        categorySlug: category.slug,
        productSlug: category.slug,
        productName: category.name,
        fabric: variant.fabric,
        gsmRange: variant.gsm,
        variantName: variant.name,
        variantSlug: variant.slug,
      }, color.name, variant.heroImage);

      const expectedStem = `/images/${expectedBase}-${normalizeColorName(color.name)}`;
      const stemOk = resolved.startsWith(expectedStem);
      const exists = fs.existsSync(path.join(root, "public", resolved.replace(/^\//, "")));

      checks.push({
        kind: "catalog",
        category: category.slug,
        variant: variant.slug,
        color: color.name,
        resolved,
        expectedStem,
        stemOk,
        exists,
      });
    }
  }
}

const detailProducts = products.filter((product) => product.slug === "shorts" || product.slug === "joggers");
for (const product of detailProducts) {
  for (const variant of product.variants ?? []) {
    const isLycra = variant.fabric.toLowerCase().includes("lycra");
    const expectedBase = product.slug === "shorts"
      ? (isLycra ? "lycra-shorts" : "shorts")
      : (isLycra ? "lycra-joggers" : "joggers");

    for (const color of variant.colors) {
      const resolved = getProductImagePath({
        categorySlug: product.slug,
        productSlug: product.slug,
        productName: product.name,
        fabric: variant.fabric,
        gsmRange: variant.gsmRange,
        variantName: variant.name,
        variantSlug: variant.id,
      }, color.name, variant.heroImage);

      const expectedStem = `/images/${expectedBase}-${normalizeColorName(color.name)}`;
      const stemOk = resolved.startsWith(expectedStem);
      const exists = fs.existsSync(path.join(root, "public", resolved.replace(/^\//, "")));

      checks.push({
        kind: "detail",
        category: product.slug,
        variant: variant.id,
        color: color.name,
        resolved,
        expectedStem,
        stemOk,
        exists,
      });
    }
  }
}

const failures = checks.filter((check) => !check.stemOk || !check.exists);

console.log(`TOTAL_CHECKS ${checks.length}`);
console.log(`FAILURES ${failures.length}`);
if (failures.length > 0) {
  for (const failure of failures.slice(0, 40)) {
    console.log(JSON.stringify(failure));
  }
  process.exitCode = 1;
} else {
  console.log("ALL_MAPPING_CHECKS_PASSED");
}
