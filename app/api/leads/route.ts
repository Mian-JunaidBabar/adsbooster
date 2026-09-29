import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "../../../lib/lead-schema";
import { addLead, readLeads } from "../../../lib/lead-store";

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

export async function GET() {
  const leads = await readLeads();
  return NextResponse.json({ leads });
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
    const record = await addLead({
      name: parsed.name,
      businessType: parsed.businessType,
      city: parsed.city,
      phone: parsed.phone,
      budget: parsed.budget,
    });

    return NextResponse.json(
      { success: true, leadId: record.id },
      { status: 201 },
    );
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
