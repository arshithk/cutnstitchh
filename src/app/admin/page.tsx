import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import StockEntry from "@/models/StockEntry";
import { products as fallbackProducts } from "@/data/products";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value ?? null;
  const session = token ? verifyAdminToken(token) : null;
  if (!session || session.email !== "admin@cutnstitch.com") {
    redirect("/admin/login");
  }

  let stockCount = fallbackProducts.length;
  let pricingCount = fallbackProducts.filter((p) => (p.pricing?.length || 0) > 0).length;
  let totalQuantity = 0;

  try {
    await dbConnect();
    const dbProductCount = await Product.countDocuments();
    if (dbProductCount > 0) {
      stockCount = dbProductCount;
      pricingCount = await Product.countDocuments({ "pricing.0": { $exists: true } });
    }
    const stockEntries = await StockEntry.find().lean();
    for (const entry of stockEntries) {
      if (Array.isArray(entry.colors)) {
        for (const c of entry.colors) {
          totalQuantity += Number(c.quantity) || 0;
        }
      }
    }
  } catch (err) {
    console.warn("Could not query stats from database:", err);
  }

  return (
    <AdminDashboard
      stockCount={stockCount}
      pricingCount={pricingCount}
      totalQuantity={totalQuantity}
    />
  );
}
