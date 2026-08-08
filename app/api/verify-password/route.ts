import { NextRequest, NextResponse } from "next/server";

const CLIENT_PASSWORD = "1122";

const LIMIT = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= LIMIT) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
          { ok: false, error: "Too many attempts. Try again later." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    } else {
      attempts.delete(ip);
    }
  }

  const { password } = await req.json();
  const ok = password === CLIENT_PASSWORD;

  if (!ok) {
    const current = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    attempts.set(ip, current);
  } else {
    attempts.delete(ip);
  }

  return NextResponse.json({ ok });
}
