import { NextResponse } from "next/server";

export const DEFAULT_ADMIN_PASSWORD = "zen-admin-2026";

export function getExpectedAdminPassword() {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (!configured) return DEFAULT_ADMIN_PASSWORD;

  return configured
    .replace(/^ADMIN_PASSWORD\s*=\s*/i, "")
    .replace(/^(["'])(.*)\1$/, "$2")
    .trim();
}

function getBearerPassword(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  return authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";
}

export function getAdminPasswordFromRequest(request: Request) {
  return request.headers.get("x-admin-password")?.trim() || getBearerPassword(request);
}

export function isAdminRequest(request: Request) {
  return getAdminPasswordFromRequest(request) === getExpectedAdminPassword();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
}
