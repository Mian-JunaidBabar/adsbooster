import { promises as fs } from "node:fs";
import path from "node:path";

export type LeadRecord = {
  id: string;
  name: string;
  businessType: string;
  city: string;
  phone: string;
  budget: string;
  createdAt: string;
  source: string;
};

const storagePath = path.join(process.cwd(), "data", "leads.json");

async function ensureFile() {
  await fs.mkdir(path.dirname(storagePath), { recursive: true });
  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, "[]\n", "utf8");
  }
}

export async function readLeads(): Promise<LeadRecord[]> {
  await ensureFile();
  const contents = await fs.readFile(storagePath, "utf8");

  try {
    const parsed = JSON.parse(contents) as LeadRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeLeads(leads: LeadRecord[]) {
  await ensureFile();
  await fs.writeFile(
    storagePath,
    `${JSON.stringify(leads, null, 2)}\n`,
    "utf8",
  );
}

export async function addLead(
  lead: Omit<LeadRecord, "id" | "createdAt" | "source">,
) {
  const leads = await readLeads();
  const record: LeadRecord = {
    id: crypto.randomUUID(),
    source: "landing-page",
    createdAt: new Date().toISOString(),
    ...lead,
  };

  const next = [record, ...leads].slice(0, 200);
  await writeLeads(next);
  return record;
}
