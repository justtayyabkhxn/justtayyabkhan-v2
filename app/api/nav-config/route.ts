import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_NAV_CONFIG, NavConfig, normalizeConfig } from "@/lib/nav-links";
import { getDb } from "@/lib/mongodb";

// Same admin password used across the site (see /api/verify-password).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// The nav config lives as a single document in this collection, keyed by a
// fixed _id so there is always exactly one row to read/update.
const COLLECTION = "nav-config";
const DOC_ID = "nav";

// The stored document is the NavConfig plus our string _id.
type NavConfigDoc = NavConfig & { _id: string };

export const dynamic = "force-dynamic";

async function readConfig(): Promise<NavConfig> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<NavConfigDoc>(COLLECTION)
      .findOne({ _id: DOC_ID });
    // Missing doc → everything enabled. normalizeConfig strips _id and fills gaps.
    return normalizeConfig(doc);
  } catch {
    // No DB / connection error → fall back to everything enabled.
    return { ...DEFAULT_NAV_CONFIG };
  }
}

export async function GET() {
  const config = await readConfig();
  return NextResponse.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  let body: { password?: string; config?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (!ADMIN_PASSWORD || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const config = normalizeConfig(body.config);

  try {
    const db = await getDb();
    await db
      .collection<NavConfigDoc>(COLLECTION)
      .updateOne({ _id: DOC_ID }, { $set: config }, { upsert: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not persist config (database unavailable?)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, config });
}
