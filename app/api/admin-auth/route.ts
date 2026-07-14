import { NextResponse } from "next/server";
import { getExpectedAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as { password?: unknown }));
  const password = typeof body.password === "string" ? body.password : "";
  const expectedPassword = getExpectedAdminPassword();

  return NextResponse.json({ ok: password === expectedPassword });
}
