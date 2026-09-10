import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),

    DATABASE_HOST: z.string().default("localhost"),
    DATABASE_PORT: z.coerce.number().int().positive().default(5432),
    DATABASE_USERNAME: z.string().min(1),
    DATABASE_PASSWORD: z.string(),
    DATABASE_DATABASE: z.string().min(1),
    DATABASE_SCHEMA: z.string().default("public"),
    DATABASE_SSL: z.stringbool().default(false),
    DATABASE_LOGGING: z.stringbool().default(false),

    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    EMAIL_REPLY_TO: z.email().optional(),
    EMAIL_BRAND_NAME: z.string().min(1).default("Contact Form App"),
    CORS_ORIGIN: z.string().default("*"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
