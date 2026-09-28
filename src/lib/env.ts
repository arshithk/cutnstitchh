function getEnv(key: string, fallback: string = ""): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value;
}

export const env = {
  MONGODB_URI: getEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/cutnstitch"),
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
