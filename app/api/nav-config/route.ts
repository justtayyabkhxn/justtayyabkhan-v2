import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { DEFAULT_NAV_CONFIG, NavConfig, normalizeConfig } from "@/lib/nav-links";

// Same admin password used across the site (see /api/verify-password).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const CONFIG_PATH = path.join(process.cwd(), "data", "nav-config.json");

export const dynamic = "force-dynamic";

async function readConfig(): Promise<NavConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    return normalizeConfig(JSON.parse(raw));
  } catch {
    // Missing/corrupt file → fall back to everything enabled.
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
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not persist config (read-only filesystem?)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, config });
}
