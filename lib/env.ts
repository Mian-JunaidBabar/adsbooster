import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  WHATSAPP_NUMBER: z.string().default("923000000000"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  GOOGLE_SHEETS_WEBHOOK_URL: z.string().optional(),
  GOOGLE_SHEETS_WEBHOOK_SECRET: z.string().min(16).optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z
    .string()
    .min(1)
    .default("AdsBoosters.pk <onboarding@resend.dev>"),
  LEAD_NOTIFICATION_EMAIL: z
    .string()
    .email()
    .default("adsboosters6030@gmail.com"),
});

export const env = envSchema.parse(process.env);
