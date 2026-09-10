function getEnv(key: string, fallback: string = ""): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    return fallback;
  }
  return value;
}

export const env = {
  MONGODB_URI: getEnv("MONGODB_URI", "mongodb://localhost:27017/cutnstitch"),
  ADMIN_JWT_SECRET: getEnv("ADMIN_JWT_SECRET", "default-build-time-secret-cutnstitch-2026"),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || undefined,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
  SITE_CONTACT_EMAIL: process.env.SITE_CONTACT_EMAIL ?? "vidhyashankar@cutnstitchapparel.com",
  SITE_PHONE_NUMBER: process.env.SITE_PHONE_NUMBER ?? "+91 99 444 66 3 11",
  SITE_WHATSAPP_NUMBER: process.env.SITE_WHATSAPP_NUMBER ?? "+91 99444 66311",
};
