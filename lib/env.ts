import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    WHATSAPP_NUMBER: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    SUPABASE_URL: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    SUPABASE_ANON_KEY: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    SUPABASE_SERVICE_ROLE_KEY: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    TURNSTILE_SECRET_KEY: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    GOOGLE_SHEETS_WEBHOOK_URL: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    GOOGLE_SHEETS_WEBHOOK_SECRET: z
      .string()
      .min(16)
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    RESEND_API_KEY: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    RESEND_FROM_EMAIL: z
      .string()
      .min(1)
      .default("AdsBoosters.pk <onboarding@resend.dev>"),
    LEAD_NOTIFICATION_EMAIL: z
      .string()
      .email()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "production" && !data.LEAD_NOTIFICATION_EMAIL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "LEAD_NOTIFICATION_EMAIL is required in production",
        path: ["LEAD_NOTIFICATION_EMAIL"],
      });
    }
  });

export const env = envSchema.parse(process.env);

