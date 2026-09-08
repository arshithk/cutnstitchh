function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  MONGODB_URI: getRequiredEnv("MONGODB_URI"),
  ADMIN_JWT_SECRET: getRequiredEnv("ADMIN_JWT_SECRET"),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || undefined,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
  SITE_CONTACT_EMAIL: process.env.SITE_CONTACT_EMAIL ?? "info@cutnstitch.com",
  SITE_PHONE_NUMBER: process.env.SITE_PHONE_NUMBER ?? "+919999999999",
  SITE_WHATSAPP_NUMBER: process.env.SITE_WHATSAPP_NUMBER ?? "+919999999999",
};
