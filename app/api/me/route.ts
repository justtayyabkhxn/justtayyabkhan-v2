import { NextResponse } from "next/server";
import profile from "@/data/profile.json";

// Agent-friendly profile endpoint: stable, guessable path (/api/me),
// schema.org framing so generic agents can parse it without custom rules,
// and CORS enabled so it can be fetched cross-origin from tools/agents.
export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    address: profile.location,
    url: profile.siteUrl,
    description: profile.bio,
    sameAs: [
      profile.contact.linkedin,
      profile.contact.github,
      profile.contact.twitter,
    ],
    email: profile.contact.email,
    ...profile,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
