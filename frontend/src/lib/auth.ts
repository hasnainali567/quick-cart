import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["CUSTOMER", "STORE_ADMIN", "SUPER_ADMIN"],
          defaultValue: "CUSTOMER",
        },
        phone: {
          type: "string",
          nullable: true,
        },
        isSuspended: {
          type: "boolean",
          defaultValue: false,
        },
        isActive: {
          type: "boolean",
          defaultValue: true,
        },
        phoneVerified: {
          type: "boolean",
          defaultValue: false,
        },
        fcmToken: {
          type: "string",
          nullable: true,
          defaultValue: null,
        },
      },
    }),
  ],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;
export default authClient;
