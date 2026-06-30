import "dotenv/config";

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const requiredEnvVars = ["DATABASE_URL", "BASE_URL", "FRONTEND_URL"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 5000),
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  baseUrl: process.env.BASE_URL,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  mobileAppUrl: process.env.MOBILE_APP_URL,
};
