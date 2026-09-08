import AdminUser from "@/models/AdminUser";
import { hashPassword } from "./auth";
import { dbConnect } from "./db";
import { env } from "./env";

export async function ensureAdminUserExists() {
  await dbConnect();
  const existingAdminCount = await AdminUser.countDocuments();
  if (existingAdminCount > 0) {
    return;
  }

  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "No admin exists and initial admin credentials are not configured.",
    );
  }

  const passwordHash = hashPassword(password);
  await AdminUser.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    role: "admin",
  });
}
