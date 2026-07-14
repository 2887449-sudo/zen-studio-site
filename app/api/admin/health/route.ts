import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { getSupabaseEnvironmentStatus } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  return NextResponse.json({
    ok: true,
    ...getSupabaseEnvironmentStatus()
  });
}
