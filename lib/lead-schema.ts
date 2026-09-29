import { z } from "zod";
import { normalizePhone } from "./utils/phone";

export const businessTypes = [
  "Clinic",
  "Visa consultancy",
  "Local business",
] as const;

export const budgetOptions = [
  "Under 50k PKR",
  "50k–150k PKR",
  "150k–500k PKR",
  "500k+ PKR",
] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(160)
    .transform((value) => value.toLowerCase()),
  businessType: z.enum(businessTypes),
  city: z.string().trim().min(2, "City is required").max(60),
  phone: z
    .string()
    .trim()
    .transform((value, ctx) => {
      const normalized = normalizePhone(value);
      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid Pakistani mobile number",
        });
        return z.NEVER;
      }
      return normalized;
    })
    .pipe(z.string().regex(/^\+923\d{9}$/)),
  budget: z.enum(budgetOptions),
});

export type LeadInput = z.infer<typeof leadSchema>;
