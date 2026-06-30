import "dotenv/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [expo()],
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseUrl: process.env.BASE_URL,
  trustedOrigins:
    process.env.NODE_ENV === "development"
      ? ["*"] // or check if better-auth supports this
      : [
          process.env.FRONTEND_URL,
          process.env.APP_URL,
          "http://localhost:5173",
        ].filter(Boolean),
  session: {
    deferSessionRefresh: true,
    cookieCache: {
      enabled: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  },
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      role: { type: "string", defaultValue: "CUSTOMER" },
      isActive: { type: "boolean", defaultValue: true },
      isSuspended: { type: "boolean", defaultValue: false },
      phoneVerified: { type: "boolean", defaultValue: false },
      fcmToken: { type: "string", required: false },
    },
  },
});
