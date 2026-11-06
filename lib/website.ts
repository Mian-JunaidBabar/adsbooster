import { z } from "zod";

/**
 * A website as a visitor types it ("shop.pk", "www.shop.pk/menu" or a full
 * https:// link). Adds https:// when missing; the result is a full URL.
 */
export const websiteSchema = z
  .string()
  .trim()
  .min(1, "Enter your website")
  .max(200, "That address is too long")
  .transform((value) =>
    /^https?:\/\//i.test(value) ? value : `https://${value}`,
  )
  .pipe(
    z.url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
      error: "Enter a website like yourwebsite.com",
    }),
  );
