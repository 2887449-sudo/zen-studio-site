"use client";

import { getAdminToken } from "@/lib/content-storage";

export async function adminFetch<T>(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("x-admin-token", getAdminToken());
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }
  return data as T;
}
