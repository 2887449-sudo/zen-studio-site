import { NextResponse } from "next/server";
import { createSeries, listSeries } from "@/lib/db/series";
import { isAdminRequest, unauthorizedResponse } from "@/lib/db/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ mode: "local", items: [], message: "Supabase is not configured." });
  try {
    return NextResponse.json({ mode: "supabase", items: await listSeries(supabase) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to list series" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." }, { status: 503 });
  try {
    const body = await request.json();
    return NextResponse.json({ mode: "supabase", item: await createSeries(supabase, body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create series" }, { status: 500 });
  }
}
