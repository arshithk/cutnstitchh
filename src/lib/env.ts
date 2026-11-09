function getEnv(key: string, fallback: string = ""): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value.trim();
}

/**
 * Resolves the MongoDB connection URI at runtime with alias fallbacks
 * and strict cloud validation for production / Vercel deployments.
 */
export function getMongoUri(): string {
  // Check common environment variable aliases in order of preference
  const rawUri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URI ||
    "";

  let uri = rawUri.trim();

  // Strip accidental surrounding quotes if copied with quotes in Vercel UI
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

  if (!uri) {
    if (isProduction) {
      throw new Error(
        "CRITICAL: MONGODB_URI is not set in Vercel environment variables. " +
        "Please open your Vercel Project Dashboard -> Settings -> Environment Variables, " +
        "add MONGODB_URI with your MongoDB Atlas connection string (mongodb+srv://...), " +
        "ensure 'Production' and 'Preview' are checked, and Redeploy."
      );
    }
    // Only in local development when no URI is provided at all
    return "mongodb://127.0.0.1:27017/cutnstitch";
  }

  // Reject local addresses in production / Vercel with a precise, helpful error
  if (isProduction && (uri.includes("127.0.0.1") || uri.includes("localhost"))) {
    throw new Error(
      "CONFIGURATION ERROR: MONGODB_URI in Vercel is set to a local address (127.0.0.1 / localhost). " +
      "Vercel serverless functions cannot connect to your local computer. " +
      "Please update MONGODB_URI in Vercel Project Settings -> Environment Variables to your cloud MongoDB Atlas connection string (mongodb+srv://...) and redeploy."
    );
  }

  return uri;
}

export const env = {
  get MONGODB_URI(): string {
    return getMongoUri();
  },
  ADMIN_JWT_SECRET: getEnv("ADMIN_JWT_SECRET", "default-build-time-secret-cutnstitch-2026"),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || undefined,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
  SITE_CONTACT_EMAIL: process.env.SITE_CONTACT_EMAIL ?? "vidhyashankar@cutnstitchapparel.com",
  SITE_PHONE_NUMBER: process.env.SITE_PHONE_NUMBER ?? "+91 99 444 66 3 11",
  SITE_WHATSAPP_NUMBER: process.env.SITE_WHATSAPP_NUMBER ?? "+91 99444 66311",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT || "465"),
  SMTP_SECURE: process.env.SMTP_SECURE !== "false",
  SMTP_USER: process.env.SMTP_USER || process.env.GMAIL_USER || undefined,
  SMTP_PASS: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || undefined,
  SMTP_FROM: process.env.SMTP_FROM || `"Cut N Stitch Apparel" <vidhyashankar@cutnstitchapparel.com>`,
};
