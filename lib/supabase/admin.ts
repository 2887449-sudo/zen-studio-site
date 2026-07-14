import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseEnvironmentStatus() {
  return {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD)
  };
}

export function getSupabaseAdminState() {
  const status = getSupabaseEnvironmentStatus();
  const completelyUnconfigured = !status.hasSupabaseUrl && !status.hasAnonKey && !status.hasServiceRoleKey;

  if (completelyUnconfigured) {
    return { mode: "local" as const, client: null, error: null, status };
  }
  if (!status.hasSupabaseUrl) {
    return { mode: "error" as const, client: null, error: "Missing NEXT_PUBLIC_SUPABASE_URL", status };
  }
  if (!status.hasAnonKey) {
    return { mode: "error" as const, client: null, error: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY", status };
  }
  if (!status.hasServiceRoleKey) {
    return { mode: "error" as const, client: null, error: "Missing SUPABASE_SERVICE_ROLE_KEY", status };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const client = createClient(url!, serviceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return { mode: "supabase" as const, client, error: null, status };
}

export function getSupabaseAdminClient() {
  return getSupabaseAdminState().client;
}

export function hasSupabaseAdminEnv() {
  return getSupabaseAdminState().mode === "supabase";
}
