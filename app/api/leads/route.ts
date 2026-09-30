import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { leadSchema } from "../../../lib/lead-schema";
import { env } from "../../../lib/env";

// Soft rate limit per serverless instance. Note: in a serverless environment, each
// instance keeps its own memory, so this provides soft burst protection rather than a global limit.
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

function isWithinRateLimit(key: string) {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.PLAYWRIGHT_TEST === "true"
  ) {
    return true;
  }
  const now = Date.now();
  const bucket = rateLimit.get(key);

  if (!bucket || bucket.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (bucket.count >= 5) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const key = getClientKey(request);

  if (!isWithinRateLimit(key)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = leadSchema.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fields: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !fields[path]) {
          fields[path] = issue.message;
        }
      }
      return NextResponse.json(
        { error: "Please check the highlighted fields.", fields },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot check
  if (parsed.company && parsed.company.trim().length > 0) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  // Minimum submission time check (2 seconds)
  if (parsed.startedAt) {
    const startedTime = new Date(parsed.startedAt).getTime();
    if (!isNaN(startedTime) && Date.now() - startedTime < 2000) {
      return NextResponse.json({ success: true }, { status: 201 });
    }
  }

  if (
    !isHttpUrl(env.GOOGLE_SHEETS_WEBHOOK_URL) ||
    !env.GOOGLE_SHEETS_WEBHOOK_SECRET
  ) {
    return NextResponse.json(
      { error: "Lead service is not configured yet." },
      { status: 503 },
    );
  }

  const leadId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  try {
    const sheetResponse = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env.GOOGLE_SHEETS_WEBHOOK_SECRET,
        id: leadId,
        createdAt,
        name: parsed.name,
        email: parsed.email,
        businessType: parsed.businessType,
        city: parsed.city,
        phone: parsed.phone,
        budget: parsed.budget,
        audience: parsed.audience,
        utmSource: parsed.utmSource,
        utmMedium: parsed.utmMedium,
        utmCampaign: parsed.utmCampaign,
        utmContent: parsed.utmContent,
        utmTerm: parsed.utmTerm,
        clickId: parsed.clickId,
        landingUrl: parsed.landingUrl,
        referrer: parsed.referrer,
        source: "landing-page",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const sheetResult = (await sheetResponse.json().catch(() => null)) as {
      ok?: boolean;
      duplicate?: boolean;
    } | null;

    if (!sheetResponse.ok || (!sheetResult?.ok && !sheetResult?.duplicate)) {
      console.warn(
        `Sheet write failed for lead ${leadId} with status ${sheetResponse.status}`,
      );
      return NextResponse.json(
        { error: "We could not save your enquiry. Please try again." },
        { status: 502 },
      );
    }
  } catch {
    console.warn(`Sheet fetch timed out or threw for lead ${leadId}`);
    return NextResponse.json(
      { error: "We could not save your enquiry. Please try again." },
      { status: 502 },
    );
  }

  // Email delivery is best effort
  let emailSent = false;
  if (env.RESEND_API_KEY && env.LEAD_NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const notificationSubject = `New ad audit enquiry from ${parsed.name}`;

      const emailPromises = [
        resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: env.LEAD_NOTIFICATION_EMAIL,
          subject: notificationSubject,
          html: buildNotificationEmail(parsed, leadId),
        }),
      ];

      // Confirmation email only when it can work (not onboarding@resend.dev)
      if (!env.RESEND_FROM_EMAIL.includes("onboarding@resend.dev")) {
        emailPromises.push(
          resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: parsed.email,
            subject: "We received your AdsBoosters.pk enquiry",
            html: buildLeadConfirmationEmail(parsed.name, parsed.businessType),
          }),
        );
      }

      const results = await Promise.allSettled(emailPromises);
      const anyFailed = results.some(
        (r) =>
          r.status === "rejected" ||
          (r.status === "fulfilled" && (r.value as any)?.error),
      );

      if (anyFailed) {
        console.warn(
          `Email delivery failed or partially failed for lead ${leadId}`,
        );
      } else {
        emailSent = true;
      }
    } catch {
      console.warn(`Email delivery threw an error for lead ${leadId}`);
    }
  }

  return NextResponse.json(
    { success: true, leadId, emailSent },
    { status: 201 },
  );
}

function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function buildLeadConfirmationEmail(name: string, businessType: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#0b0e14;line-height:1.6"><div style="background:#0f2b4c;padding:28px 32px;color:#fff"><h1 style="margin:0;font-size:24px">AdsBoosters.pk</h1></div><div style="padding:32px;border:1px solid #e1e4e8"><p>Hi ${escapeHtml(name)},</p><p>Thanks for reaching out about growing your ${escapeHtml(businessType.toLowerCase())}. We have received your details and will review your enquiry.</p><p>Our team will contact you shortly to discuss your free ad audit and the best next step for your business.</p><p style="margin-top:28px">Regards,<br><strong>AdsBoosters.pk</strong></p></div></div>`;
}

function buildNotificationEmail(
  lead: {
    name: string;
    email: string;
    businessType: string;
    city: string;
    phone: string;
    budget: string;
  },
  leadId: string,
) {
  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Business type", lead.businessType],
    ["City", lead.city],
    ["WhatsApp", lead.phone],
    ["Monthly budget", lead.budget],
    ["Lead ID", leadId],
  ];

  return `<div style="font-family:Arial,sans-serif;max-width:640px;color:#0b0e14"><h2>New ad audit enquiry</h2><table style="border-collapse:collapse;width:100%">${rows.map(([label, value]) => `<tr><td style="padding:10px;border:1px solid #e1e4e8;font-weight:bold;background:#f6f7f5">${escapeHtml(label)}</td><td style="padding:10px;border:1px solid #e1e4e8">${escapeHtml(value)}</td></tr>`).join("")}</table></div>`;
}
