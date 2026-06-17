import { NextResponse } from "next/server";

const DEFAULT_ADMIN_PASSWORD = "zen-admin-2026";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as { password?: unknown }));
  const password = typeof body.password === "string" ? body.password : "";
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  return NextResponse.json({ ok: password === expectedPassword });
}
