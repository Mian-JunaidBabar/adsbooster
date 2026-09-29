import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "../../../lib/lead-schema";
import { env } from "../../../lib/env";

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anonymous";
}

function isWithinRateLimit(key: string) {
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

  try {
    const payload = await request.json();
    const parsed = leadSchema.parse(payload);

    if (
      !env.GOOGLE_SHEETS_WEBHOOK_URL ||
      !env.GOOGLE_SHEETS_WEBHOOK_SECRET ||
      !env.RESEND_API_KEY
    ) {
      return NextResponse.json(
        { error: "Lead service is not configured yet." },
        { status: 503 },
      );
    }

    const leadId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
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
        source: "landing-page",
      }),
      cache: "no-store",
    });

    const sheetResult = (await sheetResponse.json().catch(() => null)) as {
      ok?: boolean;
    } | null;

    if (!sheetResponse.ok || sheetResult?.ok !== true) {
      return NextResponse.json(
        { error: "We could not save your enquiry. Please try again." },
        { status: 502 },
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const notificationSubject = `New ad audit enquiry from ${parsed.name}`;
    const [leadEmail, notificationEmail] = await Promise.all([
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: parsed.email,
        subject: "We received your AdsBoosters.pk enquiry",
        html: buildLeadConfirmationEmail(parsed.name, parsed.businessType),
      }),
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.LEAD_NOTIFICATION_EMAIL,
        subject: notificationSubject,
        html: buildNotificationEmail(parsed, leadId),
      }),
    ]);

    if (leadEmail.error || notificationEmail.error) {
      return NextResponse.json(
        {
          error:
            "Your enquiry was saved, but the confirmation email could not be sent.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, leadId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Your enquiry could not be sent.",
      },
      { status: 400 },
    );
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
