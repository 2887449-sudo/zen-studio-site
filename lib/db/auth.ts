import { NextResponse } from "next/server";

const DEFAULT_ADMIN_PASSWORD = "zen-admin-2026";

export function getExpectedAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function isAdminRequest(request: Request) {
  const token = request.headers.get("x-admin-token") || "";
  return token === getExpectedAdminPassword();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
