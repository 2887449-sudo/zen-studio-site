"use client";

import { ADMIN_PASSWORD_STORAGE_KEY, getAdminPassword } from "@/lib/content-storage";

export class AdminApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function adminFetch<T>(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const password = getAdminPassword();
  if (!password) {
    window.sessionStorage.removeItem("zen_admin_authed");
    if (window.location.pathname !== "/admin") window.location.assign("/admin");
    throw new AdminApiError("后台登录已失效，请重新登录。", 401);
  }
  headers.set("x-admin-password", password);
  headers.set("Authorization", `Bearer ${password}`);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data.error === "string" ? data.error : `Request failed (${response.status})`;
    if (response.status === 401) {
      window.sessionStorage.removeItem("zen_admin_authed");
      window.sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
      if (window.location.pathname !== "/admin") window.location.assign("/admin");
    }
    throw new AdminApiError(message, response.status);
  }
  return data as T;
}
