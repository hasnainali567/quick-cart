import 'dotenv/config'
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';


export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    emailAndPassword : {
        enabled : true,
    },
    baseUrl: process.env.BASE_URL,
    trustedOrigins: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    session: {
        deferSessionRefresh: true,
        cookieCache : {
            enabled : true,
            maxAge : 1000 * 60 * 60 , // 1 hour
        }
    },
    user: {
        additionalFields: {
            phone: { type: "string", required: false },
            role: { type: "string", defaultValue: 'CUSTOMER' },
            isActive: { type: "boolean", defaultValue: true },
            isSuspended: { type: "boolean", defaultValue: false },
            phoneVerified: { type: "boolean", defaultValue: false },
            fcmToken: { type: "string", required: false },
        }
    },
})
