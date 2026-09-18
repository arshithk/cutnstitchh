import AdminUser from "@/models/AdminUser";
import { hashPassword, verifyPassword } from "./auth";
import { dbConnect } from "./db";
import { env } from "./env";

export async function ensureAdminUserExists(): Promise<boolean> {
  try {
    await dbConnect();

    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASSWORD;
    if (!email || !password) {
      return false;
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await AdminUser.findOne({ email: cleanEmail });
    if (existing) {
      if (!verifyPassword(password, existing.passwordHash)) {
        existing.passwordHash = hashPassword(password);
        await existing.save();
      }
      return true;
    }

    const passwordHash = hashPassword(password);
    try {
      await AdminUser.create({
        email: cleanEmail,
        passwordHash,
        role: "admin",
      });
    } catch (createErr: any) {
      // Ignore duplicate key error in case of concurrent execution
      if (createErr?.code !== 11000) {
        throw createErr;
      }
    }
    return true;
  } catch (error) {
    console.warn("Could not ensure admin user in database:", (error as Error)?.message || error);
    return false;
  }
}

